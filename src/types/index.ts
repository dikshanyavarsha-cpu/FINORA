export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountType: 'savings' | 'current';
  accountNumber: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface BrokerAccount {
  id: string;
  name: string;
  brokerName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  marketCap: 'large' | 'mid' | 'small';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  sourceAccountId: string;
  sourceName: string;
  currency: string;
  lastUpdated: string;
}

export interface MutualFundHolding {
  id: string;
  symbol: string;
  name: string;
  category: string;
  fundType: 'equity' | 'debt' | 'hybrid' | 'index';
  quantity: number;
  averageCost: number;
  currentNav: number;
  expenseRatio: number;
  sourceAccountId: string;
  sourceName: string;
  currency: string;
  lastUpdated: string;
  topHoldings: string[];
}

export interface SIP {
  id: string;
  fundName: string;
  fundSymbol: string;
  monthlyAmount: number;
  startDate: string;
  nextDate: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  accountId: string;
  accountName: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  change: number;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
}

export interface MonthlyExpense {
  month: string;
  total: number;
  categories: Record<string, number>;
}

export interface PortfolioSnapshot {
  month: string;
  value: number;
  invested: number;
}

export interface UserProfile {
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyInvestment: number;
  currentSavings: number;
  existingInvestments: number;
  investmentExperience: 'beginner' | 'intermediate' | 'advanced';
  investmentHorizon: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  category: string;
  summary: string;
  relevantHoldings: string[];
  impactSummary: string;
}

export interface AIConversation {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'portfolio' | 'goal' | 'sip' | 'spending' | 'transaction' | 'concentration' | 'health' | 'market';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface DemoData {
  bankAccounts: BankAccount[];
  brokerAccounts: BrokerAccount[];
  stocks: StockHolding[];
  mutualFunds: MutualFundHolding[];
  sips: SIP[];
  transactions: Transaction[];
  monthlyExpenses: MonthlyExpense[];
  goals: Goal[];
  portfolioHistory: PortfolioSnapshot[];
  news: NewsItem[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
}
