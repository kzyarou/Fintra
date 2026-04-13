import React, { useState } from 'react';
import { Account } from '../types/finance';
import { CreditCard, Banknote, Landmark, Plus, RefreshCw, Unlink, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { PH_INSTITUTIONS } from '../services/brankas';
const iconMap: Record<string, React.ReactNode> = {
  'credit-card': <CreditCard size={22} className="text-charcoal" />,
  banknote: <Banknote size={22} className="text-charcoal" />,
  landmark: <Landmark size={22} className="text-charcoal" />
};
export function AccountCard({ account }: {account: Account;}) {
  const { currencySymbol, openBudgetModal } = useFinance();
  const lowerName = account.name.toLowerCase();
  const isGCash = lowerName.includes('gcash');
  const isPayPal = lowerName.includes('paypal');
  const isPayMaya = lowerName.includes('paymaya') || lowerName.includes('maya');
  const isGrabPay = lowerName.includes('grabpay');
  const isAlibaba = lowerName.includes('alibaba');
  const BudgetButton = ({ light = false }: {light?: boolean;}) =>
  <button
    onClick={(e) => {
      e.stopPropagation();
      openBudgetModal(account.id);
    }}
    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${light ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-emerald/10 text-emerald hover:bg-emerald/20'}`}>
    
      Set Budget
    </button>;

  if (isGCash) {
    return (
      <div className="bg-[#1B2A4A] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-transparent transition-transform hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-xl tracking-tight">
              GCash
            </span>
            <div className="w-10 h-8 bg-[#E6C27A] rounded-md opacity-90 flex items-center justify-center overflow-hidden">
              <div className="w-full h-[1px] bg-black/20 absolute"></div>
              <div className="w-[1px] h-full bg-black/20 absolute"></div>
              <div className="w-6 h-4 border border-black/20 rounded-sm absolute"></div>
            </div>
          </div>
        </div>
        <div className="mt-auto relative z-10 flex justify-between items-end">
          <div>
            <p className="text-white/70 text-xs font-medium mb-1">Balance</p>
            <p className="text-white text-xl font-bold">
              {currencySymbol}
              {account.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BudgetButton light />
            <div className="flex -space-x-2 opacity-80">
              <div className="w-6 h-6 rounded-full bg-[#EB001B] mix-blend-multiply"></div>
              <div className="w-6 h-6 rounded-full bg-[#F79E1B] mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </div>);

  }
  if (isPayPal) {
    return (
      <div className="bg-[#003087] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-transparent transition-transform hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0079C1]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-xl italic tracking-tight">
              PayPal
            </span>
            <BudgetButton light />
          </div>
        </div>
        <div className="mt-auto relative z-10">
          <p className="text-white/70 text-xs font-medium mb-1">Balance</p>
          <p className="text-white text-xl font-bold">
            {currencySymbol}
            {account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>);

  }
  if (isPayMaya) {
    return (
      <div className="bg-[#00C853] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-transparent transition-transform hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-xl tracking-tight">
              Maya
            </span>
            <BudgetButton light />
          </div>
        </div>
        <div className="mt-auto relative z-10">
          <p className="text-white/80 text-xs font-medium mb-1">Balance</p>
          <p className="text-white text-xl font-bold">
            {currencySymbol}
            {account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>);

  }
  if (isGrabPay) {
    return (
      <div className="bg-[#00B14F] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-transparent transition-transform hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-xl tracking-tight">
              GrabPay
            </span>
            <BudgetButton light />
          </div>
        </div>
        <div className="mt-auto relative z-10">
          <p className="text-white/80 text-xs font-medium mb-1">Balance</p>
          <p className="text-white text-xl font-bold">
            {currencySymbol}
            {account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>);

  }
  if (isAlibaba) {
    return (
      <div className="bg-[#FF6A00] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-transparent transition-transform hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-xl tracking-tight">
              Alibaba
            </span>
            <BudgetButton light />
          </div>
        </div>
        <div className="mt-auto relative z-10">
          <p className="text-white/80 text-xs font-medium mb-1">Balance</p>
          <p className="text-white text-xl font-bold">
            {currencySymbol}
            {account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>);

  }
  return (
    <div className="bg-white dark:bg-[#2C2C2E] rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft border border-gray-100 dark:border-[#3A3A3C] transition-transform hover:scale-[1.02] relative">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-2xl bg-softgray dark:bg-[#3A3A3C] flex items-center justify-center">
            {iconMap[account.icon] ||
            <CreditCard
              size={22}
              className="text-charcoal dark:text-[#F5F5F7]" />

            }
          </div>
          <span className="text-charcoal dark:text-[#F5F5F7] font-semibold text-base">
            {account.name}
          </span>
        </div>
        <BudgetButton />
      </div>
      <div className="mt-auto">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">
          Balance
        </p>
        <p className="text-charcoal dark:text-[#F5F5F7] text-xl font-bold">
          {currencySymbol}
          {account.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    </div>);

}
export function AddAccountCard({ onClick }: {onClick?: () => void;}) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border-2 border-dashed border-gray-300 dark:border-[#3A3A3C] rounded-[1.5rem] p-5 flex flex-col justify-center items-center h-44 w-full text-center hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors hover:border-emerald dark:hover:border-emerald group">
      
      <div className="w-12 h-12 rounded-full bg-softgray dark:bg-[#2C2C2E] flex items-center justify-center mb-3 group-hover:bg-emerald/10 transition-colors">
        <Plus
          size={24}
          className="text-gray-400 dark:text-gray-500 group-hover:text-emerald transition-colors" />
        
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm group-hover:text-emerald transition-colors">
        Add new
        <br />
        account
      </p>
    </button>);

}

export function ConnectedAccountCard({
  account,
  onSync,
  onDisconnect,
}: {
  account: Account;
  onSync?: () => void;
  onDisconnect?: () => void;
}) {
  const { currencySymbol, syncConnectedAccount, removeConnectedAccount } = useFinance();
  const [isSyncing, setIsSyncing] = useState(false);

  const institution = PH_INSTITUTIONS.find((i) => i.id === account.institutionId);
  const bgColor = institution?.color || '#3B82F6';

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncConnectedAccount(account.id);
      onSync?.();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirm(`Disconnect ${account.name}? This will stop syncing transactions.`)) {
      await removeConnectedAccount(account.id);
      onDisconnect?.();
    }
  };

  const lastSync = account.lastSyncAt
    ? new Date(account.lastSyncAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

  return (
    <div
      className="rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full shadow-soft relative overflow-hidden transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-white/90" />
            <span className="text-white font-bold text-lg tracking-tight">
              {account.name}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Sync now"
            >
              <RefreshCw size={14} className={`text-white ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleDisconnect}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="Disconnect"
            >
              <Unlink size={14} className="text-white" />
            </button>
          </div>
        </div>
        <span className="text-white/70 text-xs font-medium">Connected</span>
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-white/70 text-xs font-medium mb-1">Balance</p>
        <p className="text-white text-xl font-bold">
          {currencySymbol}
          {account.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-white/60 text-[10px] mt-1">Synced: {lastSync}</p>
      </div>
    </div>
  );
}