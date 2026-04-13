import type { VercelRequest, VercelResponse } from '@vercel/node';

const BRANKAS_BASE_URL = 'https://api.brankas.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    const response = await fetch(`${BRANKAS_BASE_URL}/v1/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: error.message || 'Failed to get session' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Get session error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
