import React, { useCallback, useState, createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Card,
  Transaction,
  Account,
  Page,
  WalletBudget,
  BudgetSettings,
  Debt,
  DebtPayment } from
'../types/finance';
import {
  fetchBalance,
  fetchTransactions,
  disconnectAccount,
  InstitutionId,
  PH_INSTITUTIONS,
} from '../services/brankas';
type Theme = 'light' | 'dark' | 'system';
type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'PHP';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY';
interface Settings {
  theme: Theme;
  currency: Currency;
  dateFormat: DateFormat;
  pushNotifications: boolean;
  spendingAlerts: boolean;
  spendingThreshold: number;
  incomeReminders: boolean;
}
const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  PHP: '₱'
};
interface FinanceContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
  goBack: () => void;
  cards: Card[];
  transactions: Transaction[];
  accounts: Account[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  togglePinTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;
  bulkUpdateTransactions: (ids: string[], updates: Partial<Transaction>) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  undoLastTransaction: () => void;
  getTransactionSuggestions: (query: string) => Transaction[];
  getCategorySpending: (category: string) => number;
  budgets: Record<string, number>;
  updateCategoryBudget: (category: string, amount: number) => void;
  walletBudgets: WalletBudget[];
  updateWalletBudget: (budget: WalletBudget) => void;
  budgetSettings: BudgetSettings;
  updateBudgetSettings: (settings: Partial<BudgetSettings>) => void;
  isBudgetModalOpen: boolean;
  openBudgetModal: (accountId?: string, tab?: 'wallet' | 'settings') => void;
  closeBudgetModal: () => void;
  selectedBudgetId?: string;
  budgetModalTab: 'wallet' | 'settings';
  lastTransaction: Transaction | null;
  totalBalance: number;
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  currencySymbol: string;
  debts: Debt[];
  addDebt: (
  debt: Omit<Debt, 'id' | 'status' | 'payments' | 'dateAdded'>)
  => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addDebtPayment: (debtId: string, payment: Omit<DebtPayment, 'id'>) => void;
  // Connected accounts (Brankas)
  connectedAccounts: Account[];
  addConnectedAccount: (account: Omit<Account, 'id' | 'type'>) => void;
  removeConnectedAccount: (id: string) => void;
  syncConnectedAccount: (id: string) => Promise<void>;
  syncAllConnectedAccounts: () => Promise<void>;
}
const initialCards: Card[] = [];

const initialTransactions: Transaction[] = [];

const initialAccounts: Account[] = [];

const defaultBudgets: Record<string, number> = {
  Food: 500,
  Entertainment: 200,
  Shopping: 300,
  Transport: 150,
  Bills: 1000,
  Health: 200,
  Education: 400,
  Travel: 500,
  General: 200
};
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);
export function FinanceProvider({ children }: {children: React.ReactNode;}) {
  const [activePage, setActivePageRaw] = useLocalStorage<Page>(
    'fintra_activePage',
    'home'
  );
  const [pageHistory, setPageHistory] = useLocalStorage<Page[]>(
    'fintra_pageHistory',
    ['home']
  );
  const [cards] = useLocalStorage<Card[]>('fintra_cards', initialCards);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'fintra_transactions',
    initialTransactions
  );
  const [accounts, setAccounts] = useLocalStorage<Account[]>(
    'fintra_accounts',
    initialAccounts
  );
  const [connectedAccounts, setConnectedAccounts] = useLocalStorage<Account[]>(
    'fintra_connected_accounts',
    []
  );
  const [categoryBudgets, setCategoryBudgets] = useLocalStorage<
    Record<string, number>>(
    'fintra_categoryBudgets', defaultBudgets);
  const [walletBudgets, setWalletBudgets] = useLocalStorage<WalletBudget[]>(
    'fintra_walletBudgets',
    []
  );
  const [budgetSettings, setBudgetSettings] = useLocalStorage<BudgetSettings>(
    'fintra_budgetSettings',
    {
      rolloverEnabled: false,
      defaultCycle: 'monthly',
      customCycleStartDay: 1
    }
  );
  const [debts, setDebts] = useLocalStorage<Debt[]>('fintra_debts', []);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | undefined>();
  const [budgetModalTab, setBudgetModalTab] = useState<'wallet' | 'settings'>(
    'wallet'
  );
  const [settings, setSettings] = useLocalStorage<Settings>('fintra_settings', {
    theme: 'light',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    pushNotifications: false,
    spendingAlerts: false,
    spendingThreshold: 1000,
    incomeReminders: false
  });
  // Centralized balance logic — handles credit card inversion
  function applyAmount(account: Account, amount: number): number {
    return account.balance + amount;
  }
  // Reverse of applyAmount
  function revertAmount(account: Account, amount: number): number {
    return account.balance - amount;
  }
  function recomputeBalance(accountId: string): number {
    return transactions.
    filter(
      (t) =>
      t.accountId === accountId ||
      t.fromAccountId === accountId ||
      t.toAccountId === accountId
    ).
    reduce((sum, t) => {
      if (t.transactionType === 'transfer') {
        if (t.fromAccountId === accountId) return sum - Math.abs(t.amount);
        if (t.toAccountId === accountId) return sum + Math.abs(t.amount);
      }
      return sum + t.amount;
    }, 0);
  }
  const setActivePage = (page: Page) => {
    if (page !== activePage) {
      setPageHistory((prev) => [...prev, activePage]);
      setActivePageRaw(page);
    }
  };
  const goBack = () => {
    if (pageHistory.length > 0) {
      const newHistory = [...pageHistory];
      const prevPage = newHistory.pop();
      setPageHistory(newHistory);
      if (prevPage) setActivePageRaw(prevPage);
    } else {
      setActivePageRaw('home');
    }
  };
  const updateSetting = <K extends keyof Settings,>(
  key: K,
  value: Settings[K]) =>
  {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  const currencySymbol = currencySymbols[settings.currency];
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9)
    };
    setTransactions([newTransaction, ...transactions]);
    if (
    transaction.transactionType === 'transfer' &&
    transaction.fromAccountId &&
    transaction.toAccountId)
    {
      setAccounts(
        accounts.map((acc) => {
          if (acc.id === transaction.fromAccountId) {
            return {
              ...acc,
              balance: revertAmount(acc, Math.abs(transaction.amount))
            };
          }
          if (acc.id === transaction.toAccountId) {
            return {
              ...acc,
              balance: applyAmount(acc, Math.abs(transaction.amount))
            };
          }
          return acc;
        })
      );
    } else if (transaction.accountId) {
      setAccounts(
        accounts.map((acc) =>
        acc.id === transaction.accountId ?
        {
          ...acc,
          balance: applyAmount(acc, transaction.amount)
        } :
        acc
        )
      );
    }
  };
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const oldTransaction = transactions.find((t) => t.id === id);
    if (!oldTransaction) return;
    const newTransaction = {
      ...oldTransaction,
      ...updates
    };
    setTransactions(transactions.map((t) => t.id === id ? newTransaction : t));
    setAccounts((currentAccounts) => {
      return currentAccounts.map((acc) => {
        let newBalance = acc.balance;
        // Handle old transaction reversal
        if (oldTransaction.transactionType === 'transfer') {
          if (acc.id === oldTransaction.fromAccountId)
          newBalance = applyAmount(acc, Math.abs(oldTransaction.amount));
          if (acc.id === oldTransaction.toAccountId)
          newBalance = revertAmount(acc, Math.abs(oldTransaction.amount));
        } else if (
        oldTransaction.accountId &&
        acc.id === oldTransaction.accountId)
        {
          newBalance = revertAmount(acc, oldTransaction.amount);
        }
        // Handle new transaction application
        if (newTransaction.transactionType === 'transfer') {
          if (acc.id === newTransaction.fromAccountId)
          newBalance = revertAmount(
            {
              ...acc,
              balance: newBalance
            },
            Math.abs(newTransaction.amount)
          );
          if (acc.id === newTransaction.toAccountId)
          newBalance = applyAmount(
            {
              ...acc,
              balance: newBalance
            },
            Math.abs(newTransaction.amount)
          );
        } else if (
        newTransaction.accountId &&
        acc.id === newTransaction.accountId)
        {
          newBalance = applyAmount(
            {
              ...acc,
              balance: newBalance
            },
            newTransaction.amount
          );
        }
        return {
          ...acc,
          balance: newBalance
        };
      });
    });
  };
  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find((t) => t.id === id);
    if (!transactionToDelete) return;
    setTransactions(transactions.filter((t) => t.id !== id));
    if (transactionToDelete.transactionType === 'transfer') {
      setAccounts(
        accounts.map((acc) => {
          if (acc.id === transactionToDelete.fromAccountId)
          return {
            ...acc,
            balance: applyAmount(acc, Math.abs(transactionToDelete.amount))
          };
          if (acc.id === transactionToDelete.toAccountId)
          return {
            ...acc,
            balance: revertAmount(acc, Math.abs(transactionToDelete.amount))
          };
          return acc;
        })
      );
    } else if (transactionToDelete.accountId) {
      setAccounts(
        accounts.map((acc) =>
        acc.id === transactionToDelete.accountId ?
        {
          ...acc,
          balance: revertAmount(acc, transactionToDelete.amount)
        } :
        acc
        )
      );
    }
  };
  const duplicateTransaction = (id: string) => {
    const transactionToDuplicate = transactions.find((t) => t.id === id);
    if (transactionToDuplicate) {
      const newTransaction = {
        ...transactionToDuplicate,
        id: Math.random().toString(36).substring(2, 9),
        date: 'Today' // Reset date to today for duplicated transactions
      };
      setTransactions([newTransaction, ...transactions]);
      if (newTransaction.transactionType === 'transfer') {
        setAccounts(
          accounts.map((acc) => {
            if (acc.id === newTransaction.fromAccountId)
            return {
              ...acc,
              balance: revertAmount(acc, Math.abs(newTransaction.amount))
            };
            if (acc.id === newTransaction.toAccountId)
            return {
              ...acc,
              balance: applyAmount(acc, Math.abs(newTransaction.amount))
            };
            return acc;
          })
        );
      } else if (newTransaction.accountId) {
        setAccounts(
          accounts.map((acc) =>
          acc.id === newTransaction.accountId ?
          {
            ...acc,
            balance: applyAmount(acc, newTransaction.amount)
          } :
          acc
          )
        );
      }
    }
  };
  const togglePinTransaction = (id: string) => {
    setTransactions(
      transactions.map((t) =>
      t.id === id ?
      {
        ...t,
        pinned: !t.pinned
      } :
      t
      )
    );
  };
  const bulkDeleteTransactions = (ids: string[]) => {
    const toDelete = transactions.filter((t) => ids.includes(t.id));
    // Reverse all balance effects
    const balanceAdjustments: Record<string, number> = {};
    toDelete.forEach((t) => {
      if (t.transactionType === 'transfer') {
        if (t.fromAccountId) {
          if (!balanceAdjustments[t.fromAccountId])
          balanceAdjustments[t.fromAccountId] = 0;
          balanceAdjustments[t.fromAccountId] += Math.abs(t.amount);
        }
        if (t.toAccountId) {
          if (!balanceAdjustments[t.toAccountId])
          balanceAdjustments[t.toAccountId] = 0;
          balanceAdjustments[t.toAccountId] -= Math.abs(t.amount);
        }
      } else if (t.accountId) {
        if (!balanceAdjustments[t.accountId])
        balanceAdjustments[t.accountId] = 0;
        balanceAdjustments[t.accountId] -= t.amount;
      }
    });
    setAccounts(
      accounts.map((acc) => {
        const adjustment = balanceAdjustments[acc.id];
        if (adjustment)
        return {
          ...acc,
          balance: acc.balance + adjustment
        };
        return acc;
      })
    );
    setTransactions(transactions.filter((t) => !ids.includes(t.id)));
  };
  const bulkUpdateTransactions = (
  ids: string[],
  updates: Partial<Transaction>) =>
  {
    setTransactions(
      transactions.map((t) =>
      ids.includes(t.id) ?
      {
        ...t,
        ...updates
      } :
      t
      )
    );
  };
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount = {
      ...account,
      id: Math.random().toString(36).substring(2, 9)
    };
    setAccounts([...accounts, newAccount]);
  };
  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(
      accounts.map((a) =>
      a.id === id ?
      {
        ...a,
        ...updates
      } :
      a
      )
    );
  };
  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  // Connected account functions
  const addConnectedAccount = (account: Omit<Account, 'id' | 'type'>) => {
    const newAccount: Account = {
      ...account,
      id: Math.random().toString(36).substring(2, 9),
      type: 'connected',
      isConnected: true,
      lastSyncAt: new Date().toISOString(),
    };
    setConnectedAccounts((prev) => [...prev, newAccount]);
  };

  const removeConnectedAccount = async (id: string) => {
    const account = connectedAccounts.find((a) => a.id === id);
    if (account?.connectedAccountId && account?.accessToken) {
      try {
        await disconnectAccount(account.accessToken, account.connectedAccountId);
      } catch (err) {
        console.error('Failed to disconnect from Brankas:', err);
      }
    }
    setConnectedAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const syncConnectedAccount = async (id: string) => {
    const account = connectedAccounts.find((a) => a.id === id);
    if (!account?.connectedAccountId || !account?.accessToken) return;

    try {
      // Fetch latest balance
      const balanceData = await fetchBalance(account.accessToken, account.connectedAccountId);
      
      // Fetch recent transactions (last 30 days)
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const brankasTransactions = await fetchTransactions(
        account.accessToken,
        account.connectedAccountId,
        startDate,
        endDate
      );

      // Update account balance
      setConnectedAccounts((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                balance: balanceData.balance,
                lastSyncAt: new Date().toISOString(),
              }
            : a
        )
      );

      // Add new transactions to transaction list
      const existingIds = new Set(transactions.map((t) => t.id));
      const newTransactions: Transaction[] = brankasTransactions
        .filter((bt) => !existingIds.has(bt.id))
        .map((bt) => ({
          id: bt.id,
          name: bt.description || 'Unknown',
          description: bt.reference || '',
          amount: bt.type === 'debit' ? -bt.amount : bt.amount,
          date: new Date(bt.transactedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          category: 'Uncategorized',
          icon: 'credit-card',
          accountId: id,
          transactionType: 'expense',
        }));

      if (newTransactions.length > 0) {
        setTransactions((prev) => [...newTransactions, ...prev]);
      }
    } catch (err) {
      console.error('Failed to sync account:', err);
      throw err;
    }
  };

  const syncAllConnectedAccounts = async () => {
    for (const account of connectedAccounts) {
      if (account.connectedAccountId) {
        await syncConnectedAccount(account.id);
      }
    }
  };
  const undoLastTransaction = () => {
    if (transactions.length > 0) {
      const lastTx = transactions[0];
      setTransactions(transactions.slice(1));
      if (lastTx.transactionType === 'transfer') {
        setAccounts(
          accounts.map((acc) => {
            if (acc.id === lastTx.fromAccountId)
            return {
              ...acc,
              balance: applyAmount(acc, Math.abs(lastTx.amount))
            };
            if (acc.id === lastTx.toAccountId)
            return {
              ...acc,
              balance: revertAmount(acc, Math.abs(lastTx.amount))
            };
            return acc;
          })
        );
      } else if (lastTx.accountId) {
        setAccounts(
          accounts.map((acc) =>
          acc.id === lastTx.accountId ?
          {
            ...acc,
            balance: revertAmount(acc, lastTx.amount)
          } :
          acc
          )
        );
      }
    }
  };
  const getTransactionSuggestions = useCallback(
    (query: string) => {
      if (!query) return [];
      const lowerQuery = query.toLowerCase();
      // Get unique transactions by name
      const uniqueByName = new Map<string, Transaction>();
      transactions.forEach((t) => {
        if (
        t.name.toLowerCase().includes(lowerQuery) &&
        !uniqueByName.has(t.name.toLowerCase()))
        {
          uniqueByName.set(t.name.toLowerCase(), t);
        }
      });
      return Array.from(uniqueByName.values()).slice(0, 3);
    },
    [transactions]
  );
  const getCategorySpending = (category: string) => {
    return transactions.
    filter(
      (t) =>
      t.category === category &&
      t.amount < 0 &&
      t.transactionType !== 'transfer'
    ).
    reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };
  const updateCategoryBudget = (category: string, amount: number) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [category]: amount
    });
  };
  const updateWalletBudget = (budget: WalletBudget) => {
    const existingIndex = walletBudgets.findIndex(
      (b) => b.accountId === budget.accountId
    );
    if (existingIndex >= 0) {
      const newBudgets = [...walletBudgets];
      newBudgets[existingIndex] = budget;
      setWalletBudgets(newBudgets);
    } else {
      setWalletBudgets([...walletBudgets, budget]);
    }
  };
  const updateBudgetSettings = (newSettings: Partial<BudgetSettings>) => {
    setBudgetSettings({
      ...budgetSettings,
      ...newSettings
    });
  };
  const addDebt = (
  debt: Omit<Debt, 'id' | 'status' | 'payments' | 'dateAdded'>) =>
  {
    const newDebt: Debt = {
      ...debt,
      id: Math.random().toString(36).substring(2, 9),
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'pending',
      payments: []
    };
    setDebts([newDebt, ...debts]);
  };
  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(
      debts.map((d) =>
      d.id === id ?
      {
        ...d,
        ...updates
      } :
      d
      )
    );
  };
  const deleteDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };
  const addDebtPayment = (debtId: string, payment: Omit<DebtPayment, 'id'>) => {
    setDebts(
      debts.map((d) => {
        if (d.id === debtId) {
          const newPayment = {
            ...payment,
            id: Math.random().toString(36).substring(2, 9)
          };
          const newPayments = [...d.payments, newPayment];
          const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
          let newStatus: Debt['status'] = 'pending';
          if (totalPaid >= d.amount) newStatus = 'paid';else
          if (totalPaid > 0) newStatus = 'partial';
          return {
            ...d,
            payments: newPayments,
            status: newStatus
          };
        }
        return d;
      })
    );
  };
  const openBudgetModal = (
  accountId?: string,
  tab: 'wallet' | 'settings' = 'wallet') =>
  {
    setSelectedBudgetId(accountId);
    setBudgetModalTab(tab);
    setIsBudgetModalOpen(true);
  };
  const closeBudgetModal = () => {
    setIsBudgetModalOpen(false);
    setSelectedBudgetId(undefined);
  };
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0) +
    connectedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const lastTransaction = transactions.length > 0 ? transactions[0] : null;
  return (
    <FinanceContext.Provider
      value={{
        activePage,
        setActivePage,
        goBack,
        cards,
        transactions,
        accounts,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        togglePinTransaction,
        bulkDeleteTransactions,
        bulkUpdateTransactions,
        addAccount,
        updateAccount,
        deleteAccount,
        undoLastTransaction,
        getTransactionSuggestions,
        getCategorySpending,
        budgets: categoryBudgets,
        updateCategoryBudget,
        walletBudgets,
        updateWalletBudget,
        budgetSettings,
        updateBudgetSettings,
        isBudgetModalOpen,
        openBudgetModal,
        closeBudgetModal,
        selectedBudgetId,
        budgetModalTab,
        lastTransaction,
        totalBalance,
        settings,
        updateSetting,
        currencySymbol,
        debts,
        addDebt,
        updateDebt,
        deleteDebt,
        addDebtPayment,
        connectedAccounts,
        addConnectedAccount,
        removeConnectedAccount,
        syncConnectedAccount,
        syncAllConnectedAccounts,
      }}>
      
      {children}
    </FinanceContext.Provider>);

}
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}