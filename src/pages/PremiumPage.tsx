import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  useSubscription,
  SubscriptionTier } from
'../context/SubscriptionContext';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Star,
  Zap,
  Lock,
  Wallet,
  Shield,
  BarChart2,
  Crown,
  X } from
'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../components/Logo';
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
export function PremiumPage() {
  const { goBack } = useFinance();
  const { tier, setTier } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubscribe = (newTier: SubscriptionTier) => {
    setIsProcessing(true);
    setTimeout(() => {
      setTier(newTier);
      setIsProcessing(false);
      toast.success(
        `Successfully upgraded to Fintra ${newTier === 'pro' ? 'Pro' : 'Prime'}!`
      );
      goBack();
    }, 1500);
  };
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-[#1C1C1E] pb-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/10 dark:bg-emerald/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-cream/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl flex items-center border-b border-gray-100/50 dark:border-[#3A3A3C]/50">
        <button
          type="button"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors mr-4">
          
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-charcoal dark:text-[#F5F5F7]">
          Upgrade
        </h1>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-8 space-y-8 relative z-10">
        
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-6 relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut'
              }}>
              
              <Logo size={56} className="shadow-2xl shadow-emerald/20" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 2
              }}
              className="absolute -top-2 -right-4 text-yellow-400">
              
              <Sparkles size={24} />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-charcoal dark:text-[#F5F5F7] mb-3 tracking-tight">
            Unlock Your Financial Potential
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
            Get deeper insights, advanced budgeting, and complete
            personalization.
          </p>
        </motion.div>

        {/* Pro Tier */}
        <motion.div
          variants={itemVariants}
          className={`relative rounded-[2rem] p-6 overflow-hidden transition-all duration-500 ${tier === 'pro' ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/10' : 'border border-gray-200 dark:border-[#3A3A3C] shadow-soft'}`}>
          
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Fintra Pro</h3>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  Better analytics, simpler tracking.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 line-through font-bold">
                  ₱50/mo
                </p>
                <p className="text-2xl font-bold text-white">
                  ₱35
                  <span className="text-sm text-slate-400 font-medium">
                    /mo
                  </span>
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-blue-400" />
                </div>
                Monthly overview & trends
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-blue-400" />
                </div>
                Clean category breakdown
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-blue-400" />
                </div>
                Export data to CSV
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={isProcessing || tier === 'pro' || tier === 'prime'}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${tier === 'pro' ? 'bg-white/10 text-white/50 cursor-not-allowed' : tier === 'prime' ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 active:scale-[0.98]'}`}>
              
              {isProcessing ?
              'Processing...' :
              tier === 'pro' ?
              'Current Plan' :
              tier === 'prime' ?
              'Included in Prime' :
              'Upgrade to Pro'}
            </button>
          </div>
        </motion.div>

        {/* Prime Tier */}
        <motion.div
          variants={itemVariants}
          className={`relative rounded-[2rem] p-6 overflow-hidden transition-all duration-500 ${tier === 'prime' ? 'ring-2 ring-yellow-400 shadow-2xl shadow-emerald/20' : 'shadow-xl'}`}>
          
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 z-0"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl -mr-10 -mt-10 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -ml-10 -mb-10 z-0"></div>

          {/* Animated Shine Effect */}
          <motion.div
            className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 z-0"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'linear',
              repeatDelay: 2
            }} />
          

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={20} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Fintra Prime</h3>
                </div>
                <p className="text-sm text-emerald-100 font-medium">
                  The ultimate financial experience.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ₱100
                  <span className="text-sm text-emerald-100 font-medium">
                    /mo
                  </span>
                </p>
              </div>
            </div>

            <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 py-1 mb-4">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Everything in Pro, plus:
              </p>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" /> Deeper Insights
                </p>
                <ul className="space-y-2 pl-7">
                  <li className="text-xs font-medium text-emerald-50 relative before:content-[''] before:absolute before:left:-3 before:top-1.5 before:w-1 before:h-1 before:bg-yellow-400 before:rounded-full -ml-3">
                    Weekly trends & comparisons
                  </li>
                  <li className="text-xs font-medium text-emerald-50 relative before:content-[''] before:absolute before:left:-3 before:top-1.5 before:w-1 before:h-1 before:bg-yellow-400 before:rounded-full -ml-3">
                    Category drill-downs
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Wallet size={16} className="text-yellow-400" /> Advanced
                  Budgeting
                </p>
                <ul className="space-y-2 pl-7">
                  <li className="text-xs font-medium text-emerald-50 relative before:content-[''] before:absolute before:left:-3 before:top-1.5 before:w-1 before:h-1 before:bg-yellow-400 before:rounded-full -ml-3">
                    Rollover budgets & custom cycles
                  </li>
                  <li className="text-xs font-medium text-emerald-50 relative before:content-[''] before:absolute before:left:-3 before:top-1.5 before:w-1 before:h-1 before:bg-yellow-400 before:rounded-full -ml-3">
                    Budget per wallet
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" /> Personalization
                </p>
                <ul className="space-y-2 pl-7">
                  <li className="text-xs font-medium text-emerald-50 relative before:content-[''] before:absolute before:left:-3 before:top-1.5 before:w-1 before:h-1 before:bg-yellow-400 before:rounded-full -ml-3">
                    Custom dashboard & themes
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleSubscribe('prime')}
              disabled={isProcessing || tier === 'prime'}
              className={`w-full py-4 rounded-2xl font-bold transition-all relative z-10 ${tier === 'prime' ? 'bg-white/20 text-white cursor-not-allowed' : 'bg-white text-emerald hover:bg-emerald-50 shadow-xl shadow-white/10 active:scale-[0.98]'}`}>
              
              {isProcessing ?
              'Processing...' :
              tier === 'prime' ?
              'Current Plan' :
              'Upgrade to Prime'}
            </button>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div variants={itemVariants} className="pt-4">
          <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7] mb-4 text-center">
            Compare Plans
          </h3>
          <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-gray-100 dark:border-[#3A3A3C] overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-[#3A3A3C] p-4 border-b border-gray-100 dark:border-[#4A4A4C]">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Features
              </div>
              <div className="text-xs font-bold text-blue-500 text-center">
                Pro
              </div>
              <div className="text-xs font-bold text-emerald text-center flex items-center justify-center gap-1">
                <Crown size={12} /> Prime
              </div>
            </div>

            {[
            {
              name: 'Basic Tracking',
              pro: true,
              prime: true
            },
            {
              name: 'Monthly Overview',
              pro: true,
              prime: true
            },
            {
              name: 'Data Export',
              pro: true,
              prime: true
            },
            {
              name: 'Weekly Trends',
              pro: false,
              prime: true
            },
            {
              name: 'Rollover Budgets',
              pro: false,
              prime: true
            },
            {
              name: 'Custom Themes',
              pro: false,
              prime: true
            }].
            map((feature, idx) =>
            <div
              key={idx}
              className="grid grid-cols-3 p-4 border-b border-gray-50 dark:border-[#3A3A3C] last:border-0 items-center">
              
                <div className="text-xs font-medium text-charcoal dark:text-[#F5F5F7]">
                  {feature.name}
                </div>
                <div className="flex justify-center">
                  {feature.pro ?
                <Check size={16} className="text-blue-500" /> :

                <X size={16} className="text-gray-300 dark:text-gray-600" />
                }
                </div>
                <div className="flex justify-center">
                  {feature.prime ?
                <Check size={16} className="text-emerald" /> :

                <X size={16} className="text-gray-300 dark:text-gray-600" />
                }
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div variants={itemVariants} className="pb-8">
          <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/10 dark:border-emerald/20 rounded-[2rem] p-6 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) =>
              <Star
                key={i}
                size={16}
                className="text-yellow-400 fill-yellow-400" />

              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium italic mb-4">
              "Fintra Prime completely changed how I look at my money. The
              rollover budgets and weekly trends are game changers."
            </p>
            <p className="text-xs font-bold text-charcoal dark:text-[#F5F5F7]">
              — Sarah J., Prime Member
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>);

}