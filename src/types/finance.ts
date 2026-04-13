export interface Card {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  type: 'visa' | 'mastercard';
}

export interface Transaction {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
  tags?: string[];
  recurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  pinned?: boolean;
  notes?: string;
  accountId?: string;
  transactionType?: 'expense' | 'income' | 'transfer';
  fromAccountId?: string;
  toAccountId?: string;
}

export interface HistoryEntry {
  type: 'add' | 'update' | 'delete' | 'duplicate' | 'transfer';
  timestamp: number;
  transaction: Transaction;
  previousState?: Transaction;
}

export interface Account {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'bank' | 'savings' | 'connected';
  balance: number;
  icon: string;
  // Connected account fields (for Brankas)
  connectedAccountId?: string;
  institution?: string;
  institutionId?: string;
  lastSyncAt?: string;
  isConnected?: boolean;
}

export interface WalletBudget {
  accountId: string;
  amount: number;
  cycle: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  rollover: boolean;
  rolloverAmount?: number;
}

export interface BudgetSettings {
  rolloverEnabled: boolean;
  defaultCycle: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  customCycleStartDay: number;
}

export interface DebtPayment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Debt {
  id: string;
  debtorName: string;
  amount: number;
  description: string;
  dateAdded: string;
  dueDate?: string;
  status: 'pending' | 'partial' | 'paid';
  payments: DebtPayment[];
}

export type Page =
'home' |
'accounts' |
'cards' |
'history' |
'settings' |
'profile' |
'about' |
'privacy' |
'feedback' |
'faq' |
'analytics' |
'debts' |
'admin' |
'callback';