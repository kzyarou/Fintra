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

  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    console.error('ERROR: BRANKAS_SECRET_KEY not set');
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens
    const tokenResponse = await fetch(`${BRANKAS_BASE_URL}/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({ message: 'Token exchange failed' }));
      console.error('Token exchange error:', error);
      return res.status(tokenResponse.status).json({ error: error.message });
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch accounts
    console.log('Fetching accounts...');
    const accountsResponse = await fetch(`${BRANKAS_BASE_URL}/v1/accounts`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!accountsResponse.ok) {
      const error = await accountsResponse.json().catch(() => ({ message: 'Failed to fetch accounts' }));
      console.error('Accounts fetch error:', error);
      return res.status(accountsResponse.status).json({ error: error.message });
    }

    const accountsData = await accountsResponse.json();
    
    // Format response
    const accounts = (accountsData.accounts || []).map((acc) => ({
      brankasAccountId: acc.id,
      name: acc.name || 'Unknown Account',
      institution: acc.institutionName || 'Unknown',
      institutionId: acc.institution,
      balance: acc.balance || 0,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null,
    }));

    console.log('Successfully connected', accounts.length, 'accounts');
    
    return res.status(200).json({
      success: true,
      accounts,
    });

  } catch (error) {
    console.error('Callback error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
