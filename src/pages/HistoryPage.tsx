import React, { useMemo, useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { TransactionItem } from '../components/TransactionItem';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  CheckSquare,
  Trash2,
  Tag,
  FolderOpen,
  Pin,
  Sparkles } from
'lucide-react';
import { Transaction } from '../types/finance';
type FilterType = 'all' | 'income' | 'expense';
export function HistoryPage() {
  const { transactions, bulkDeleteTransactions, bulkUpdateTransactions } =
  useFinance();
  // Sticky filters
  const [searchQuery, setSearchQuery] = useLocalStorage(
    'fintra_history_search',
    ''
  );
  const [selectedCategory, setSelectedCategory] = useLocalStorage(
    'fintra_history_category',
    'all'
  );
  const [typeFilter, setTypeFilter] = useLocalStorage<FilterType>(
    'fintra_history_type',
    'all'
  );
  const [showFilters, setShowFilters] = useState(false);
  // Bulk selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Bulk action popovers
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [showCategoryPopover, setShowCategoryPopover] = useState(false);
  // Get unique categories and tags
  const categories = ['all', ...new Set(transactions.map((t) => t.category))];
  const allTags = [...new Set(transactions.flatMap((t) => t.tags || []))];
  // Powerful Search & Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type filter
      if (typeFilter === 'income' && t.amount < 0) return false;
      if (typeFilter === 'expense' && t.amount > 0) return false;
      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory)
      return false;
      // Search query parsing
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      // Amount search (e.g., >500, <100, =50)
      if (query.startsWith('>')) {
        const val = parseFloat(query.slice(1));
        if (!isNaN(val) && Math.abs(t.amount) <= val) return false;
      } else if (query.startsWith('<')) {
        const val = parseFloat(query.slice(1));
        if (!isNaN(val) && Math.abs(t.amount) >= val) return false;
      } else if (query.startsWith('=')) {
        const val = parseFloat(query.slice(1));
        if (!isNaN(val) && Math.abs(t.amount) !== val) return false;
      }
      // Category search (e.g., category:food)
      else if (query.startsWith('category:')) {
        const cat = query.split(':')[1];
        if (!t.category.toLowerCase().includes(cat)) return false;
      }
      // Tag search (e.g., tag:school)
      else if (query.startsWith('tag:')) {
        const tag = query.split(':')[1];
        if (!t.tags?.some((t) => t.toLowerCase().includes(tag))) return false;
      }
      // Keyword search
      else {
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesTag = t.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }
      return true;
    });
  }, [transactions, searchQuery, selectedCategory, typeFilter]);
  // Smart Grouping
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      'This Week': [],
      'This Month': [],
      Older: []
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    filteredTransactions.forEach((t) => {
      if (t.pinned) {
        groups['Pinned'].push(t);
        return;
      }
      // Mock date parsing for demo (assuming 'Today', 'Yesterday', or 'DD MMM')
      if (t.date === 'Today') {
        groups['Today'].push(t);
      } else if (t.date === 'Yesterday') {
        groups['Yesterday'].push(t);
      } else {
        // Simple fallback for demo
        groups['Older'].push(t);
      }
    });
    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length > 0)
    );
  }, [filteredTransactions]);
  // Summaries
  const isFiltered =
  searchQuery || selectedCategory !== 'all' || typeFilter !== 'all';
  const filteredIncome = filteredTransactions.
  filter((t) => t.amount > 0).
  reduce((sum, t) => sum + t.amount, 0);
  const filteredExpense = filteredTransactions.
  filter((t) => t.amount < 0).
  reduce((sum, t) => sum + Math.abs(t.amount), 0);
  // Bulk Actions
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} transactions?`)) {
      bulkDeleteTransactions(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };
  const handleBulkTag = (tag: string) => {
    bulkUpdateTransactions(selectedIds, {
      tags: [tag]
    }); // Simplified for demo: overwrites tags
    setShowTagPopover(false);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };
  const handleBulkCategory = (category: string) => {
    bulkUpdateTransactions(selectedIds, {
      category
    });
    setShowCategoryPopover(false);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-cream dark:bg-[#1C1C1E] sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
            History
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
                setShowTagPopover(false);
                setShowCategoryPopover(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelectionMode ? 'bg-emerald text-white shadow-md' : 'bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C]'}`}>
              
              <CheckSquare size={20} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showFilters ? 'bg-charcoal dark:bg-white text-white dark:text-charcoal shadow-md' : 'bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C]'}`}>
              
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search amount (>500), tag:school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] shadow-sm rounded-2xl pl-12 pr-10 py-3.5 text-charcoal dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:border-emerald/30 focus:ring-2 focus:ring-emerald/10 transition-all font-medium" />
          
          {searchQuery &&
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal">
            
              <X size={16} />
            </button>
          }
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters &&
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
            className="overflow-hidden mb-4">
            
              <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl border border-gray-100 dark:border-[#3A3A3C] shadow-sm space-y-4">
                {/* Type Filter */}
                <div className="flex bg-gray-50 dark:bg-[#3A3A3C] p-1 rounded-xl">
                  {(['all', 'income', 'expense'] as FilterType[]).map(
                  (type) =>
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${typeFilter === type ? 'bg-white dark:bg-[#2C2C2E] text-charcoal dark:text-[#F5F5F7] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7]'}`}>
                    
                        {type}
                      </button>

                )}
                </div>

                {/* Category Chips */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) =>
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${selectedCategory === category ? 'bg-emerald/10 border-emerald/30 text-emerald' : 'bg-transparent border-gray-200 dark:border-[#4A4A4C] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                    
                        {category}
                      </button>
                  )}
                  </div>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        {/* Smart Summary */}
        <AnimatePresence>
          {isFiltered &&
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
            className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-2xl p-4 mb-4 flex justify-between items-center">
            
              <div>
                <p className="text-xs font-bold text-emerald/70 uppercase tracking-wider mb-1">
                  Filtered Summary
                </p>
                <p className="text-sm font-bold text-emerald">
                  {filteredTransactions.length} transactions found
                </p>
              </div>
              <div className="text-right">
                {typeFilter !== 'expense' && filteredIncome > 0 &&
              <p className="text-sm font-bold text-emerald">
                    +{filteredIncome.toFixed(2)}
                  </p>
              }
                {typeFilter !== 'income' && filteredExpense > 0 &&
              <p className="text-sm font-bold text-charcoal dark:text-[#F5F5F7]">
                    -{filteredExpense.toFixed(2)}
                  </p>
              }
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Transactions List */}
      <section className="px-6">
        {Object.keys(groupedTransactions).length > 0 ?
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6">
          
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedTransactions).map(([groupName, items]) =>
            <motion.div
              key={groupName}
              layout
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              transition={{
                duration: 0.2
              }}>
              
                  <div className="flex items-center gap-2 mb-3 ml-1">
                    {groupName === 'Pinned' &&
                <Pin
                  size={14}
                  className="text-amber-500 fill-amber-500" />

                }
                    <h3
                  className={`text-xs font-bold uppercase tracking-wider ${groupName === 'Pinned' ? 'text-amber-500' : 'text-gray-400'}`}>
                  
                      {groupName}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {items.map((transaction) =>
                  <motion.div
                    key={transaction.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.9
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      x: -100
                    }}
                    transition={{
                      type: 'tween',
                      duration: 0.2
                    }}>
                    
                          <TransactionItem
                      transaction={transaction}
                      isSelectable={isSelectionMode}
                      isSelected={selectedIds.includes(transaction.id)}
                      onSelect={toggleSelection} />
                    
                        </motion.div>
                  )}
                    </AnimatePresence>
                  </div>
                </motion.div>
            )}
            </AnimatePresence>
          </motion.div> :

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="text-center py-16 bg-white dark:bg-[#2C2C2E] rounded-[2rem] border border-dashed border-gray-200 dark:border-[#3A3A3C] mt-4 flex flex-col items-center">
          
            <div className="mb-6 relative">
              <img
              src="/1.png"
              alt="Sleeping Fox"
              className="w-[120px] h-[120px] object-contain" />
            
              <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut'
              }}
              className="absolute -top-4 -right-4 text-2xl">
              
                ✨
              </motion.div>
            </div>
            <p className="text-charcoal dark:text-[#F5F5F7] font-bold text-lg mb-2">
              {isFiltered ? 'No matches found' : 'No transactions yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mx-auto">
              {isFiltered ?
            'Try adjusting your search or filters to find what you need.' :
            'Tap the + button below to add your first expense!'}
            </p>
            {isFiltered &&
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setTypeFilter('all');
            }}
            className="mt-6 px-6 py-3 bg-gray-100 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors text-sm">
            
                Clear Filters
              </button>
          }
          </motion.div>
        }
      </section>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {isSelectionMode && selectedIds.length > 0 &&
        <motion.div
          initial={{
            y: 100
          }}
          animate={{
            y: 0
          }}
          exit={{
            y: 100
          }}
          className="fixed bottom-20 left-4 right-4 bg-charcoal dark:bg-[#2C2C2E] text-white dark:text-[#F5F5F7] rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border dark:border-[#3A3A3C]">
          
            <span className="font-bold text-sm">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2 relative">
              <button
              onClick={() => {
                setShowTagPopover(!showTagPopover);
                setShowCategoryPopover(false);
              }}
              className={`p-2 rounded-xl transition-colors ${showTagPopover ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
              
                <Tag size={18} />
              </button>

              <AnimatePresence>
                {showTagPopover &&
              <motion.div
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
                  y: 10
                }}
                className="absolute bottom-full right-0 mb-2 bg-white dark:bg-[#3A3A3C] rounded-xl shadow-xl border border-gray-100 dark:border-[#4A4A4C] p-2 min-w-[150px] z-50">
                
                    <p className="text-xs font-bold text-gray-400 px-2 py-1 mb-1">
                      Apply Tag
                    </p>
                    <div className="max-h-40 overflow-y-auto hide-scrollbar space-y-1">
                      {allTags.length > 0 ?
                  allTags.map((tag) =>
                  <button
                    key={tag}
                    onClick={() => handleBulkTag(tag)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-sm font-medium text-charcoal dark:text-[#F5F5F7] hover:bg-gray-100 dark:hover:bg-[#4A4A4C]">
                    
                            #{tag}
                          </button>
                  ) :

                  <p className="text-xs text-gray-500 px-2 py-1">
                          No tags available
                        </p>
                  }
                    </div>
                  </motion.div>
              }
              </AnimatePresence>

              <button
              onClick={() => {
                setShowCategoryPopover(!showCategoryPopover);
                setShowTagPopover(false);
              }}
              className={`p-2 rounded-xl transition-colors ${showCategoryPopover ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
              
                <FolderOpen size={18} />
              </button>

              <AnimatePresence>
                {showCategoryPopover &&
              <motion.div
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
                  y: 10
                }}
                className="absolute bottom-full right-0 mb-2 bg-white dark:bg-[#3A3A3C] rounded-xl shadow-xl border border-gray-100 dark:border-[#4A4A4C] p-2 min-w-[150px] z-50">
                
                    <p className="text-xs font-bold text-gray-400 px-2 py-1 mb-1">
                      Move to Category
                    </p>
                    <div className="max-h-40 overflow-y-auto hide-scrollbar space-y-1">
                      {categories.
                  filter((c) => c !== 'all').
                  map((category) =>
                  <button
                    key={category}
                    onClick={() => handleBulkCategory(category)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-sm font-medium text-charcoal dark:text-[#F5F5F7] hover:bg-gray-100 dark:hover:bg-[#4A4A4C] capitalize">
                    
                            {category}
                          </button>
                  )}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>

              <button
              onClick={handleBulkDelete}
              className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
              
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}