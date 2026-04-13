# Firebase Setup Guide for Fintra

This guide walks you through setting up Firebase for Fintra with Brankas integration.

## Prerequisites

1. Node.js 18+ installed
2. Firebase CLI installed globally: `npm install -g firebase-tools`
3. A Firebase project created at https://console.firebase.google.com/

## Project Info

- **Firebase Project ID**: `kash-a97db`
- **Firebase Project Name**: kash
- **Region**: `us-central1` (default)

## Step 1: Login to Firebase

```bash
firebase login
```

## Step 2: Install Functions Dependencies

```bash
cd functions
npm install
```

## Step 3: Set Environment Variables

Set your Brankas Secret Key (never commit this to git):

```bash
firebase functions:config:set brankas.secret="SANDBOX-ImDnGc0tftvcNv7yNAj4WKV1YBfPFMfh3DKox9c0f7KfHYcEB4i1Btr1lsy9WiK4"
```

For production, use your production key:
```bash
firebase functions:config:set brankas.secret="YOUR_PRODUCTION_SECRET_KEY"
```

## Step 4: Deploy Functions

Deploy all Firebase Functions:

```bash
firebase deploy --only functions
```

Or deploy a specific function:
```bash
firebase deploy --only functions:brankasCallback
```

## Step 5: Update Frontend Function URL

After deploying, Firebase will show you the function URLs. Update `src/pages/CallbackPage.tsx`:

```typescript
const FIREBASE_FUNCTION_URL = 'https://us-central1-kash-a97db.cloudfunctions.net/brankasCallback';
```

Replace `us-central1` with your actual region if different.

## Step 6: Deploy Frontend to Firebase Hosting (Optional)

Build the app:
```bash
npm run build
```

Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

Or deploy everything at once:
```bash
firebase deploy
```

## Available Functions

### 1. `brankasCallback` (HTTP)
- **Endpoint**: `https://us-central1-kash-a97db.cloudfunctions.net/brankasCallback`
- **Method**: POST
- **Purpose**: Exchanges Brankas auth code for account access
- **Body**: `{ code: string, institutionId: string, userId: string }`

### 2. `syncAccount` (Callable)
- **Purpose**: Syncs latest balance and transactions
- **Usage**: `firebase.functions().httpsCallable('syncAccount')({ accountId })`

### 3. `disconnectAccount` (Callable)
- **Purpose**: Removes bank connection
- **Usage**: `firebase.functions().httpsCallable('disconnectAccount')({ accountId })`

## Firestore Database Structure

The functions will create these collections:

```
connectedAccounts/{accountId}
  - userId: string
  - brankasAccountId: string
  - name: string
  - type: "connected"
  - balance: number
  - currency: string
  - institution: string
  - institutionId: string
  - accessToken: string (encrypted in production)
  - refreshToken: string (encrypted in production)
  - createdAt: timestamp
  - lastSyncAt: timestamp

transactions/{transactionId}
  - userId: string
  - accountId: string
  - brankasTransactionId: string
  - name: string
  - description: string
  - amount: number
  - date: string
  - category: string
  - tags: string[]
```

## Security Rules

Add these Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Connected accounts - users can only access their own
    match /connectedAccounts/{accountId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Transactions - users can only access their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Testing Locally

### Test Functions Locally

```bash
firebase emulators:start --only functions
```

The emulator will give you a local URL like `http://localhost:5001/kash-a97db/us-central1/brankasCallback`

Update your frontend to use the emulator URL for testing:
```typescript
const FIREBASE_FUNCTION_URL = 'http://localhost:5001/kash-a97db/us-central1/brankasCallback';
```

### Test with curl

```bash
curl -X POST http://localhost:5001/kash-a97db/us-central1/brankasCallback \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code","institutionId":"gcash","userId":"test_user_123"}'
```

## Troubleshooting

### Function deployment fails
- Check Node.js version (must be 18+)
- Ensure `functions/package.json` dependencies are installed
- Run `firebase functions:log` to see error logs

### CORS errors
- The functions already include CORS handling
- Ensure your frontend domain is allowed in Firebase Hosting or configure CORS properly

### Authentication errors
- Make sure user is logged in before calling Brankas functions
- Check that `useAuth()` is working properly

### Brankas API errors
- Verify your secret key is set: `firebase functions:config:get`
- Check Brankas dashboard for API status
- Ensure callback URL matches exactly what's configured in Brankas

## Production Checklist

- [ ] Switch to production Brankas secret key
- [ ] Update `PRODUCTION_CALLBACK_URL` in `brankas.ts`
- [ ] Set up proper Firestore security rules
- [ ] Enable Firebase Authentication (Email/Password, Google, etc.)
- [ ] Test on staging environment first
- [ ] Set up Firebase App Check for additional security
- [ ] Configure Firebase billing ( Blaze plan required for functions )

## Resources

- Firebase Console: https://console.firebase.google.com/project/kash-a97db
- Firebase Functions Docs: https://firebase.google.com/docs/functions
- Brankas API Docs: https://brankas.com/developers
