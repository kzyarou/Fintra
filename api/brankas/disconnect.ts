import type { VercelRequest, VercelResponse } from '@vercel/node';

const BRANKAS_BASE_URL = 'https://api.brankas.com';

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

  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  const BRANKAS_SECRET_KEY = process.env.BRANKAS_SECRET_KEY;

  if (!BRANKAS_SECRET_KEY) {
    return res.status(500).json({ error: 'Brankas secret key not configured' });
  }

  try {
    // Revoke access token in Brankas
    const revokeResponse = await fetch(`${BRANKAS_BASE_URL}/v1/oauth/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRANKAS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        token: accessToken,
      }),
    });

    // Even if revoke fails, we consider it disconnected from our side
    if (!revokeResponse.ok) {
      console.warn('Token revoke warning:', await revokeResponse.text());
    }

    return res.status(200).json({
      success: true,
      message: 'Account disconnected successfully',
    });

  } catch (error: any) {
    console.error('Disconnect error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
