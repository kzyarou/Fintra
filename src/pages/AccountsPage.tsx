import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { AccountCard, AddAccountCard, ConnectedAccountCard } from '../components/AccountCard';
import { AddAccountModal } from '../components/AddAccountModal';
import { EditAccountModal } from '../components/EditAccountModal';
import { ConnectWalletModal } from '../components/ConnectWalletModal';
import { Plus, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Account } from '../types/finance';

export function AccountsPage() {
  const { totalBalance, accounts, connectedAccounts, currencySymbol, syncAllConnectedAccounts } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const wallets = accounts.filter((a) => a.type === 'card' || a.type === 'cash');
  const savings = accounts.filter(
    (a) => a.type === 'bank' || a.type === 'savings'
  );
  const walletsTotal = wallets.reduce((sum, acc) => sum + acc.balance, 0);
  const savingsTotal = savings.reduce((sum, acc) => sum + acc.balance, 0);
  const connectedTotal = connectedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
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
  const handleConnectBrankas = () => {
    // In a real app, this would call your backend to get a Brankas redirect URL
    // For this demo, we'll just simulate the redirect to our callback page
    window.location.href = '/callback?code=simulated_brankas_auth_code_123';
  };
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 bg-cream dark:bg-[#1C1C1E]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal dark:text-[#F5F5F7]">
            Accounts
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-bold text-sm gap-2">
              
              <LinkIcon size={16} />
              Connect e-Wallet
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-[#3A3A3C] flex items-center justify-center text-charcoal dark:text-[#F5F5F7] shadow-sm hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors">
              
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="bg-emerald text-white rounded-[2rem] p-6 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-emerald-50 text-sm font-medium mb-1 relative z-10">
            Total Net Worth
          </p>
          <h2 className="text-4xl font-bold tracking-tight relative z-10">
            {currencySymbol}
            {totalBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h2>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 space-y-8">
        
        {/* Wallets Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Wallets
            </h3>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {currencySymbol}
              {walletsTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {wallets.map((account) =>
            <motion.div
              key={account.id}
              variants={itemVariants}
              onClick={() => setEditingAccount(account)}
              className="cursor-pointer">
              
                <AccountCard account={account} />
              </motion.div>
            )}
          </div>
        </section>

        {/* Savings Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
              Savings
            </h3>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {currencySymbol}
              {savingsTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {savings.map((account) =>
            <motion.div
              key={account.id}
              variants={itemVariants}
              onClick={() => setEditingAccount(account)}
              className="cursor-pointer">
              
                <AccountCard account={account} />
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <AddAccountCard onClick={() => setIsAddModalOpen(true)} />
            </motion.div>
          </div>
        </section>

        {/* Connected Accounts Section */}
        {connectedAccounts.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7]">
                  Connected Accounts
                </h3>
                <button
                  onClick={syncAllConnectedAccounts}
                  className="p-1.5 rounded-full bg-emerald/10 text-emerald hover:bg-emerald/20 transition-colors"
                  title="Sync all accounts"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {currencySymbol}
                {connectedTotal.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {connectedAccounts.map((account) =>
                <motion.div
                  key={account.id}
                  variants={itemVariants}
                >
                  <ConnectedAccountCard account={account} />
                </motion.div>
              )}
            </div>
          </section>
        )}
      </motion.div>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)} />
      

      <EditAccountModal
        account={editingAccount}
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)} />
      

      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)} />
      
    </div>);

}