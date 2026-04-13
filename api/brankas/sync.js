const BRANKAS_BASE_URL = 'https://api.brankas.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, accountId, days } = req.body || {};

  if (!accessToken || !accountId) {
    return res.status(400).json({ error: 'Access token and account ID are required' });
  }

  try {
    console.log('Syncing account:', accountId);
    
    // Fetch balance
    const balanceResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${accountId}/balance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    let balance = null;
    if (balanceResponse.ok) {
      const balanceData = await balanceResponse.json();
      balance = balanceData.balance;
    }

    // Fetch transactions
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const transactionsResponse = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${accountId}/transactions?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    let transactions = [];
    if (transactionsResponse.ok) {
      const transactionsData = await transactionsResponse.json();
      transactions = (transactionsData.transactions || []).map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        reference: t.reference,
        transactedAt: t.transactedAt,
      }));
    }

    console.log('Sync complete - Balance:', balance, 'Transactions:', transactions.length);

    return res.status(200).json({
      success: true,
      balance,
      transactions,
    });

  } catch (error) {
    console.error('Sync error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
