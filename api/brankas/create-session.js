const BRANKAS_BASE_URL = 'https://api.brankas.com';

module.exports = async function handler(req, res) {
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

  const { institution, redirect_url, country, products } = req.body || {};

  if (!institution) {
    return res.status(400).json({ error: 'Institution is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    console.error('ERROR: BRANKAS_SECRET_KEY not set in environment');
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    console.log('Creating Brankas session for institution:', institution);
    
    const response = await fetch(`${BRANKAS_BASE_URL}/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        institution,
        redirect_url: redirect_url || 'https://fintraph.vercel.app/callback',
        country: country || 'PH',
        products: products || ['balance', 'transactions'],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Brankas API error:', error);
      return res.status(response.status).json({ 
        error: error.message || 'Failed to create Brankas session' 
      });
    }

    const data = await response.json();
    console.log('Session created successfully');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Create session error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
