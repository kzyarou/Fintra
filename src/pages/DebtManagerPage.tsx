import React, { useMemo, useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  HandCoins,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  CreditCard,
  User,
  Calendar } from
'lucide-react';
import { Debt } from '../types/finance';
import { AddDebtModal } from '../components/AddDebtModal';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
type FilterStatus = 'all' | 'pending' | 'partial' | 'paid' | 'overdue';
export function DebtManagerPage() {
  const { debts, deleteDebt, currencySymbol } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentModalDebt, setPaymentModalDebt] = useState<Debt | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const enrichedDebts = useMemo(() => {
    return debts.map((debt) => {
      const totalPaid = debt.payments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = debt.amount - totalPaid;
      const isOverdue = debt.dueDate && debt.dueDate < today && remaining > 0;
      return {
        ...debt,
        totalPaid,
        remaining,
        isOverdue
      };
    });
  }, [debts, today]);
  const filteredDebts = useMemo(() => {
    return enrichedDebts.
    filter((debt) => {
      // Search filter
      if (
      searchQuery &&
      !debt.debtorName.toLowerCase().includes(searchQuery.toLowerCase()))
      {
        return false;
      }
      // Status filter
      if (filter === 'overdue') return debt.isOverdue;
      if (filter !== 'all' && debt.status !== filter) return false;
      return true;
    }).
    sort(
      (a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }, [enrichedDebts, searchQuery, filter]);
  // Summary stats
  const totalOwed = enrichedDebts.reduce((sum, d) => sum + d.remaining, 0);
  const activeDebtorsCount = new Set(
    enrichedDebts.filter((d) => d.remaining > 0).map((d) => d.debtorName)
  ).size;
  const overdueCount = enrichedDebts.filter((d) => d.isOverdue).length;
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.2
      }
    }
  };
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream dark:bg-[#1C1C1E] flex items-center justify-between border-b border-gray-100 dark:border-[#3A3A3C]">
        <h1 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
          Debt Manager
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-10 h-10 rounded-full bg-emerald text-white shadow-md flex items-center justify-center hover:bg-emerald-600 transition-colors">
          
          <Plus size={20} />
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8 px-6 pt-6">
        {/* Left Column: Summaries (Desktop) */}
        <div className="lg:col-span-4 space-y-6 mb-6 lg:mb-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4">
            
            <motion.div
              variants={itemVariants}
              className="bg-emerald text-white rounded-[2rem] p-6 shadow-card relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <HandCoins size={20} className="text-emerald-100" />
                <p className="text-emerald-50 text-sm font-medium">
                  Total Owed to You
                </p>
              </div>
              <h2 className="text-4xl font-bold tracking-tight relative z-10">
                {currencySymbol}
                {totalOwed.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] p-5 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
                
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                  <User size={20} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                  {activeDebtorsCount}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Active Debtors
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] p-5 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
                
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <p className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
                  {overdueCount}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Overdue Debts
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: List & Filters (Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <input
                type="text"
                placeholder="Search debtors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] shadow-sm rounded-2xl pl-12 pr-4 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:ring-2 focus:ring-emerald/10 transition-all font-medium" />
              
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
              {(
              [
              'all',
              'pending',
              'partial',
              'paid',
              'overdue'] as
              FilterStatus[]).
              map((f) =>
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filter === f ? f === 'overdue' ? 'bg-red-500 text-white shadow-md' : 'bg-charcoal dark:bg-white text-white dark:text-charcoal shadow-md' : 'bg-white dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#3A3A3C] hover:bg-gray-50 dark:hover:bg-[#3A3A3C]'}`}>
                
                  {f}
                </button>
              )}
            </div>
          </div>

          {/* Debt List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDebts.length > 0 ?
              filteredDebts.map((debt) => {
                const isExpanded = expandedDebtId === debt.id;
                return (
                  <motion.div
                    layout
                    key={debt.id}
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
                      scale: 0.95
                    }}
                    className={`bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] shadow-sm border transition-colors overflow-hidden ${debt.isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-[#3A3A3C]'}`}>
                    
                      <div
                      className="p-5 cursor-pointer flex items-center justify-between"
                      onClick={() =>
                      setExpandedDebtId(isExpanded ? null : debt.id)
                      }>
                      
                        <div className="flex items-center gap-4">
                          <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${debt.status === 'paid' ? 'bg-emerald/10 text-emerald' : debt.isOverdue ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
                          
                            {debt.status === 'paid' ?
                          <CheckCircle2 size={24} /> :
                          debt.isOverdue ?
                          <AlertCircle size={24} /> :

                          <Clock size={24} />
                          }
                          </div>
                          <div>
                            <h3 className="font-bold text-charcoal dark:text-[#F5F5F7] text-base">
                              {debt.debtorName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${debt.status === 'paid' ? 'bg-emerald/10 text-emerald' : debt.isOverdue ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : debt.status === 'partial' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400'}`}>
                              
                                {debt.isOverdue ? 'Overdue' : debt.status}
                              </span>
                              {debt.dueDate && debt.status !== 'paid' &&
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                  <Calendar size={12} /> {debt.dueDate}
                                </span>
                            }
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span
                          className={`font-bold text-lg ${debt.status === 'paid' ? 'text-emerald' : 'text-charcoal dark:text-[#F5F5F7]'}`}>
                          
                            {currencySymbol}
                            {debt.remaining.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          </span>
                          {debt.status !== 'pending' &&
                        <span className="text-xs text-gray-400 font-medium">
                              of {currencySymbol}
                              {debt.amount.toLocaleString()}
                            </span>
                        }
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded &&
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1
                        }}
                        exit={{
                          height: 0,
                          opacity: 0
                        }}
                        className="border-t border-gray-50 dark:border-[#3A3A3C] bg-gray-50/50 dark:bg-[#2C2C2E]/50">
                        
                            <div className="p-5 space-y-4">
                              {debt.description &&
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium bg-white dark:bg-[#3A3A3C] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                                  {debt.description}
                                </p>
                          }

                              {debt.payments.length > 0 &&
                          <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Payment History
                                  </h4>
                                  <div className="space-y-2">
                                    {debt.payments.map((payment) =>
                              <div
                                key={payment.id}
                                className="flex justify-between items-center bg-white dark:bg-[#3A3A3C] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                                
                                        <div>
                                          <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                                            {payment.date}
                                          </p>
                                          {payment.note &&
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                              {payment.note}
                                            </p>
                                  }
                                        </div>
                                        <span className="text-sm font-bold text-emerald">
                                          +{currencySymbol}
                                          {payment.amount.toLocaleString()}
                                        </span>
                                      </div>
                              )}
                                  </div>
                                </div>
                          }

                              <div className="flex gap-2 pt-2">
                                {debt.status !== 'paid' &&
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentModalDebt(debt);
                              }}
                              className="flex-1 bg-emerald text-white font-bold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                              
                                    <CreditCard size={16} /> Record Payment
                                  </button>
                            }
                                <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                confirm(
                                  'Are you sure you want to delete this debt record?'
                                ))
                                {
                                  deleteDebt(debt.id);
                                }
                              }}
                              className="px-4 bg-red-50 dark:bg-red-900/20 text-red-500 font-bold py-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center">
                              
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                      }
                      </AnimatePresence>
                    </motion.div>);

              }) :

              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="text-center py-16 bg-white dark:bg-[#2C2C2E] rounded-[2rem] border border-dashed border-gray-200 dark:border-[#3A3A3C] flex flex-col items-center">
                
                  <div className="mb-4">
                    <img
                    src="/1.png"
                    alt="Sleeping Fox"
                    className="w-[100px] h-[100px] object-contain" />
                  
                  </div>
                  <p className="text-charcoal dark:text-[#F5F5F7] font-bold mb-1">
                    No debts found
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {searchQuery || filter !== 'all' ?
                  'Try adjusting your filters.' :
                  'You have no recorded debts.'}
                  </p>
                  {!searchQuery && filter === 'all' &&
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald text-white px-6 py-2 rounded-xl font-bold text-sm">
                  
                      Add Debt
                    </button>
                }
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddDebtModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)} />
      
      <RecordPaymentModal
        isOpen={!!paymentModalDebt}
        onClose={() => setPaymentModalDebt(null)}
        debt={paymentModalDebt} />
      
    </div>);

}