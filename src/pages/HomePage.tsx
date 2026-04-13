import React, { useMemo, useState, useRef, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { AccountCard } from '../components/AccountCard';
import { TransactionItem } from '../components/TransactionItem';
import {
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Wallet,
  RefreshCw } from
'lucide-react';
export function HomePage() {
  const {
    totalBalance,
    accounts,
    transactions,
    setActivePage,
    currencySymbol
  } = useFinance();
  const { user, isGuest } = useAuth();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Pull to refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      // Store initial Y
      scrollContainerRef.current?.setAttribute(
        'data-start-y',
        e.touches[0].clientY.toString()
      );
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const startY = Number(
        scrollContainerRef.current?.getAttribute('data-start-y') || 0
      );
      if (startY > 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0 && diff < 150) {
          setPullY(diff);
        }
      }
    }
  };
  const handleTouchEnd = () => {
    if (pullY > 80 && !isRefreshing) {
      setIsRefreshing(true);
      setPullY(60); // Hold at 60px while refreshing
      // Simulate network request
      setTimeout(() => {
        setIsRefreshing(false);
        setPullY(0);
      }, 1500);
    } else {
      setPullY(0);
    }
    scrollContainerRef.current?.removeAttribute('data-start-y');
  };
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth * 0.85 + 16; // 85% width + 1rem gap
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveCardIndex(index);
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const containerWidth = e.currentTarget.offsetWidth;
    const cardWidth = containerWidth * 0.85 + 16; // 85% width + 1rem gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (
    newIndex !== activeCardIndex &&
    newIndex >= 0 &&
    newIndex < accounts.length)
    {
      setActiveCardIndex(newIndex);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  // Calculate today's change
  const todayTransactions = transactions.filter((t) => t.date === 'Today');
  const todayChange = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  // Generate today's story
  const story = useMemo(() => {
    if (todayTransactions.length === 0) {
      return "It's a quiet day so far. No transactions yet.";
    }
    const expenses = todayTransactions.filter((t) => t.amount < 0);
    const incomes = todayTransactions.filter((t) => t.amount > 0);
    if (expenses.length > 0) {
      const categories = expenses.reduce(
        (acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      const topCategory = Object.entries(categories).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      return `You had ${expenses.length} expense${expenses.length > 1 ? 's' : ''} today, mostly on ${topCategory.toLowerCase()}.`;
    } else if (incomes.length > 0) {
      return `Great day! You received ${incomes.length} income${incomes.length > 1 ? 's' : ''}.`;
    }
    return "You've been active today.";
  }, [todayTransactions]);
  const displayName = isGuest ? 'Guest' : user?.displayName || 'User';
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
    <div
      className="w-full relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
        animate={{
          y: pullY > 0 ? pullY - 40 : -40,
          opacity: pullY > 0 ? Math.min(pullY / 80, 1) : 0
        }}
        transition={{
          type: isRefreshing ? 'spring' : 'tween',
          duration: 0.2
        }}>
        
        <div className="w-10 h-10 bg-white dark:bg-[#2C2C2E] rounded-full shadow-md flex items-center justify-center">
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : pullY * 2
            }}
            transition={{
              repeat: isRefreshing ? Infinity : 0,
              duration: 1,
              ease: 'linear'
            }}>
            
            <RefreshCw size={20} className="text-emerald" />
          </motion.div>
        </div>
      </motion.div>

      {/* Header & Greeting */}
      <header className="px-6 pt-12 pb-4 bg-cream dark:bg-[#1C1C1E] sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivePage('profile')}
            className="relative focus:outline-none hover:opacity-80 transition-opacity">
            
            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#3A3A3C] shadow-sm bg-emerald flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {user?.photoURL ?
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover" /> :


              displayName.charAt(0).toUpperCase()
              }
            </div>
          </button>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {getGreeting()},
            </p>
            <h1 className="text-charcoal dark:text-[#F5F5F7] font-bold text-xl">
              {displayName}
            </h1>
          </div>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8">
        
        {/* Balance Hero Section */}
        <motion.section variants={itemVariants} className="px-6">
          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-soft border border-gray-50 dark:border-[#3A3A3C] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald/5 dark:bg-emerald/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <h2 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                Total Balance
              </h2>
              <button
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="text-gray-400 hover:text-charcoal dark:hover:text-[#F5F5F7] transition-colors p-1">
                
                {isBalanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative z-10 mb-4">
              <h1 className="text-5xl font-bold tracking-tight text-charcoal dark:text-[#F5F5F7] flex items-center">
                <span className="text-3xl text-gray-400 mr-1">
                  {currencySymbol}
                </span>
                {isBalanceHidden ?
                '••••••' :
                totalBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </h1>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <div
                className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${todayChange >= 0 ? 'bg-emerald/10 text-emerald' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                
                {todayChange >= 0 ?
                <TrendingUp size={14} className="mr-1" /> :

                <TrendingDown size={14} className="mr-1" />
                }
                {todayChange >= 0 ? '+' : '-'}
                {currencySymbol}
                {Math.abs(todayChange).toFixed(2)}
              </div>
              <span className="text-xs font-medium text-gray-400">
                Today's change
              </span>
            </div>
          </div>
        </motion.section>

        {/* Today's Story */}
        <motion.section variants={itemVariants} className="px-6">
          <div className="bg-charcoal dark:bg-[#2C2C2E] text-white dark:text-[#F5F5F7] rounded-[1.5rem] p-5 shadow-md flex gap-4 items-center border border-transparent dark:border-[#3A3A3C]">
            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/3.png"
                alt="Fox"
                className="w-8 h-8 object-contain" />
              
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/90 mb-1">
                Today's Story
              </h3>
              <p className="text-sm text-white/70 leading-snug">{story}</p>
            </div>
          </div>
        </motion.section>

        {/* Cards Section */}
        <motion.section variants={itemVariants}>
          <div className="px-6 flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              My Wallets
            </h2>
            <button
              onClick={() => setActivePage('accounts')}
              className="text-sm font-bold text-emerald hover:text-emerald-600 transition-colors flex items-center gap-1">
              
              Manage <ArrowRight size={14} />
            </button>
          </div>

          {accounts.length > 0 ?
          <>
              <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide px-6"
              onScroll={handleScroll}>
              
                {accounts.map((account, index) => {
                const isViewable = index === activeCardIndex;
                return (
                  <div
                    key={account.id}
                    className={`min-w-[85%] sm:min-w-[300px] snap-center flex-shrink-0 transition-all duration-300 cursor-pointer ${isViewable ? 'scale-100 opacity-100 shadow-xl' : 'scale-95 opacity-70'}`}
                    onClick={() => scrollToCard(index)}>
                    
                      <AccountCard account={account} />
                    </div>);

              })}
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-1.5 mt-2 mb-6">
                {accounts.map((_, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-4 bg-emerald' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`} />);


              })}
              </div>
            </> :

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="mx-6 bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-8 text-center border border-dashed border-gray-300 dark:border-[#3A3A3C] flex flex-col items-center">
            
              <div className="mb-4">
                <img
                src="/1.png"
                alt="Sleeping Fox"
                className="w-[100px] h-[100px] object-contain" />
              
              </div>
              <p className="text-charcoal dark:text-[#F5F5F7] font-bold mb-1">
                No wallets yet
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Add your first account to start tracking.
              </p>
              <button
              onClick={() => setActivePage('accounts')}
              className="bg-emerald text-white px-6 py-2 rounded-xl font-bold text-sm">
              
                Add Wallet
              </button>
            </motion.div>
          }
        </motion.section>

        {/* Summarized History */}
        <motion.section variants={itemVariants} className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Recent Activity
            </h2>
            <button
              onClick={() => setActivePage('history')}
              className="text-sm font-bold text-emerald hover:text-emerald-600 transition-colors flex items-center gap-1">
              
              See all <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-2 shadow-sm border border-gray-50 dark:border-[#3A3A3C]">
            {transactions.slice(0, 4).map((transaction, index) =>
            <div key={transaction.id}>
                <TransactionItem transaction={transaction} />
                {index < Math.min(transactions.length, 4) - 1 &&
              <div className="h-[1px] bg-gray-50 dark:bg-[#3A3A3C] mx-4" />
              }
              </div>
            )}

            {transactions.length === 0 &&
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              className="p-8 text-center flex flex-col items-center">
              
                <div className="mb-4">
                  <img
                  src="/1.png"
                  alt="Sleeping Fox"
                  className="w-[80px] h-[80px] object-contain" />
                
                </div>
                <p className="text-charcoal dark:text-[#F5F5F7] font-bold mb-1">
                  No recent activity
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Tap the + button to add your first expense!
                </p>
              </motion.div>
            }
          </div>
        </motion.section>
      </motion.div>
    </div>);

}