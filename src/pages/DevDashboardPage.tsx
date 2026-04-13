import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  Database,
  Users,
  Activity,
  CreditCard,
  Trash2,
  RefreshCw,
  Server,
  ShieldAlert,
  Search,
  ChevronRight } from
'lucide-react';
import { toast } from 'sonner';
export function DevDashboardPage() {
  const { goBack, transactions, accounts, debts, budgets, currencySymbol } =
  useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
  const activeBudgets = Object.values(budgets).filter((b) => b > 0).length;
  // Estimate local storage size
  const getLocalStorageSize = () => {
    let _lsTotal = 0,
      _xLen,
      _x;
    for (_x in localStorage) {
      if (!localStorage.hasOwnProperty(_x)) {
        continue;
      }
      _xLen = (localStorage[_x].length + _x.length) * 2;
      _lsTotal += _xLen;
    }
    return (_lsTotal / 1024).toFixed(2); // KB
  };
  const handleClearCache = () => {
    if (
    confirm(
      'Are you sure you want to clear all local storage? This will delete all app data.'
    ))
    {
      localStorage.clear();
      toast.success('Local storage cleared. Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    }
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
      y: 0
    }
  };
  const filteredTransactions = transactions.
  filter(
    (t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).
  slice(0, 50); // Limit to 50 for performance
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans selection:bg-indigo-500/30">
      <header className="px-6 pt-12 pb-6 sticky top-0 z-40 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert size={20} className="text-indigo-500" />
              Dev Dashboard
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              System Overview & Diagnostics
            </p>
          </div>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-6 space-y-6">
        
        {/* System Health */}
        <motion.section
          variants={itemVariants}
          className="grid grid-cols-2 gap-4">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Server size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Storage
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {getLocalStorageSize()}{' '}
              <span className="text-sm font-medium text-slate-500">KB</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Local Storage Usage</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Status
              </h3>
            </div>
            <p className="text-2xl font-bold text-emerald-500">Healthy</p>
            <p className="text-xs text-slate-500 mt-1">App Version 2.0.0</p>
          </div>
        </motion.section>

        {/* Data Overview */}
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Data Overview
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-700">
              <div className="p-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Transactions
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {transactions.length}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Accounts
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {accounts.length}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-1">Debts</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {debts.length}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-1">Budgets</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeBudgets}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Total System Value
              </span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {currencySymbol}
                {totalBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Admin Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              
              <RefreshCw size={16} /> Force Reload
            </button>
            <button
              onClick={handleClearCache}
              className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-bold text-red-600 dark:text-red-400 shadow-sm">
              
              <Trash2 size={16} /> Nuke Data
            </button>
          </div>
        </motion.section>

        {/* Transaction Explorer */}
        <motion.section variants={itemVariants} className="pb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Transaction Explorer
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Showing top 50
            </span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                
                <input
                  type="text"
                  placeholder="Query transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono" />
                
              </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredTransactions.length > 0 ?
                  filteredTransactions.map((t) =>
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-mono text-xs">
                    
                        <td className="px-4 py-3 text-slate-400">
                          {t.id.substring(0, 6)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-sans font-medium truncate max-w-[120px]">
                          {t.name}
                        </td>
                        <td
                      className={`px-4 py-3 font-bold ${t.amount < 0 ? 'text-slate-700 dark:text-slate-300' : 'text-emerald-500'}`}>
                      
                          {t.amount < 0 ? '-' : '+'}
                          {currencySymbol}
                          {Math.abs(t.amount)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{t.date}</td>
                      </tr>
                  ) :

                  <tr>
                      <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-slate-500 font-sans">
                      
                        No transactions match query
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>);

}