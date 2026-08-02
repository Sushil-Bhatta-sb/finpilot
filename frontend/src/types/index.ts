export interface Income {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  description: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface Budget {
  _id: string;
  user: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  _id: string;
  user: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InvestmentType =
  | 'Stocks'
  | 'Mutual Funds'
  | 'Crypto'
  | 'Gold'
  | 'Fixed Deposit'
  | 'Real Estate';

export interface Investment {
  _id: string;
  user: string;
  name: string;
  type: InvestmentType;
  amountInvested: number;
  currentValue: number;
  profitLoss: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  user: string;
  name: string;
  type: 'income' | 'expense';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | 'income'
  | 'expense'
  | 'budget'
  | 'investment'
  | 'savings';

export interface Transaction {
  _id: string;
  user: string;
  type: TransactionType;
  refId: string;
  description?: string;
  amount?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'budget-alert'
  | 'goal-completed'
  | 'investment-update'
  | 'report-ready';

export interface Notification {
  _id: string;
  user: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress {
  category: string;
  limit: number;
  spent: number;
  percentUsed: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  totalSavings: number;
  totalInvestmentValue: number;
  budgetProgress: BudgetProgress[];
  recentTransactions: Transaction[];
  unreadNotificationsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  photo?: string;
  currency?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
}