import type { VercelRequest, VercelResponse } from '@vercel/node';

const BRANKAS_BASE_URL = 'https://api.brankas.com';

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

  const { accessToken, refreshToken, brankasAccountId, lastSyncAt } = req.body;

  if (!accessToken || !brankasAccountId) {
    return res.status(400).json({ error: 'Access token and account ID are required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    let currentAccessToken = accessToken;

    // Check if token might be expired and refresh if needed
    // Note: In a real implementation, you'd store and check tokenExpiresAt
    // For now, we'll try with current token and refresh if it fails

    // Fetch latest balance
    let balanceResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${brankasAccountId}/balance`,
      {
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
        },
      }
    );

    // If unauthorized, try to refresh token
    if (balanceResponse.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${BRANKAS_BASE_URL}/v1/oauth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        currentAccessToken = refreshData.access_token;

        // Retry balance fetch with new token
        balanceResponse = await fetch(
          `${BRANKAS_BASE_URL}/v1/accounts/${brankasAccountId}/balance`,
          {
            headers: {
              'Authorization': `Bearer ${currentAccessToken}`,
            },
          }
        );
      }
    }

    let newBalance = 0;
    if (balanceResponse.ok) {
      const balanceData = await balanceResponse.json();
      newBalance = balanceData.balance || 0;
    }

    // Fetch new transactions since last sync
    const startDate = lastSyncAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date().toISOString();

    const transactionsResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${brankasAccountId}/transactions?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
        },
      }
    );

    let newTransactions: any[] = [];
    if (transactionsResponse.ok) {
      const transactionsData = await transactionsResponse.json();
      const transactions = transactionsData.transactions || [];

      // Format transactions
      newTransactions = transactions.map((txn: any) => ({
        id: txn.id,
        brankasTransactionId: txn.id,
        name: txn.description || 'Transaction',
        description: txn.description || '',
        amount: txn.type === 'debit' ? -Math.abs(txn.amount) : Math.abs(txn.amount),
        date: new Date(txn.transactedAt).toLocaleDateString(),
        category: categorizeTransaction(txn.description),
        icon: 'credit-card',
        tags: ['imported', 'brankas'],
      }));
    }

    return res.status(200).json({
      success: true,
      newBalance,
      newAccessToken: currentAccessToken !== accessToken ? currentAccessToken : undefined,
      newTransactions,
      newTransactionsCount: newTransactions.length,
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
