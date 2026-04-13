import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, AlignLeft, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Debt } from '../types/finance';
import { toast } from 'sonner';
export function RecordPaymentModal({
  isOpen,
  onClose,
  debt




}: {isOpen: boolean;onClose: () => void;debt: Debt | null;}) {
  const { addDebtPayment, currencySymbol } = useFinance();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const remaining = debt ?
  debt.amount - debt.payments.reduce((sum, p) => sum + p.amount, 0) :
  0;
  useEffect(() => {
    if (isOpen && remaining > 0) {
      setAmount(remaining.toString());
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [isOpen, remaining]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (numAmount > remaining) {
      toast.error(
        `Amount cannot exceed remaining balance of ${currencySymbol}${remaining}`
      );
      return;
    }
    addDebtPayment(debt.id, {
      amount: numAmount,
      date,
      note: note.trim() || undefined
    });
    toast.success('Payment recorded successfully');
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && debt &&
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

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                    Record Payment
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                    From{' '}
                    <span className="font-bold text-charcoal dark:text-[#F5F5F7]">
                      {debt.debtorName}
                    </span>
                  </p>
                </div>
                <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                
                  <X size={24} />
                </button>
              </div>

              <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald">
                  Remaining Balance
                </span>
                <span className="text-xl font-bold text-emerald">
                  {currencySymbol}
                  {remaining.toLocaleString()}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    {currencySymbol}
                  </span>
                  <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Payment Amount"
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
                  <Calendar
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                
                  <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] font-bold focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all cursor-pointer" />
                
                </div>

                <div className="relative">
                  <AlignLeft
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                
                  <input
                  type="text"
                  placeholder="Note (Optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium" />
                
                </div>

                <button
                type="submit"
                disabled={!amount}
                className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 mt-2 ${!amount ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-emerald text-white hover:bg-emerald-600'}`}>
                
                  <CreditCard size={20} />
                  Save Payment
                </button>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}