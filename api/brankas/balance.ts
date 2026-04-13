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

  const { accessToken, accountId } = req.body;

  if (!accessToken || !accountId) {
    return res.status(400).json({ error: 'Access token and account ID are required' });
  }

  try {
    const response = await fetch(
      `${BRANKAS_BASE_URL}/v1/accounts/${accountId}/balance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: error.message || 'Failed to fetch balance' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Fetch balance error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
