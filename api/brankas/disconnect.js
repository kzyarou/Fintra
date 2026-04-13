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

  const { accessToken, accountId } = req.body || {};

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    console.log('Disconnecting account:', accountId || 'all');
    
    // Revoke token
    const revokeResponse = await fetch(`${BRANKAS_BASE_URL}/v1/token/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        account_id: accountId,
      }),
    });

    if (!revokeResponse.ok) {
      const error = await revokeResponse.json().catch(() => ({ message: 'Revoke failed' }));
      console.error('Revoke error:', error);
    }

    console.log('Account disconnected successfully');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Disconnect error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
