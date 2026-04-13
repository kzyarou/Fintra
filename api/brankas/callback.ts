import type { VercelRequest, VercelResponse } from '@vercel/node';

const BRANKAS_BASE_URL = 'https://api.brankas.com';

// Helper to categorize transactions
function categorizeTransaction(description: string): string {
  if (!description) return 'Other';
  const desc = description.toLowerCase();

  const categories: Record<string, string[]> = {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, institutionId, userId } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
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

    // Step 3: Fetch details for each account
    const connectedAccounts = await Promise.all(
      accounts.map(async (account: any) => {
        // Fetch balance
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

        // Fetch recent transactions (last 30 days)
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const transactionsResponse = await fetch(
          `${BRANKAS_BASE_URL}/v1/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          }
        );

        let transactions: any[] = [];
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          transactions = transactionsData.transactions || [];
        }

        // Format transactions
        const formattedTransactions = transactions.map((txn: any) => ({
          id: txn.id,
          brankasTransactionId: txn.id,
          name: txn.description || 'Transaction',
          description: txn.description || '',
          amount: txn.type === 'debit' ? -Math.abs(txn.amount) : Math.abs(txn.amount),
          date: new Date(txn.transactedAt).toLocaleDateString(),
          category: categorizeTransaction(txn.description),
          icon: 'credit-card',
          tags: ['imported', 'brankas'],
          accountId: account.id,
        }));

        return {
          brankasAccountId: account.id,
          name: account.name || institutionId || 'Connected Account',
          balance: balance,
          currency: account.currency || 'PHP',
          institution: account.institution || institutionId,
          institutionId: institutionId,
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
          transactions: formattedTransactions,
          transactionCount: transactions.length,
        };
      })
    );

    // Return success response
    return res.status(200).json({
      success: true,
      accounts: connectedAccounts,
      message: `Successfully connected ${connectedAccounts.length} account(s)`,
    });

  } catch (error: any) {
    console.error('Brankas callback error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
