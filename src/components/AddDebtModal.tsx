import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, DollarSign, AlignLeft, Calendar } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { toast } from 'sonner';
export function AddDebtModal({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) {
  const { addDebt, currencySymbol } = useFinance();
  const [debtorName, setDebtorName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtorName.trim() || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    addDebt({
      debtorName: debtorName.trim(),
      amount: numAmount,
      description: description.trim(),
      dueDate: dueDate || undefined
    });
    toast.success('Debt recorded successfully');
    setDebtorName('');
    setAmount('');
    setDescription('');
    setDueDate('');
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
            
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                    Record Debt
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                    Track money owed to you
                  </p>
                </div>
                <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                
                  <input
                  type="text"
                  placeholder="Debtor Name"
                  value={debtorName}
                  onChange={(e) => setDebtorName(e.target.value)}
                  required
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold" />
                
                </div>

                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    {currencySymbol}
                  </span>
                  <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Amount Owed"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    if (val.split('.').length > 2) return;
                    setAmount(val);
                  }}
                  required
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-10 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg" />
                
                </div>

                <div className="relative">
                  <AlignLeft
                  size={20}
                  className="absolute left-4 top-4 text-gray-400" />
                
                  <textarea
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium resize-none h-24" />
                
                </div>

                <div className="relative">
                  <Calendar
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                
                  <input
                  type={dueDate ? 'date' : 'text'}
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  placeholder="Due Date (Optional)"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] font-bold focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all cursor-pointer" />
                
                </div>

                <button
                type="submit"
                disabled={!debtorName.trim() || !amount}
                className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 mt-2 ${!debtorName.trim() || !amount ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-emerald text-white hover:bg-emerald-600'}`}>
                
                  <Save size={20} />
                  Save Debt
                </button>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}