import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Landmark,
  PiggyBank,
  Wallet } from
'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Account } from '../types/finance';
const ACCOUNT_TYPES: {
  type: Account['type'];
  label: string;
  icon: React.ReactNode;
  iconKey: string;
}[] = [
{
  type: 'card',
  label: 'Card',
  icon: <CreditCard size={24} />,
  iconKey: 'credit-card'
},
{
  type: 'cash',
  label: 'Cash',
  icon: <Banknote size={24} />,
  iconKey: 'banknote'
},
{
  type: 'bank',
  label: 'Bank',
  icon: <Landmark size={24} />,
  iconKey: 'landmark'
},
{
  type: 'savings',
  label: 'Savings',
  icon: <PiggyBank size={24} />,
  iconKey: 'piggy-bank'
}];

export function AddAccountModal({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) {
  const { addAccount, currencySymbol } = useFinance();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState<Account['type']>('card');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    let finalName = name.trim();
    const lowerName = finalName.toLowerCase();
    if (lowerName === 'gcash') finalName = 'GCash';else
    if (lowerName === 'paypal') finalName = 'PayPal';else
    if (lowerName === 'paymaya' || lowerName === 'maya')
    finalName = 'PayMaya';else
    if (lowerName === 'grabpay') finalName = 'GrabPay';else
    if (lowerName === 'alibaba') finalName = 'Alibaba';
    const numBalance = parseFloat(balance) || 0;
    const typeConfig = ACCOUNT_TYPES.find((t) => t.type === selectedType);
    addAccount({
      name: finalName,
      type: selectedType,
      balance: numBalance,
      icon: typeConfig?.iconKey || 'credit-card'
    });
    toast.success(`${finalName} account created`);
    setName('');
    setBalance('');
    setSelectedType('card');
    onClose();
  };
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
          onClick={onClose}
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
            className="bg-white dark:bg-[#2C2C2E] w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl pointer-events-auto">
            
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                    New Account
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                    Add a wallet or savings account
                  </p>
                </div>
                <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Type */}
                <div>
                  <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3 ml-1">
                    Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCOUNT_TYPES.map((at) =>
                  <button
                    key={at.type}
                    type="button"
                    onClick={() => setSelectedType(at.type)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedType === at.type ? 'border-emerald bg-emerald/5 dark:bg-emerald/10 text-emerald' : 'border-transparent bg-black/5 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-[#4A4A4C]'}`}>
                    
                        <span className="text-emerald">{at.icon}</span>
                        <span className="text-xs font-bold">{at.label}</span>
                      </button>
                  )}
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                    Name
                  </label>
                  <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Wallet, Travel Fund..."
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg"
                  autoFocus
                  required />
                
                </div>

                {/* Starting Balance */}
                <div>
                  <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                    Starting Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                    type="text"
                    inputMode="decimal"
                    value={balance}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      if (val.split('.').length > 2) return;
                      setBalance(val);
                    }}
                    placeholder="0.00"
                    className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-10 pr-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg" />
                  
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#2C2C2E] flex items-center justify-center shadow-sm text-emerald">
                    {ACCOUNT_TYPES.find((t) => t.type === selectedType)?.icon}
                  </div>
                  <div>
                    <p className="font-bold text-charcoal dark:text-[#F5F5F7]">
                      {name || 'Account Name'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {currencySymbol}
                      {(parseFloat(balance) || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                    </p>
                  </div>
                </div>

                <button
                type="submit"
                disabled={!name.trim()}
                className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 ${!name.trim() ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-emerald text-white hover:bg-emerald-600'}`}>
                
                  <Wallet size={20} />
                  Create Account
                </button>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}