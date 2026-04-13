import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { getSession } from '../services/brankas';

export function CallbackPage() {
  const { setActivePage, addConnectedAccount } = useFinance();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [institutionName, setInstitutionName] = useState<string>('your account');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      // Get stored session info
      const sessionId = localStorage.getItem('brankas_session_id');
      const institution = localStorage.getItem('brankas_institution');
      const institutionId = localStorage.getItem('brankas_institution_id');

      if (institution) {
        setInstitutionName(institution);
      }

      if (!sessionId) {
        setStatus('error');
        setErrorMessage('No session found. Please try connecting again.');
        return;
      }

      try {
        // Poll for session status
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout

        while (attempts < maxAttempts) {
          const session = await getSession(sessionId);

          if (session.status === 'success') {
            // Session completed successfully
            if (session.accounts && session.accounts.length > 0) {
              const brankasAccount = session.accounts[0];

              // Add the connected account
              addConnectedAccount({
                name: institution || brankasAccount.name || 'Connected Account',
                balance: brankasAccount.balance || 0,
                icon: institutionId?.includes('gcash') || institutionId?.includes('maya') || institutionId?.includes('shopeepay') || institutionId?.includes('paymaya')
                  ? 'wallet'
                  : 'landmark',
                connectedAccountId: brankasAccount.id,
                institution: institution || brankasAccount.institutionName,
                institutionId: institutionId || brankasAccount.institution,
              });

              // Clear stored session info
              localStorage.removeItem('brankas_session_id');
              localStorage.removeItem('brankas_institution');
              localStorage.removeItem('brankas_institution_id');

              setStatus('success');
              return;
            } else {
              setStatus('error');
              setErrorMessage('No accounts found. Please try again.');
              return;
            }
          } else if (session.status === 'failed') {
            setStatus('error');
            setErrorMessage('Authentication failed. Please try again.');
            return;
          }

          // Wait 1 second before next poll
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        }

        // Timeout
        setStatus('error');
        setErrorMessage('Connection timed out. Please try again.');
      } catch (err) {
        console.error('Failed to process Brankas callback:', err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    processCallback();
  }, [addConnectedAccount]);
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-8 shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-[#3A3A3C]">
        
        {status === 'loading' &&
        <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-emerald animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
              Connecting your account...
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Fetching your financial data from {institutionName}...
            </p>
          </div>
        }

        {status === 'success' &&
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
              Account Connected Successfully
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
              Your {institutionName} account is now connected and synced.
            </p>
            <button
            onClick={() => {
              window.history.replaceState({}, document.title, '/');
              setActivePage('home');
            }}
            className="w-full bg-emerald text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-card flex items-center justify-center gap-2">
            
              Go to Dashboard <ArrowRight size={20} />
            </button>
          </div>
        }

        {status === 'error' &&
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 text-center">
              {errorMessage || "We couldn't connect your account. Please try again."}
            </p>
            <button
            onClick={() => {
              window.history.replaceState({}, document.title, '/');
              setActivePage('accounts');
            }}
            className="w-full bg-gray-100 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
            
              Return to Accounts
            </button>
          </div>
        }

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-left">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
            🔒 Security Notice for Developers
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Never expose your Brankas Secret Key in your frontend React code.
            You must set up a secure backend server (Node.js, Python, etc.) to
            handle the token exchange and API calls.
          </p>
        </div>
      </motion.div>
    </div>);

}