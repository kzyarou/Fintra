import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Landmark, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { createSession, PH_INSTITUTIONS, InstitutionId } from '../services/brankas';

interface Institution {
  id: InstitutionId;
  name: string;
  color: string;
  icon: React.ReactNode;
  type: 'bank' | 'wallet';
}

const INSTITUTIONS: Institution[] = PH_INSTITUTIONS.map((inst) => ({
  id: inst.id,
  name: inst.name,
  color: inst.color,
  icon: inst.type === 'wallet' ? <Wallet size={24} /> : <Landmark size={24} />,
  type: inst.type,
}));

type Step = 'select' | 'redirect' | 'loading' | 'error';
export function ConnectWalletModal({
  isOpen,
  onClose
}: {isOpen: boolean;onClose: () => void;}) {
  const [step, setStep] = useState<Step>('select');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedInstitution(null);
      setLoadingTextIndex(0);
      setErrorMessage('');
    }
  }, [isOpen]);
  // Handle step transitions - create real Brankas session
  useEffect(() => {
    if (step === 'redirect' && selectedInstitution) {
      const createBrankasSession = async () => {
        try {
          setStep('loading');
          const session = await createSession(
            selectedInstitution.id,
            window.location.origin + '/callback'
          );
          // Store session info for callback handling
          localStorage.setItem('brankas_session_id', session.id);
          localStorage.setItem('brankas_institution', selectedInstitution.name);
          localStorage.setItem('brankas_institution_id', selectedInstitution.id);
          // Redirect to Brankas
          window.location.href = session.redirectUrl;
        } catch (err) {
          console.error('Failed to create Brankas session:', err);
          setErrorMessage(err instanceof Error ? err.message : 'Failed to connect');
          setStep('error');
        }
      };
      createBrankasSession();
    }
  }, [step, selectedInstitution]);
  const handleSelect = (inst: Institution) => {
    setSelectedInstitution(inst);
    setStep('redirect');
  };
  const loadingTexts = selectedInstitution ?
  [
  `Connecting to ${selectedInstitution.name}...`,
  'Establishing secure connection...',
  'Almost there...'] :

  [];
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={step === 'select' ? onClose : undefined}
          className="fixed inset-0 bg-charcoal/60 z-[100]" />
        
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
            <motion.div
            initial={{
              y: '100%'
            }}
            animate={{
              y: 0
            }}
            exit={{
              y: '100%'
            }}
            transition={{
              type: 'tween',
              duration: 0.2
            }}
            className="bg-white dark:bg-[#2C2C2E] w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl pointer-events-auto relative overflow-hidden">
            
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mb-6" />

              {step === 'select' &&
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                  <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                
                    <X size={24} />
                  </button>
                </div>
            }

              <AnimatePresence mode="wait">
                {step === 'select' &&
              <motion.div
                key="select"
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}
                className="flex flex-col h-full">
                
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                        Connect Your Money
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Choose your bank or e-wallet to get started
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {INSTITUTIONS.map((inst) =>
                  <button
                    key={inst.id}
                    onClick={() => handleSelect(inst)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-transparent bg-black/5 dark:bg-[#3A3A3C] hover:bg-black/10 dark:hover:bg-[#4A4A4C] transition-all group">
                    
                          <div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-[#2C2C2E] shadow-sm transition-transform group-hover:scale-110"
                      style={{
                        color: inst.color
                      }}>
                      
                            {inst.icon}
                          </div>
                          <span className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                            {inst.name}
                          </span>
                        </button>
                  )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <ShieldCheck size={14} className="text-emerald" />
                      <span>Your credentials are never stored by Fintra</span>
                    </div>
                  </motion.div>
              }

                {step === 'redirect' && selectedInstitution &&
              <motion.div
                key="redirect"
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 1.05
                }}
                className="flex flex-col items-center justify-center py-8 text-center">
                
                    <div className="relative mb-8">
                      <div
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-white dark:bg-[#2C2C2E] shadow-lg z-10 relative"
                    style={{
                      color: selectedInstitution.color
                    }}>
                    
                        {selectedInstitution.icon}
                      </div>
                      <motion.div
                    className="absolute inset-0 rounded-full border-4 opacity-20"
                    style={{
                      borderColor: selectedInstitution.color
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }} />
                  
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald rounded-full flex items-center justify-center border-2 border-white dark:border-[#2C2C2E] z-20">
                        <ShieldCheck size={16} className="text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
                      Redirecting to secure login...
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 max-w-[280px]">
                      You'll be taken to {selectedInstitution.name}'s secure
                      page to authorize access
                    </p>

                    <div className="bg-emerald/10 text-emerald text-xs font-bold px-4 py-2 rounded-full">
                      Fintra never sees your login credentials
                    </div>
                  </motion.div>
              }

                {step === 'loading' && selectedInstitution &&
              <motion.div
                key="loading"
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="flex flex-col items-center justify-center py-12 text-center">
                
                    <Loader2
                  size={48}
                  className="text-emerald animate-spin mb-6" />
                
                    <AnimatePresence mode="wait">
                      <motion.h3
                    key={loadingTextIndex}
                    initial={{
                      opacity: 0,
                      y: 10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: -10
                    }}
                    className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                    
                        {loadingTexts[loadingTextIndex]}
                      </motion.h3>
                    </AnimatePresence>
                  </motion.div>
              }

                {step === 'error' &&
              <motion.div
                key="error"
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="flex flex-col items-center justify-center py-8 text-center">
                
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={40} className="text-red-500" />
                    </div>

                    <h3 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
                      Connection Failed
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 max-w-[280px]">
                      {errorMessage || 'We couldn\'t connect your account. Please try again.'}
                    </p>

                    <button
                  onClick={() => setStep('select')}
                  className="px-6 py-3 bg-emerald text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors">
                  
                      Try Again
                    </button>
                  </motion.div>
              }
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}