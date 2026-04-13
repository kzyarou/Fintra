import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Plus,
  Repeat,
  Calendar as CalendarIcon,
  Tag,
  Check,
  RefreshCw,
  Wallet } from
'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { toast } from 'sonner';
import { Transaction } from '../types/finance';
import { SuccessCheckmark } from './SuccessCheckmark';
const CATEGORIES = [
{
  name: 'Food',
  icon: 'coffee',
  emoji: '🍔'
},
{
  name: 'Transport',
  icon: 'zap',
  emoji: '🚗'
},
{
  name: 'Shopping',
  icon: 'shopping-bag',
  emoji: '🛍️'
},
{
  name: 'Entertainment',
  icon: 'music',
  emoji: '🎬'
},
{
  name: 'Bills',
  icon: 'landmark',
  emoji: '📄'
},
{
  name: 'Health',
  icon: 'help-circle',
  emoji: '💊'
},
{
  name: 'Education',
  icon: 'help-circle',
  emoji: '📚'
},
{
  name: 'Travel',
  icon: 'help-circle',
  emoji: '✈️'
},
{
  name: 'General',
  icon: 'help-circle',
  emoji: '📦'
}];

const DEFAULT_TAGS = [
'date',
'school',
'travel',
'gf',
'work',
'personal',
'urgent'];

export function AddTransactionModal({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) {
  const {
    addTransaction,
    lastTransaction,
    getTransactionSuggestions,
    totalBalance,
    getCategorySpending,
    budgets,
    undoLastTransaction,
    currencySymbol,
    accounts
  } = useFinance();
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'>(
    'monthly');
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [suggestions, setSuggestions] = useState<Transaction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const coinControls = useAnimation();
  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setAmount('');
      setName('');
      setDescription('');
      setCategory(lastTransaction?.category || 'General');
      setAccountId(accounts[0]?.id || '');
      setToAccountId(accounts.length > 1 ? accounts[1].id : '');
      setDate(new Date().toISOString().split('T')[0]);
      setTags([]);
      setRecurring(false);
      setRecurringInterval('monthly');
      setCustomTagInput('');
      setShowCustomTagInput(false);
      setShowSuccess(false);
      // Auto-focus amount
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, lastTransaction, accounts]);
  // Handle name input and suggestions
  useEffect(() => {
    if (!isOpen) return;
    if (name.length > 1) {
      const sugs = getTransactionSuggestions(name);
      setSuggestions(sugs);
      setShowSuggestions(sugs.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [name, isOpen, getTransactionSuggestions]);
  const handleSuggestionSelect = (sug: Transaction) => {
    setName(sug.name);
    setDescription(sug.description);
    setCategory(sug.category);
    setTags(sug.tags || []);
    setRecurring(sug.recurring || false);
    if (sug.recurringInterval) setRecurringInterval(sug.recurringInterval);
    setShowSuggestions(false);
  };
  const handleDuplicateLast = () => {
    if (!lastTransaction) return;
    setName(lastTransaction.name);
    setAmount(Math.abs(lastTransaction.amount).toString());
    setType(lastTransaction.amount < 0 ? 'expense' : 'income');
    setDescription(lastTransaction.description);
    setCategory(lastTransaction.category);
    setTags(lastTransaction.tags || []);
    setRecurring(lastTransaction.recurring || false);
    if (lastTransaction.recurringInterval)
    setRecurringInterval(lastTransaction.recurringInterval);
  };
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const newTag = customTagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCustomTagInput('');
      setShowCustomTagInput(false);
    }
  };
  const handleSave = async (addAnother: boolean = false) => {
    if (!name || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (type === 'transfer' && accountId === toAccountId) {
      toast.error('Cannot transfer to the same account');
      return;
    }
    const catObj = CATEGORIES.find((c) => c.name === category);
    const icon = catObj ? catObj.icon : 'help-circle';
    // Optimistic UI: Save immediately without delay
    if (type === 'transfer') {
      addTransaction({
        name,
        description: description || 'Transfer',
        amount: Math.abs(numAmount),
        date,
        category: 'Transfer',
        icon: 'arrow-right-left',
        tags,
        recurring,
        recurringInterval: recurring ? recurringInterval : undefined,
        transactionType: 'transfer',
        fromAccountId: accountId,
        toAccountId: toAccountId
      });
    } else {
      addTransaction({
        name,
        description: description || 'Manual entry',
        amount: type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount),
        date,
        category: type === 'income' ? 'Income' : category,
        icon: type === 'income' ? 'banknote' : icon,
        tags,
        recurring,
        recurringInterval: recurring ? recurringInterval : undefined,
        accountId,
        transactionType: type
      });
    }
    // Show toast with undo
    toast.success('Transaction saved', {
      action: {
        label: 'Undo',
        onClick: () => {
          undoLastTransaction();
          toast.info('Transaction removed');
        }
      },
      duration: 4000
    });
    if (addAnother) {
      setShowSuccess(true);
      setTimeout(() => {
        setAmount('');
        setName('');
        setDescription('');
        setShowSuccess(false);
        amountInputRef.current?.focus();
      }, 1000);
    } else {
      onClose();
    }
  };
  // Calculate impact
  const numAmount = parseFloat(amount) || 0;
  const impactAmount = type === 'expense' ? -numAmount : numAmount;
  const projectedBalance = totalBalance + impactAmount;
  const catBudget = budgets[category] || 0;
  const currentCatSpending = getCategorySpending(category);
  const projectedCatSpending =
  currentCatSpending + (type === 'expense' ? numAmount : 0);
  const isOverBudget = catBudget > 0 && projectedCatSpending > catBudget;
  const selectedAccount = accounts.find((a) => a.id === accountId);
  const isOverBalance =
  type === 'expense' && selectedAccount && numAmount > selectedAccount.balance;
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
            opacity: 0,
            pointerEvents: 'none' as const
          }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/60 z-[100]" />
        
          <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none p-0 sm:p-4">
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
            drag="y"
            dragConstraints={{
              top: 0,
              bottom: 0
            }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className={`w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden transition-colors duration-300 ${type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-white dark:bg-[#2C2C2E]'}`}>
            
              {/* Header */}
              <div className="px-6 pt-6 pb-2 flex justify-between items-center shrink-0">
                <div className="flex flex-col">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#3A3A3C] rounded-full mb-4 mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
                  <h2 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
                    New Transaction
                  </h2>
                </div>
                <button
                onClick={onClose}
                disabled={showSuccess}
                className="p-2 text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50">
                
                  <X size={24} />
                </button>
              </div>

              {showSuccess ?
            <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <SuccessCheckmark />
                  <motion.p
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.5
                }}
                className="mt-6 text-xl font-bold text-emerald">
                
                    Transaction Saved!
                  </motion.p>
                </div> :

            <>
                  {/* Duplicate Last */}
                  {lastTransaction &&
              <div className="px-6 pb-2 shrink-0">
                      <button
                  onClick={handleDuplicateLast}
                  className="flex items-center gap-2 text-xs font-bold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full hover:bg-emerald/20 transition-colors">
                  
                        <Repeat size={14} />
                        Repeat last: {lastTransaction.name} (
                        {lastTransaction.amount < 0 ? '-' : '+'}
                        {currencySymbol}
                        {Math.abs(lastTransaction.amount).toFixed(2)})
                      </button>
                    </div>
              }

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 hide-scrollbar">
                    {/* Swipeable Type Toggle & Amount */}
                    <motion.div
                  drag="x"
                  dragConstraints={{
                    left: 0,
                    right: 0
                  }}
                  dragElastic={0.1}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 50) setType('income');else
                    if (info.offset.x < -50) setType('expense');
                  }}
                  className="relative py-4">
                  
                      <div className="flex justify-center gap-2 mb-6 bg-black/5 dark:bg-white/5 p-1 rounded-full w-fit mx-auto">
                        <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${type === 'expense' ? 'bg-charcoal dark:bg-white text-white dark:text-charcoal shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-white'}`}>
                      
                          Expense
                        </button>
                        <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${type === 'income' ? 'bg-emerald text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-white'}`}>
                      
                          Income
                        </button>
                        <button
                      type="button"
                      onClick={() => setType('transfer')}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${type === 'transfer' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-white'}`}>
                      
                          Transfer
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-1">
                          Amount
                        </p>
                        <div className="flex items-center justify-center text-5xl font-bold text-charcoal dark:text-[#F5F5F7]">
                          <span className="text-3xl text-gray-400 dark:text-gray-500 mr-1">
                            {currencySymbol}
                          </span>
                          <input
                        ref={amountInputRef}
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          if (val.split('.').length > 2) return;
                          setAmount(val);
                        }}
                        placeholder="0.00"
                        className="w-full max-w-[200px] bg-transparent border-none focus:outline-none text-center placeholder-gray-300 dark:placeholder-gray-600" />
                      
                        </div>
                      </div>
                    </motion.div>

                    {/* Account Selection */}
                    <div>
                      <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3 ml-1">
                        {type === 'transfer' ? 'From Account' : 'Account'}
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                        {accounts.map((acc) =>
                    <button
                      key={acc.id}
                      onClick={() => setAccountId(acc.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${accountId === acc.id ? 'bg-charcoal dark:bg-white text-white dark:text-charcoal shadow-md' : 'bg-black/5 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-[#4A4A4C]'}`}>
                      
                            <Wallet
                        size={16}
                        className={
                        accountId === acc.id ?
                        'text-current' :
                        'text-emerald'
                        } />
                      
                            {acc.name}
                            <span className="opacity-70 ml-1 font-medium">
                              ({currencySymbol}
                              {acc.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                              )
                            </span>
                          </button>
                    )}
                      </div>
                    </div>

                    {type === 'transfer' &&
                <div>
                        <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3 ml-1">
                          To Account
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                          {accounts.map((acc) =>
                    <button
                      key={`to-${acc.id}`}
                      onClick={() => setToAccountId(acc.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${toAccountId === acc.id ? 'bg-blue-500 text-white shadow-md' : 'bg-black/5 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-[#4A4A4C]'}`}>
                      
                              <Wallet
                        size={16}
                        className={
                        toAccountId === acc.id ?
                        'text-white' :
                        'text-blue-500'
                        } />
                      
                              {acc.name}
                              <span className="opacity-70 ml-1 font-medium">
                                ({currencySymbol}
                                {acc.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                                )
                              </span>
                            </button>
                    )}
                        </div>
                      </div>
                }

                    {/* Title & Suggestions */}
                    <div className="relative">
                      <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g. + ${currencySymbol}50 coffee, Netflix...`}
                    className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-2xl px-5 py-4 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-bold text-lg" />
                  
                      <AnimatePresence>
                        {showSuggestions &&
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      exit={{
                        opacity: 0,
                        y: -10
                      }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-xl border border-gray-100 dark:border-[#3A3A3C] overflow-hidden z-10">
                      
                            {suggestions.map((sug) =>
                      <button
                        key={sug.id}
                        onClick={() => handleSuggestionSelect(sug)}
                        className="w-full text-left px-5 py-3 hover:bg-softgray dark:hover:bg-[#3A3A3C] transition-colors flex items-center justify-between border-b border-gray-50 dark:border-[#3A3A3C] last:border-0">
                        
                                <div>
                                  <p className="font-bold text-charcoal dark:text-[#F5F5F7]">
                                    {sug.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {sug.category}
                                  </p>
                                </div>
                                <RefreshCw
                          size={16}
                          className="text-gray-400" />
                        
                              </button>
                      )}
                          </motion.div>
                    }
                      </AnimatePresence>
                    </div>

                    {/* Category (Horizontal Scroll) */}
                    {type === 'expense' &&
                <div>
                        <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7] mb-3 ml-1">
                          Category
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                          {CATEGORIES.map((cat) =>
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${category === cat.name ? 'bg-charcoal dark:bg-white text-white dark:text-charcoal shadow-md' : 'bg-black/5 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-[#4A4A4C]'}`}>
                      
                              <span>{cat.emoji}</span>
                              {cat.name}
                            </button>
                    )}
                        </div>
                      </div>
                }

                    {/* Description & Date Row */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-xl px-4 py-3 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all font-medium text-sm" />
                    
                      </div>
                      <div className="w-1/3 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <CalendarIcon size={16} />
                        </div>
                        <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/5 dark:bg-[#3A3A3C] border-2 border-transparent rounded-xl pl-9 pr-3 py-3 text-charcoal dark:text-[#F5F5F7] font-bold text-sm focus:outline-none focus:border-emerald/30 focus:bg-white dark:focus:bg-[#2C2C2E] transition-all cursor-pointer" />
                    
                      </div>
                    </div>

                    {/* Tags System */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 ml-1">
                        <Tag size={16} className="text-gray-400" />
                        <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                          Tags
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {DEFAULT_TAGS.map((tag) => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected ? 'bg-emerald/10 border-emerald/30 text-emerald' : 'bg-transparent border-gray-200 dark:border-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                          
                              #{tag}
                            </button>);

                    })}
                        {tags.
                    filter((t) => !DEFAULT_TAGS.includes(t)).
                    map((tag) =>
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-emerald/10 border-emerald/30 text-emerald">
                      
                              #{tag}
                            </button>
                    )}

                        {showCustomTagInput ?
                    <input
                      type="text"
                      autoFocus
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={addCustomTag}
                      onBlur={() => setShowCustomTagInput(false)}
                      placeholder="type & enter"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-black/5 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] border-none focus:outline-none focus:ring-2 focus:ring-emerald/30 w-24" /> :


                    <button
                      onClick={() => setShowCustomTagInput(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-dashed border-gray-300 dark:border-[#3A3A3C] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 flex items-center gap-1">
                      
                            <Plus size={12} /> Add
                          </button>
                    }
                      </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-[#3A3A3C] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${recurring ? 'bg-emerald/20 text-emerald' : 'bg-white dark:bg-[#2C2C2E] text-gray-400'}`}>
                      
                          <RefreshCw size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                            Recurring
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Repeat this transaction
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {recurring &&
                    <select
                      value={recurringInterval}
                      onChange={(e) =>
                      setRecurringInterval(e.target.value as any)
                      }
                      className="bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#4A4A4C] rounded-lg px-2 py-1 text-xs font-bold text-charcoal dark:text-[#F5F5F7] focus:outline-none">
                      
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                    }
                        <button
                      onClick={() => setRecurring(!recurring)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${recurring ? 'bg-emerald' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      
                          <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${recurring ? 'translate-x-6' : 'translate-x-0'}`} />
                      
                        </button>
                      </div>
                    </div>

                    {/* Impact Preview */}
                    <div
                  className={`p-4 rounded-2xl border ${isOverBalance || type === 'expense' && isOverBudget ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 'bg-emerald/5 dark:bg-emerald/10 border-emerald/10 dark:border-emerald/20'}`}>
                  
                      <div className="flex justify-between items-center mb-2">
                        <p
                      className={`text-xs font-bold ${isOverBalance ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      
                          Balance after
                        </p>
                        <p
                      className={`text-sm font-bold ${isOverBalance ? 'text-red-500' : 'text-charcoal dark:text-[#F5F5F7]'}`}>
                      
                          {currencySymbol}
                          {projectedBalance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                        </p>
                      </div>

                      {isOverBalance &&
                  <p className="text-xs font-bold text-red-500 mt-2 pt-2 border-t border-red-100 dark:border-red-900/30">
                          Warning: This expense exceeds your selected account
                          balance.
                        </p>
                  }

                      {type === 'expense' && catBudget > 0 &&
                  <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                              {category} Budget
                            </p>
                            <p
                        className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-emerald'}`}>
                        
                              {currencySymbol}
                              {projectedCatSpending.toFixed(0)} /{' '}
                              {currencySymbol}
                              {catBudget}
                            </p>
                          </div>
                          <div className="w-full h-1.5 bg-black/5 dark:bg-[#3A3A3C] rounded-full overflow-hidden">
                            <div
                        className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald'}`}
                        style={{
                          width: `${Math.min(projectedCatSpending / catBudget * 100, 100)}%`
                        }} />
                      
                          </div>
                          {isOverBudget &&
                    <p className="text-xs font-bold text-red-500 mt-2">
                              This will exceed your {category} budget by{' '}
                              {currencySymbol}
                              {(projectedCatSpending - catBudget).toFixed(0)}
                            </p>
                    }
                        </div>
                  }
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 pt-2 shrink-0 bg-inherit relative">
                    {/* Coin Animation Element */}
                    <motion.div
                  animate={coinControls}
                  initial={{
                    opacity: 0,
                    y: 0,
                    scale: 1
                  }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-500 flex items-center justify-center shadow-lg z-50 pointer-events-none">
                  
                      <span className="text-yellow-700 text-xs font-bold">
                        {currencySymbol}
                      </span>
                    </motion.div>

                    <div className="flex gap-3">
                      <button
                    onClick={() => handleSave(true)}
                    className="flex-1 bg-black/5 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-4 rounded-2xl hover:bg-black/10 dark:hover:bg-[#4A4A4C] transition-colors text-sm">
                    
                        Save & Add Another
                      </button>
                      <button
                    onClick={() => handleSave(false)}
                    className={`flex-[2] text-white font-bold py-4 rounded-2xl transition-colors shadow-card active:scale-[0.98] flex items-center justify-center gap-2 ${!name || !amount ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-emerald hover:bg-emerald-600'}`}>
                    
                        <Check size={20} />
                        Save Transaction
                      </button>
                    </div>
                  </div>
                </>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}