// Brankas API Integration Service
// Frontend service - all secure operations go through Vercel backend
// Deploy: Force fresh build

const VERCEL_API_URL = '/api/brankas';

// Note: Secret key has been moved to Vercel backend for security

// Philippine institutions supported by Brankas
export const PH_INSTITUTIONS = [
  { id: 'gcash', name: 'GCash', type: 'wallet', color: '#0070E0' },
  { id: 'paymaya', name: 'Maya', type: 'wallet', color: '#00B274' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'wallet', color: '#EE4D2D' },
  { id: 'bdo', name: 'BDO', type: 'bank', color: '#0033A0' },
  { id: 'bpi', name: 'BPI', type: 'bank', color: '#C41E3A' },
  { id: 'unionbank', name: 'UnionBank', type: 'bank', color: '#F57C00' },
  { id: 'metrobank', name: 'Metrobank', type: 'bank', color: '#1565C0' },
  { id: 'chinabank', name: 'ChinaBank', type: 'bank', color: '#D32F2F' },
  { id: 'rcbc', name: 'RCBC', type: 'bank', color: '#0066B3' },
  { id: 'securitybank', name: 'Security Bank', type: 'bank', color: '#00A651' },
] as const;

export type InstitutionId = typeof PH_INSTITUTIONS[number]['id'];

export interface BrankasSession {
  id: string;
  status: 'pending' | 'success' | 'failed';
  redirectUrl: string;
  institution: InstitutionId;
}

export interface BrankasAccount {
  id: string;
  name: string;
  type: 'savings' | 'checking' | 'wallet';
  currency: string;
  balance: number;
  institution: InstitutionId;
  institutionName: string;
}

export interface BrankasTransaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  transactedAt: string;
  type: 'debit' | 'credit';
}

// Production callback URL - update this to match your deployed app
const PRODUCTION_CALLBACK_URL = 'https://fintraph.vercel.app/callback';

// Create a Brankas session for bank linking (calls Vercel backend)
export async function createSession(
  institution: InstitutionId,
  redirectUrl?: string
): Promise<BrankasSession> {
  // Auto-detect environment: use production URL if not localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const finalRedirectUrl = redirectUrl || (isLocalhost ? window.location.origin + '/callback' : PRODUCTION_CALLBACK_URL);
  
  // Call Vercel backend to create session (secure - no secret in frontend)
  const response = await fetch(`${VERCEL_API_URL}/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      institution,
      redirect_url: finalRedirectUrl,
      country: 'PH',
      products: ['balance', 'transactions'],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create Brankas session');
  }

  return response.json();
}

// Get session status and account details (calls Vercel backend)
export async function getSession(sessionId: string): Promise<BrankasSession & {
  accounts?: BrankasAccount[];
}> {
  const response = await fetch(`${VERCEL_API_URL}/get-session?sessionId=${sessionId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get session');
  }

  return response.json();
}

// Fetch transactions for an account (calls Vercel backend)
export async function fetchTransactions(
  accessToken: string,
  accountId: string,
  startDate?: string,
  endDate?: string
): Promise<BrankasTransaction[]> {
  const response = await fetch(`${VERCEL_API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      accountId,
      startDate,
      endDate,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch transactions');
  }

  const data = await response.json();
  return data.transactions || [];
}

// Get account balance (calls Vercel backend)
export async function fetchBalance(accessToken: string, accountId: string): Promise<{
  balance: number;
  currency: string;
}> {
  const response = await fetch(`${VERCEL_API_URL}/balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      accountId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch balance');
  }

  return response.json();
}

// Disconnect an account (calls Vercel backend)
export async function disconnectAccount(accessToken: string, accountId: string): Promise<void> {
  const response = await fetch(`${VERCEL_API_URL}/disconnect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      accountId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to disconnect account');
  }
}
