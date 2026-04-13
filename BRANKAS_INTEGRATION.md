# Brankas Integration for Fintra

This document describes the Brankas integration that allows users to connect their Philippine e-wallets and bank accounts for automatic transaction tracking.

## Overview

The integration uses Brankas Direct API to:
- Connect Philippine e-wallets (GCash, Maya, ShopeePay) and banks
- Fetch account balances in real-time
- Automatically import transactions into Fintra
- Keep everything synced

## Supported Institutions (Philippines)

### E-Wallets
- GCash
- Maya (PayMaya)
- ShopeePay

### Banks
- BDO
- BPI
- UnionBank
- Metrobank
- ChinaBank
- RCBC
- Security Bank

## Architecture

### Files Created/Modified

1. **`src/services/brankas.ts`** - Brankas API client
   - `createSession()` - Initiates bank linking flow
   - `getSession()` - Polls for session status
   - `fetchTransactions()` - Retrieves transaction history
   - `fetchBalance()` - Gets current balance
   - `disconnectAccount()` - Removes bank connection

2. **`src/types/finance.ts`** - Updated types
   - Added `connected` to Account type
   - Added connected account metadata fields (institutionId, connectedAccountId, etc.)

3. **`src/context/FinanceContext.tsx`** - State management
   - Added `connectedAccounts` state
   - Added `addConnectedAccount()` - Adds new connected account
   - Added `removeConnectedAccount()` - Disconnects and removes
   - Added `syncConnectedAccount()` - Fetches latest data
   - Added `syncAllConnectedAccounts()` - Syncs all connected accounts
   - Updated `totalBalance` to include connected accounts

4. **`src/components/ConnectWalletModal.tsx`** - Bank selection UI
   - Shows Philippine institutions
   - Creates Brankas session
   - Redirects to Brankas auth page
   - Handles errors

5. **`src/components/AccountCard.tsx`** - Account display
   - Added `ConnectedAccountCard` component
   - Shows sync button, disconnect button, last sync time
   - Uses institution brand colors

6. **`src/pages/CallbackPage.tsx`** - OAuth callback handler
   - Polls Brankas for session completion
   - Fetches account details
   - Adds connected account to state
   - Handles errors

7. **`src/pages/AccountsPage.tsx`** - Updated accounts view
   - Shows "Connected Accounts" section
   - Sync all button
   - Includes connected accounts in totals

## Flow

1. User clicks "Connect e-Wallet" in Accounts page
2. User selects institution (e.g., GCash)
3. Frontend calls `createSession(institutionId)`
4. Brankas returns session ID and redirect URL
5. Frontend stores session ID and redirects user to Brankas
6. User authenticates with their bank/e-wallet on Brankas
7. Brankas redirects back to `/callback`
8. Callback page polls `getSession(sessionId)` until complete
9. On success, fetches account info and transactions
10. Adds connected account to Fintra
11. Transactions automatically appear in history

## Security Notes

- **Secret Key**: Currently stored in frontend for sandbox testing. For production, move all Brankas API calls to a backend server.
- **Session Storage**: Session IDs are stored in localStorage temporarily during the auth flow.
- **HTTPS Required**: Brankas requires HTTPS for callbacks in production.

## Configuration

The secret key is configured in `src/services/brankas.ts`:

```typescript
const SECRET_KEY = 'SANDBOX-ImDnGc0tftvcNv7yNAj4WKV1YBfPFMfh3DKox9c0f7KfHYcEB4i1Btr1lsy9WiK4';
```

For production, replace with production key and move to backend.

## Usage

### Connecting an Account

1. Go to Accounts page
2. Click "Connect e-Wallet"
3. Select your bank or e-wallet
4. Complete authentication on Brankas
5. Account appears in "Connected Accounts" section

### Syncing Transactions

- Individual: Click sync button on connected account card
- All: Click sync button in "Connected Accounts" header

### Disconnecting

Click the unlink button on a connected account card. This removes the connection from both Fintra and Brankas.

## API Reference

### Brankas Session Response

```typescript
interface BrankasSession {
  id: string;
  status: 'pending' | 'success' | 'failed';
  redirectUrl: string;
  institution: string;
}
```

### Brankas Account

```typescript
interface BrankasAccount {
  id: string;
  name: string;
  type: 'savings' | 'checking' | 'wallet';
  currency: string;
  balance: number;
  institution: string;
  institutionName: string;
}
```

### Brankas Transaction

```typescript
interface BrankasTransaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  transactedAt: string;
  type: 'debit' | 'credit';
}
```

## Future Improvements

1. **Backend Proxy**: Move API calls to Node.js/Express backend for security
2. **Webhooks**: Use Brankas webhooks for real-time transaction updates instead of polling
3. **Transaction Categorization**: Auto-categorize imported transactions based on description
4. **Duplicate Detection**: Improve transaction deduplication logic
5. **Recurring Detection**: Identify recurring transactions from imported data
