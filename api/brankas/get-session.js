const BRANKAS_BASE_URL = 'https://api.brankas.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query || {};

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    console.error('ERROR: BRANKAS_SECRET_KEY not set');
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    const response = await fetch(`${BRANKAS_BASE_URL}/v1/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get session' }));
      return res.status(response.status).json({ error: error.message });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Get session error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
