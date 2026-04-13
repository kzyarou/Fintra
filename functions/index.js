const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const db = admin.firestore();

// Brankas configuration
const BRANKAS_BASE_URL = 'https://api.brankas.com';
// Get from environment variable (set in .env file for emulator, or Google Cloud Secret for production)
const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

/**
 * Brankas OAuth callback handler
 * Exchanges authorization code for access token and fetches account data
 */
exports.brankasCallback = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { code, institutionId, userId } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      console.log(`Processing Brankas callback for user: ${userId}, institution: ${institutionId}`);

      // Step 1: Exchange code for access token
      const tokenResponse = await fetch(`${BRANKAS_BASE_URL}/v1/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        console.error('Token exchange failed:', error);
        return res.status(400).json({ error: 'Failed to exchange authorization code', details: error });
      }

      const tokenData = await tokenResponse.json();
      const { access_token, refresh_token, expires_in } = tokenData;

      console.log('Token exchange successful');

      // Step 2: Fetch accounts using access token
      const accountsResponse = await fetch(`${BRANKAS_BASE_URL}/v1/accounts`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!accountsResponse.ok) {
        const error = await accountsResponse.json();
        console.error('Failed to fetch accounts:', error);
        return res.status(400).json({ error: 'Failed to fetch accounts', details: error });
      }

      const accountsData = await accountsResponse.json();
      const accounts = accountsData.accounts || [];

      if (accounts.length === 0) {
        return res.status(404).json({ error: 'No accounts found' });
      }

      // Step 3: Store account data in Firestore
      const accountPromises = accounts.map(async (account) => {
        // Fetch balance for each account
        const balanceResponse = await fetch(
          `${BRANKAS_BASE_URL}/v1/accounts/${account.id}/balance`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          }
        );

        let balance = 0;
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          balance = balanceData.balance || 0;
        }

        // Fetch recent transactions
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago

        const transactionsResponse = await fetch(
          `${BRANKAS_BASE_URL}/v1/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          }
        );

        let transactions = [];
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          transactions = transactionsData.transactions || [];
        }

        // Store account in Firestore
        const accountDoc = {
          userId: userId,
          brankasAccountId: account.id,
          name: account.name || institutionId || 'Connected Account',
          type: 'connected',
          balance: balance,
          currency: account.currency || 'PHP',
          institution: account.institution || institutionId,
          institutionId: institutionId,
          status: 'active',
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const accountRef = await db.collection('connectedAccounts').add(accountDoc);

        // Store transactions
        const transactionPromises = transactions.map(async (txn) => {
          return db.collection('transactions').add({
            userId: userId,
            accountId: accountRef.id,
            brankasTransactionId: txn.id,
            name: txn.description || 'Transaction',
            description: txn.description || '',
            amount: txn.type === 'debit' ? -Math.abs(txn.amount) : Math.abs(txn.amount),
            date: new Date(txn.transactedAt).toLocaleDateString(),
            category: categorizeTransaction(txn.description),
            icon: 'credit-card',
            tags: ['imported', 'brankas'],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        await Promise.all(transactionPromises);

        return {
          id: accountRef.id,
          ...accountDoc,
          transactionCount: transactions.length,
        };
      });

      const connectedAccounts = await Promise.all(accountPromises);

      // Return success response
      return res.status(200).json({
        success: true,
        accounts: connectedAccounts,
        message: `Successfully connected ${connectedAccounts.length} account(s)`,
      });

    } catch (error) {
      console.error('Brankas callback error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });
});

/**
 * Sync connected account - fetches latest balance and transactions
 */
exports.syncAccount = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { accountId } = data;
  const userId = context.auth.uid;

  try {
    // Get account from Firestore
    const accountDoc = await db.collection('connectedAccounts').doc(accountId).get();

    if (!accountDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Account not found');
    }

    const account = accountDoc.data();

    if (account.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized');
    }

    // Check if token is expired and refresh if needed
    let accessToken = account.accessToken;
    const tokenExpiresAt = account.tokenExpiresAt?.toDate();

    if (tokenExpiresAt && tokenExpiresAt < new Date()) {
      // Refresh token
      const refreshResponse = await fetch(`${BRANKAS_BASE_URL}/v1/oauth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          refresh_token: account.refreshToken,
        }),
      });

      if (!refreshResponse.ok) {
        throw new functions.https.HttpsError('failed-precondition', 'Token refresh failed');
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Update token in Firestore
      await accountDoc.ref.update({
        accessToken: accessToken,
        refreshToken: refreshData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + refreshData.expires_in * 1000),
      });
    }

    // Fetch latest balance
    const balanceResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${account.brankasAccountId}/balance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    let newBalance = account.balance;
    if (balanceResponse.ok) {
      const balanceData = await balanceResponse.json();
      newBalance = balanceData.balance || 0;
    }

    // Fetch new transactions since last sync
    const lastSync = account.lastSyncAt?.toDate() || new Date(0);
    const startDate = lastSync.toISOString();
    const endDate = new Date().toISOString();

    const transactionsResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${account.brankasAccountId}/transactions?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    let newTransactions = [];
    if (transactionsResponse.ok) {
      const transactionsData = await transactionsResponse.json();
      newTransactions = transactionsData.transactions || [];

      // Store new transactions
      const transactionPromises = newTransactions.map(async (txn) => {
        // Check for duplicates
        const existing = await db
          .collection('transactions')
          .where('brankasTransactionId', '==', txn.id)
          .where('accountId', '==', accountId)
          .get();

        if (existing.empty) {
          return db.collection('transactions').add({
            userId: userId,
            accountId: accountId,
            brankasTransactionId: txn.id,
            name: txn.description || 'Transaction',
            description: txn.description || '',
            amount: txn.type === 'debit' ? -Math.abs(txn.amount) : Math.abs(txn.amount),
            date: new Date(txn.transactedAt).toLocaleDateString(),
            category: categorizeTransaction(txn.description),
            icon: 'credit-card',
            tags: ['imported', 'brankas'],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      });

      await Promise.all(transactionPromises);
    }

    // Update account balance and last sync
    await accountDoc.ref.update({
      balance: newBalance,
      lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      newBalance,
      newTransactionsCount: newTransactions.length,
    };

  } catch (error) {
    console.error('Sync error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Disconnect account - removes connection from Brankas and Firestore
 */
exports.disconnectAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { accountId } = data;
  const userId = context.auth.uid;

  try {
    const accountDoc = await db.collection('connectedAccounts').doc(accountId).get();

    if (!accountDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Account not found');
    }

    const account = accountDoc.data();

    if (account.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized');
    }

    // Revoke access token in Brankas
    await fetch(`${BRANKAS_BASE_URL}/v1/oauth/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        token: account.accessToken,
      }),
    });

    // Delete from Firestore
    await accountDoc.ref.delete();

    // Mark associated transactions as disconnected
    const transactions = await db
      .collection('transactions')
      .where('accountId', '==', accountId)
      .get();

    const batch = db.batch();
    transactions.docs.forEach((doc) => {
      batch.update(doc.ref, { tags: ['imported', 'brankas', 'disconnected'] });
    });
    await batch.commit();

    return { success: true, message: 'Account disconnected successfully' };

  } catch (error) {
    console.error('Disconnect error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Helper function to categorize transactions based on description
 */
function categorizeTransaction(description) {
  if (!description) return 'Other';

  const desc = description.toLowerCase();

  const categories = {
    'Food': ['restaurant', 'food', 'meal', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee', 'mcd', 'jollibee', 'kfc'],
    'Transport': ['transport', 'grab', 'uber', 'taxi', 'bus', 'train', 'mrt', 'lrt', 'jeep', 'tricycle', 'gas', 'fuel'],
    'Shopping': ['shopping', 'mall', 'store', 'buy', 'purchase', 'lazada', 'shopee', 'amazon'],
    'Entertainment': ['entertainment', 'movie', 'cinema', 'netflix', 'spotify', 'game', 'steam', 'youtube', 'disney'],
    'Bills': ['bill', 'utility', 'electric', 'water', 'internet', 'wifi', 'phone', 'load', 'globe', 'smart', 'pldt', 'meralco'],
    'Health': ['health', 'medical', 'hospital', 'clinic', 'pharmacy', 'medicine', 'drug', 'dental', 'doctor'],
    'Education': ['education', 'school', 'tuition', 'course', 'learning', 'book', 'university', 'college'],
    'Salary': ['salary', 'payroll', 'wage', 'income', 'payment received', 'deposit'],
    'Transfer': ['transfer', 'send', 'sent', 'remittance', 'gcash', 'paymaya', 'maya'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => desc.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}
