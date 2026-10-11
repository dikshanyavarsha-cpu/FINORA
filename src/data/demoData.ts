import type { DemoData } from '@/types';

export const demoData: DemoData = {
  userProfile: {
    age: 28,
    monthlyIncome: 120000,
    monthlyExpenses: 62000,
    monthlyInvestment: 28000,
    currentSavings: 245000,
    existingInvestments: 1000000,
    investmentExperience: 'intermediate',
    investmentHorizon: 15,
    riskTolerance: 'moderate',
    goals: ['MBA', 'House', 'Retirement'],
  },

  bankAccounts: [
    {
      id: 'bank-1',
      name: 'Primary Savings',
      bankName: 'HDFC Bank',
      accountType: 'savings',
      accountNumber: '****4821',
      balance: 185000,
      currency: 'INR',
      lastUpdated: '2026-08-27T08:00:00Z',
    },
    {
      id: 'bank-2',
      name: 'Salary Account',
      bankName: 'ICICI Bank',
      accountType: 'current',
      accountNumber: '****7392',
      balance: 60000,
      currency: 'INR',
      lastUpdated: '2026-08-27T08:00:00Z',
    },
  ],

  brokerAccounts: [
    {
      id: 'broker-1',
      name: 'Zerodha Demat',
      brokerName: 'Zerodha',
      accountNumber: 'ZD****5621',
      balance: 15000,
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'broker-2',
      name: 'Groww Demat',
      brokerName: 'Groww',
      accountNumber: 'GW****8834',
      balance: 8500,
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
  ],

  stocks: [
    {
      id: 'stk-1',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Energy',
      marketCap: 'large',
      quantity: 25,
      averageCost: 2100,
      currentPrice: 2845,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-2',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'Technology',
      marketCap: 'large',
      quantity: 12,
      averageCost: 3200,
      currentPrice: 3850,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-3',
      symbol: 'INFY',
      name: 'Infosys Ltd',
      sector: 'Technology',
      marketCap: 'large',
      quantity: 30,
      averageCost: 1450,
      currentPrice: 1820,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-4',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Financial Services',
      marketCap: 'large',
      quantity: 18,
      averageCost: 1550,
      currentPrice: 1680,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-5',
      symbol: 'WIPRO',
      name: 'Wipro Ltd',
      sector: 'Technology',
      marketCap: 'large',
      quantity: 40,
      averageCost: 410,
      currentPrice: 480,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-6',
      symbol: 'ITC',
      name: 'ITC Ltd',
      sector: 'Consumer Goods',
      marketCap: 'large',
      quantity: 50,
      averageCost: 380,
      currentPrice: 445,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-7',
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      sector: 'Automobile',
      marketCap: 'large',
      quantity: 20,
      averageCost: 520,
      currentPrice: 715,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
    {
      id: 'stk-8',
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Ltd',
      sector: 'Telecom',
      marketCap: 'large',
      quantity: 15,
      averageCost: 720,
      currentPrice: 1380,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
    },
  ],

  mutualFunds: [
    {
      id: 'mf-1',
      symbol: 'PARAGLEXI',
      name: 'Parag Parikh Flexi Cap Fund',
      category: 'Flexi Cap',
      fundType: 'equity',
      quantity: 4200,
      averageCost: 72.5,
      currentNav: 88.3,
      expenseRatio: 0.62,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['HDFC Bank', 'Reliance', 'ICICI Bank', 'Bajaj Finance', 'TCS'],
    },
    {
      id: 'mf-2',
      symbol: 'AXISBLUE',
      name: 'Axis Bluechip Fund',
      category: 'Large Cap',
      fundType: 'equity',
      quantity: 3100,
      averageCost: 48.2,
      currentNav: 56.8,
      expenseRatio: 0.52,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['TCS', 'Infosys', 'HDFC Bank', 'Reliance', 'ICICI Bank'],
    },
    {
      id: 'mf-3',
      symbol: 'MIRAEASSET',
      name: 'Mirae Asset Large Cap Fund',
      category: 'Large Cap',
      fundType: 'equity',
      quantity: 2800,
      averageCost: 32.1,
      currentNav: 38.5,
      expenseRatio: 0.58,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['HDFC Bank', 'Infosys', 'TCS', 'Reliance', 'ITC'],
    },
    {
      id: 'mf-4',
      symbol: 'SBIIT',
      name: 'SBI Nifty Index Fund',
      category: 'Index Fund',
      fundType: 'index',
      quantity: 5500,
      averageCost: 142,
      currentNav: 168,
      expenseRatio: 0.18,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['Reliance', 'HDFC Bank', 'Infosys', 'TCS', 'ICICI Bank'],
    },
    {
      id: 'mf-5',
      symbol: 'NIFTYNEXT',
      name: 'Nippon India Nifty Next 50 Index Fund',
      category: 'Index Fund',
      fundType: 'index',
      quantity: 2000,
      averageCost: 58,
      currentNav: 72,
      expenseRatio: 0.25,
      sourceAccountId: 'broker-1',
      sourceName: 'Zerodha',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['Tata Motors', 'Bharti Airtel', 'Wipro', 'ITC', 'Divis Labs'],
    },
    {
      id: 'mf-6',
      symbol: 'HDFCHYBD',
      name: 'HDFC Hybrid Debt Fund',
      category: 'Hybrid Debt',
      fundType: 'hybrid',
      quantity: 3500,
      averageCost: 25.8,
      currentNav: 27.4,
      expenseRatio: 0.45,
      sourceAccountId: 'broker-2',
      sourceName: 'Groww',
      currency: 'INR',
      lastUpdated: '2026-08-27T09:30:00Z',
      topHoldings: ['Govt Securities', 'AAA Corporate Bonds', 'HDFC Bank', 'TCS'],
    },
  ],

  sips: [
    {
      id: 'sip-1',
      fundName: 'Parag Parikh Flexi Cap Fund',
      fundSymbol: 'PARAGLEXI',
      monthlyAmount: 10000,
      startDate: '2024-01-05',
      nextDate: '2026-09-05',
      active: true,
    },
    {
      id: 'sip-2',
      fundName: 'SBI Nifty Index Fund',
      fundSymbol: 'SBIIT',
      monthlyAmount: 8000,
      startDate: '2024-03-10',
      nextDate: '2026-09-10',
      active: true,
    },
    {
      id: 'sip-3',
      fundName: 'Axis Bluechip Fund',
      fundSymbol: 'AXISBLUE',
      monthlyAmount: 10000,
      startDate: '2024-06-15',
      nextDate: '2026-09-15',
      active: true,
    },
  ],

  goals: [
    {
      id: 'goal-1',
      name: 'MBA',
      icon: 'GraduationCap',
      targetAmount: 1000000,
      currentAmount: 320000,
      targetDate: '2029-06-01',
      monthlyContribution: 12000,
      priority: 'high',
    },
    {
      id: 'goal-2',
      name: 'House',
      icon: 'Home',
      targetAmount: 3000000,
      currentAmount: 850000,
      targetDate: '2031-01-01',
      monthlyContribution: 15000,
      priority: 'high',
    },
    {
      id: 'goal-3',
      name: 'Retirement',
      icon: 'PiggyBank',
      targetAmount: 5000000,
      currentAmount: 1250000,
      targetDate: '2046-01-01',
      monthlyContribution: 10000,
      priority: 'medium',
    },
  ],

  transactions: generateTransactions(),

  monthlyExpenses: [
    {
      month: 'Jun 2026',
      total: 58500,
      categories: {
        Food: 12500, Transport: 8200, Shopping: 6500, Education: 5000,
        Entertainment: 4200, Subscriptions: 1800, Bills: 12000, Travel: 3500,
        Healthcare: 2800, Other: 2000,
      },
    },
    {
      month: 'Jul 2026',
      total: 64200,
      categories: {
        Food: 14200, Transport: 7800, Shopping: 7200, Education: 4800,
        Entertainment: 3800, Subscriptions: 1900, Bills: 13500, Travel: 7800,
        Healthcare: 2200, Other: 2000,
      },
    },
    {
      month: 'Aug 2026',
      total: 62800,
      categories: {
        Food: 14300, Transport: 8500, Shopping: 5800, Education: 4500,
        Entertainment: 4100, Subscriptions: 1950, Bills: 12800, Travel: 4200,
        Healthcare: 3100, Other: 2850,
      },
    },
  ],

  portfolioHistory: generatePortfolioHistory(),

  news: [
    {
      id: 'news-1',
      headline: 'RBI holds repo rate steady at 6.5%, signals potential cut in Q4',
      source: 'Economic Times',
      date: '2026-08-26',
      category: 'Monetary Policy',
      summary: 'The Reserve Bank of India maintained its repo rate at 6.5% in its August policy review, with the governor hinting at a possible rate cut in the December quarter if inflation continues to moderate.',
      relevantHoldings: ['HDFC Bank', 'ICICI Bank', 'HDFC Hybrid Debt Fund'],
      impactSummary: 'Rate-sensitive sectors like banking and debt funds in your portfolio may see moderate impact. Your hybrid debt fund could benefit if rates decline later this year.',
    },
    {
      id: 'news-2',
      headline: 'IT sector reports strong Q2 earnings, TCS and Infosys beat estimates',
      source: 'Mint',
      date: '2026-08-25',
      category: 'Earnings',
      summary: 'Major IT companies reported better-than-expected quarterly results, with TCS and Infosys both beating analyst estimates on revenue and margin fronts.',
      relevantHoldings: ['TCS', 'Infosys', 'Wipro', 'Axis Bluechip Fund', 'Mirae Asset Large Cap'],
      impactSummary: 'Your technology holdings (TCS, Infosys, Wipro) and funds with significant IT exposure may benefit from the positive earnings sentiment.',
    },
    {
      id: 'news-3',
      headline: 'Reliance announces major renewable energy investment plan',
      source: 'Business Standard',
      date: '2026-08-24',
      category: 'Corporate',
      summary: 'Reliance Industries unveiled a new $10 billion investment plan in renewable energy and green hydrogen, aiming to be net carbon negative by 2035.',
      relevantHoldings: ['Reliance Industries', 'Parag Parikh Flexi Cap', 'SBI Nifty Index Fund'],
      impactSummary: 'Your largest single stock holding (Reliance) could see long-term positive impact from this strategic pivot, though near-term capex may pressure margins.',
    },
  ],

  notifications: [
    {
      id: 'notif-1',
      type: 'concentration',
      title: 'Sector concentration alert',
      message: 'Your technology sector exposure has increased to 38% of your equity portfolio.',
      timestamp: '2026-08-27T07:00:00Z',
      read: false,
      priority: 'high',
    },
    {
      id: 'notif-2',
      type: 'sip',
      title: 'SIP reminder',
      message: 'Your SIP of ₹10,000 for Parag Parikh Flexi Cap is due on Sep 5.',
      timestamp: '2026-08-27T06:00:00Z',
      read: false,
      priority: 'medium',
    },
    {
      id: 'notif-3',
      type: 'goal',
      title: 'Goal milestone reached',
      message: 'Your MBA goal has crossed 30% completion. Great progress!',
      timestamp: '2026-08-26T10:00:00Z',
      read: true,
      priority: 'low',
    },
    {
      id: 'notif-4',
      type: 'spending',
      title: 'Unusual spending detected',
      message: 'Your travel spending increased by 22% compared to last month.',
      timestamp: '2026-08-25T14:00:00Z',
      read: false,
      priority: 'medium',
    },
    {
      id: 'notif-5',
      type: 'portfolio',
      title: 'Portfolio movement',
      message: 'Your portfolio gained ₹18,450 today (+1.8%).',
      timestamp: '2026-08-27T09:30:00Z',
      read: false,
      priority: 'low',
    },
  ],
};

function generateTransactions() {
  const txns: DemoData['transactions'] = [];
  const categories = [
    { name: 'Food', merchants: ['Swiggy', 'Zomato', 'BigBasket', 'Dominos', 'Starbucks'] },
    { name: 'Transport', merchants: ['Uber', 'Ola', 'Indian Oil', 'Fastag', 'Metro Card'] },
    { name: 'Shopping', merchants: ['Amazon', 'Flipkart', 'Myntra', 'Decathlon', 'Croma'] },
    { name: 'Bills', merchants: ['Electricity Board', 'Airtel Broadband', 'Gas Agency', 'Water Dept'] },
    { name: 'Subscriptions', merchants: ['Netflix', 'Spotify', 'Amazon Prime', 'Notion', 'iCloud'] },
    { name: 'Entertainment', merchants: ['PVR Cinemas', 'BookMyShow', 'Bowling Alley'] },
    { name: 'Travel', merchants: ['MakeMyTrip', 'IRCTC', 'Airbnb', 'IndiGo'] },
    { name: 'Healthcare', merchants: ['Apollo Pharmacy', 'Dr Consultation', 'MedPlus'] },
    { name: 'Education', merchants: ['Coursera', 'Udemy', 'Skillshare'] },
    { name: 'Other', merchants: ['ATM Withdrawal', 'Misc Payment'] },
  ];

  let id = 1;
  const startDate = new Date('2026-06-01');
  const endDate = new Date('2026-08-27');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfMonth = d.getDate();
    if (dayOfMonth === 1) {
      txns.push({
        id: `txn-${id++}`,
        date: d.toISOString().split('T')[0],
        description: 'Salary Credit',
        category: 'Income',
        amount: 120000,
        type: 'credit',
        accountId: 'bank-2',
        accountName: 'ICICI Salary Account',
      });
    }
    if (dayOfMonth === 5 || dayOfMonth === 10 || dayOfMonth === 15) {
      txns.push({
        id: `txn-${id++}`,
        date: d.toISOString().split('T')[0],
        description: 'SIP Investment',
        category: 'Investment',
        amount: 10000,
        type: 'debit',
        accountId: 'bank-1',
        accountName: 'HDFC Savings',
      });
    }
    const numTxns = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numTxns; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const merchant = cat.merchants[Math.floor(Math.random() * cat.merchants.length)];
      const amount = 100 + Math.floor(Math.random() * 3500);
      txns.push({
        id: `txn-${id++}`,
        date: d.toISOString().split('T')[0],
        description: merchant,
        category: cat.name,
        amount,
        type: 'debit',
        accountId: Math.random() > 0.5 ? 'bank-1' : 'bank-2',
        accountName: Math.random() > 0.5 ? 'HDFC Savings' : 'ICICI Salary Account',
      });
    }
  }
  return txns.slice(0, 60);
}

function generatePortfolioHistory() {
  const history: DemoData['portfolioSnapshot'][] = [];
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  let invested = 820000;
  let value = 850000;
  for (let i = 0; i < 12; i++) {
    invested += 28000;
    const growth = 1 + (Math.random() * 0.08 - 0.02);
    value = (value + 28000) * growth;
    history.push({
      month: `${months[i]} ${i < 4 ? '25' : '26'}`,
      value: Math.round(value),
      invested: Math.round(invested),
    });
  }
  return history;
}
