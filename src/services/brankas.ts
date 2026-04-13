// Brankas API Integration Service
// Uses Brankas Direct API for Philippine e-wallets and banks

const BRANKAS_BASE_URL = 'https://api.brankas.com';
const SECRET_KEY = 'SANDBOX-ImDnGc0tftvcNv7yNAj4WKV1YBfPFMfh3DKox9c0f7KfHYcEB4i1Btr1lsy9WiK4';

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

// Create a Brankas session for bank linking
export async function createSession(
  institution: InstitutionId,
  redirectUrl: string = window.location.origin + '/callback'
): Promise<BrankasSession> {
  const response = await fetch(`${BRANKAS_BASE_URL}/v1/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SECRET_KEY}`,
    },
    body: JSON.stringify({
      institution,
      redirect_url: redirectUrl,
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

// Get session status and account details
export async function getSession(sessionId: string): Promise<BrankasSession & {
  accounts?: BrankasAccount[];
}> {
  const response = await fetch(`${BRANKAS_BASE_URL}/v1/sessions/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get session');
  }

  return response.json();
}

// Fetch transactions for an account
export async function fetchTransactions(
  accountId: string,
  startDate?: string,
  endDate?: string
): Promise<BrankasTransaction[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${BRANKAS_BASE_URL}/v1/accounts/${accountId}/transactions?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch transactions');
  }

  const data = await response.json();
  return data.transactions || [];
}

// Get account balance
export async function fetchBalance(accountId: string): Promise<{
  balance: number;
  currency: string;
}> {
  const response = await fetch(
    `${BRANKAS_BASE_URL}/v1/accounts/${accountId}/balance`,
    {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch balance');
  }

  return response.json();
}

// Disconnect an account
export async function disconnectAccount(accountId: string): Promise<void> {
  const response = await fetch(
    `${BRANKAS_BASE_URL}/v1/accounts/${accountId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to disconnect account');
  }
}
