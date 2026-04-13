import React, { useEffect, useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Landmark,
  PiggyBank,
  Save,
  Trash2 } from
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

export function EditAccountModal({
  account,
  isOpen,
  onClose




}: {account: Account | null;isOpen: boolean;onClose: () => void;}) {
  const { updateAccount, deleteAccount, currencySymbol } = useFinance();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState<Account['type']>('card');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useEffect(() => {
    if (account && isOpen) {
      setName(account.name);
      setBalance(account.balance.toString());
      setSelectedType(account.type);
      setShowDeleteConfirm(false);
    }
  }, [account, isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !account) return;
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
    updateAccount(account.id, {
      name: finalName,
      type: selectedType,
      balance: numBalance,
      icon: typeConfig?.iconKey || 'credit-card'
    });
    toast.success('Account updated');
    onClose();
  };
  const handleDelete = () => {
    if (!account) return;
    deleteAccount(account.id);
    toast.success('Account deleted');
    onClose();
  };
  if (!account) return null;
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
            className="bg-white dark:bg-[#2C2C2E] w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl pointer-events-auto relative overflow-hidden">
            
              {showDeleteConfirm ?
            <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Trash2 size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
                    Delete Account?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                    Are you sure you want to delete "{account.name}"? This will
                    not delete its transactions, but the account will be
                    removed.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-softgray dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
                  
                      Cancel
                    </button>
                    <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-colors shadow-md">
                  
                      Delete
                    </button>
                  </div>
                </div> :

            <>
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mb-6" />

                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                        Edit Account
                      </h2>
                    </div>
                    <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                  
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                            <span className="text-xs font-bold">
                              {at.label}
                            </span>
                          </button>
                    )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                        Name
                      </label>
                      <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg"
                    required />
                  
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                        Balance
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
                      className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-10 pr-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg" />
                    
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2">
                    
                        <Trash2 size={20} />
                      </button>
                      <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`flex-[3] font-bold py-4 rounded-2xl transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 ${!name.trim() ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-emerald text-white hover:bg-emerald-600'}`}>
                    
                        <Save size={20} />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}