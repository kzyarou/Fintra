import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, PieChart, Save, RefreshCw, Calendar } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Account, WalletBudget } from '../types/finance';
import { toast } from 'sonner';
interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAccount?: Account | null;
}
export function BudgetModal({
  isOpen,
  onClose,
  initialAccount
}: BudgetModalProps) {
  const {
    accounts,
    walletBudgets,
    updateWalletBudget,
    currencySymbol,
    budgetSettings,
    updateBudgetSettings,
    budgetModalTab
  } = useFinance();
  const [activeTab, setActiveTab] = useState<'wallet' | 'settings'>('wallet');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [cycle, setCycle] = useState<
    'weekly' | 'biweekly' | 'monthly' | 'yearly'>(
    'monthly');
  const [rollover, setRollover] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setActiveTab(budgetModalTab);
      if (initialAccount) {
        setSelectedAccountId(initialAccount.id);
      } else if (accounts.length > 0) {
        setSelectedAccountId(accounts[0].id);
      }
    }
  }, [isOpen, initialAccount, accounts, budgetModalTab]);
  useEffect(() => {
    if (selectedAccountId) {
      const existingBudget = walletBudgets.find(
        (b) => b.accountId === selectedAccountId
      );
      if (existingBudget) {
        setBudgetAmount(existingBudget.amount.toString());
        setCycle(existingBudget.cycle);
        setRollover(existingBudget.rollover);
      } else {
        setBudgetAmount('');
        setCycle(budgetSettings.defaultCycle);
        setRollover(budgetSettings.rolloverEnabled);
      }
    }
  }, [selectedAccountId, walletBudgets, budgetSettings]);
  const handleSaveWalletBudget = () => {
    if (!selectedAccountId) return;
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    updateWalletBudget({
      accountId: selectedAccountId,
      amount,
      cycle,
      rollover
    });
    toast.success('Wallet budget saved');
    onClose();
  };
  const handleSaveSettings = () => {
    updateBudgetSettings({
      rolloverEnabled: rollover,
      defaultCycle: cycle
    });
    toast.success('Budget settings saved');
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
            className="bg-white dark:bg-[#2C2C2E] w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto hide-scrollbar">
            
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                  Budgeting
                </h2>
                <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                
                  <X size={24} />
                </button>
              </div>

              <div className="flex bg-gray-100 dark:bg-[#3A3A3C] p-1 rounded-xl mb-6">
                <button
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-white dark:bg-[#2C2C2E] text-charcoal dark:text-[#F5F5F7] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                
                  Wallet Budget
                </button>
                <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-[#2C2C2E] text-charcoal dark:text-[#F5F5F7] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                
                  Settings
                </button>
              </div>

              {activeTab === 'wallet' &&
            <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                      Select Wallet
                    </label>
                    <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] font-bold focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all">
                  
                      {accounts.map((acc) =>
                  <option key={acc.id} value={acc.id}>
                          {acc.name} ({currencySymbol}
                          {acc.balance})
                        </option>
                  )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                      Budget Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                        {currencySymbol}
                      </span>
                      <input
                    type="text"
                    inputMode="decimal"
                    value={budgetAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      if (val.split('.').length > 2) return;
                      setBudgetAmount(val);
                    }}
                    placeholder="0.00"
                    className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-10 pr-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg" />
                  
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                      Cycle
                    </label>
                    <select
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value as any)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] font-bold focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all">
                  
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-[#3A3A3C] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${rollover ? 'bg-emerald/20 text-emerald' : 'bg-white dark:bg-[#2C2C2E] text-gray-400'}`}>
                    
                        <RefreshCw size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                          Rollover
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Carry over unused budget
                        </p>
                      </div>
                    </div>
                    <button
                  onClick={() => setRollover(!rollover)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${rollover ? 'bg-emerald' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  
                      <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${rollover ? 'translate-x-6' : 'translate-x-0'}`} />
                  
                    </button>
                  </div>
                  <button
                onClick={handleSaveWalletBudget}
                className="w-full bg-emerald text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2">
                
                    <Save size={20} />
                    Save Budget
                  </button>
                </div>
            }

              {activeTab === 'settings' &&
            <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-2 ml-1">
                      Default Cycle
                    </label>
                    <select
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value as any)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] font-bold focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all">
                  
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-[#3A3A3C] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${rollover ? 'bg-emerald/20 text-emerald' : 'bg-white dark:bg-[#2C2C2E] text-gray-400'}`}>
                    
                        <RefreshCw size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                          Default Rollover
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Carry over unused budget by default
                        </p>
                      </div>
                    </div>
                    <button
                  onClick={() => setRollover(!rollover)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${rollover ? 'bg-emerald' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  
                      <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${rollover ? 'translate-x-6' : 'translate-x-0'}`} />
                  
                    </button>
                  </div>
                  <button
                onClick={handleSaveSettings}
                className="w-full bg-emerald text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2">
                
                    <Save size={20} />
                    Save Settings
                  </button>
                </div>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}