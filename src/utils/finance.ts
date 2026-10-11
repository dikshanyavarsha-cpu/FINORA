import type {
  StockHolding,
  MutualFundHolding,
  BankAccount,
  BrokerAccount,
  Goal,
  Transaction,
  MonthlyExpense,
  PortfolioSnapshot,
  UserProfile,
} from '@/types';

export interface HoldingSummary {
  investedValue: number;
  currentValue: number;
  totalGain: number;
  totalGainPercent: number;
  todayChange: number;
  todayChangePercent: number;
}

export interface AggregatedHolding {
  symbol: string;
  name: string;
  type: 'stock' | 'mutualFund';
  totalQuantity: number;
  weightedAvgCost: number;
  investedValue: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
  sector?: string;
  category?: string;
  sources: { account: string; quantity: number; cost: number }[];
}

export function getStockSummary(stocks: StockHolding[]): HoldingSummary {
  let invested = 0;
  let current = 0;
  for (const s of stocks) {
    invested += s.quantity * s.averageCost;
    current += s.quantity * s.currentPrice;
  }
  const gain = current - invested;
  const gainPercent = invested > 0 ? (gain / invested) * 100 : 0;
  const todayChange = current * 0.018;
  return {
    investedValue: invested,
    currentValue: current,
    totalGain: gain,
    totalGainPercent: gainPercent,
    todayChange,
    todayChangePercent: 1.8,
  };
}

export function getMutualFundSummary(funds: MutualFundHolding[]): HoldingSummary {
  let invested = 0;
  let current = 0;
  for (const f of funds) {
    invested += f.quantity * f.averageCost;
    current += f.quantity * f.currentNav;
  }
  const gain = current - invested;
  const gainPercent = invested > 0 ? (gain / invested) * 100 : 0;
  const todayChange = current * 0.006;
  return {
    investedValue: invested,
    currentValue: current,
    totalGain: gain,
    totalGainPercent: gainPercent,
    todayChange,
    todayChangePercent: 0.6,
  };
}

export function getPortfolioSummary(
  stocks: StockHolding[],
  funds: MutualFundHolding[]
): HoldingSummary & { totalInvested: number; totalCurrent: number } {
  const stockSummary = getStockSummary(stocks);
  const fundSummary = getMutualFundSummary(funds);
  const totalInvested = stockSummary.investedValue + fundSummary.investedValue;
  const totalCurrent = stockSummary.currentValue + fundSummary.currentValue;
  const totalGain = totalCurrent - totalInvested;
  return {
    investedValue: stockSummary.investedValue,
    currentValue: stockSummary.currentValue,
    totalGain,
    totalGainPercent: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    todayChange: stockSummary.todayChange + fundSummary.todayChange,
    todayChangePercent:
      totalCurrent > 0
        ? ((stockSummary.todayChange + fundSummary.todayChange) / totalCurrent) * 100
        : 0,
    totalInvested,
    totalCurrent,
  };
}

export function getTotalCash(banks: BankAccount[], brokers: BrokerAccount[]): number {
  return (
    banks.reduce((sum, b) => sum + b.balance, 0) +
    brokers.reduce((sum, b) => sum + b.balance, 0)
  );
}

export function getNetWorth(
  banks: BankAccount[],
  brokers: BrokerAccount[],
  stocks: StockHolding[],
  funds: MutualFundHolding[]
): { total: number; breakdown: { label: string; value: number; percentage: number }[] } {
  const cash = getTotalCash(banks, brokers);
  const stockValue = getStockSummary(stocks).currentValue;
  const fundValue = getMutualFundSummary(funds).currentValue;
  const total = cash + stockValue + fundValue;
  const breakdown = [
    { label: 'Cash', value: cash, percentage: total > 0 ? (cash / total) * 100 : 0 },
    { label: 'Stocks', value: stockValue, percentage: total > 0 ? (stockValue / total) * 100 : 0 },
    { label: 'Mutual Funds', value: fundValue, percentage: total > 0 ? (fundValue / total) * 100 : 0 },
  ];
  return { total, breakdown };
}

export function aggregateHoldings(
  stocks: StockHolding[],
  funds: MutualFundHolding[]
): AggregatedHolding[] {
  const stockMap = new Map<string, AggregatedHolding>();
  for (const s of stocks) {
    const existing = stockMap.get(s.symbol);
    if (existing) {
      const newQty = existing.totalQuantity + s.quantity;
      const newInvested = existing.investedValue + s.quantity * s.averageCost;
      const newCurrent = existing.currentValue + s.quantity * s.currentPrice;
      existing.totalQuantity = newQty;
      existing.weightedAvgCost = newInvested / newQty;
      existing.investedValue = newInvested;
      existing.currentValue = newCurrent;
      existing.gain = newCurrent - newInvested;
      existing.gainPercent = newInvested > 0 ? (existing.gain / newInvested) * 100 : 0;
      existing.sources.push({ account: s.sourceName, quantity: s.quantity, cost: s.averageCost });
    } else {
      const invested = s.quantity * s.averageCost;
      const current = s.quantity * s.currentPrice;
      stockMap.set(s.symbol, {
        symbol: s.symbol,
        name: s.name,
        type: 'stock',
        totalQuantity: s.quantity,
        weightedAvgCost: s.averageCost,
        investedValue: invested,
        currentValue: current,
        gain: current - invested,
        gainPercent: invested > 0 ? ((current - invested) / invested) * 100 : 0,
        sector: s.sector,
        sources: [{ account: s.sourceName, quantity: s.quantity, cost: s.averageCost }],
      });
    }
  }
  for (const f of funds) {
    const invested = f.quantity * f.averageCost;
    const current = f.quantity * f.currentNav;
    stockMap.set(f.symbol, {
      symbol: f.symbol,
      name: f.name,
      type: 'mutualFund',
      totalQuantity: f.quantity,
      weightedAvgCost: f.averageCost,
      investedValue: invested,
      currentValue: current,
      gain: current - invested,
      gainPercent: invested > 0 ? ((current - invested) / invested) * 100 : 0,
      category: f.category,
      sources: [{ account: f.sourceName, quantity: f.quantity, cost: f.averageCost }],
    });
  }
  return Array.from(stockMap.values()).sort((a, b) => b.currentValue - a.currentValue);
}

export function getSectorAllocation(stocks: StockHolding[]): { sector: string; value: number; percentage: number }[] {
  const map = new Map<string, number>();
  let total = 0;
  for (const s of stocks) {
    const val = s.quantity * s.currentPrice;
    map.set(s.sector, (map.get(s.sector) || 0) + val);
    total += val;
  }
  return Array.from(map.entries())
    .map(([sector, value]) => ({ sector, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function getAssetAllocation(
  stocks: StockHolding[],
  funds: MutualFundHolding[],
  cash: number
): { label: string; value: number; percentage: number; color: string }[] {
  const stockValue = getStockSummary(stocks).currentValue;
  const fundValue = getMutualFundSummary(funds).currentValue;
  const total = stockValue + fundValue + cash;
  return [
    { label: 'Equity (Stocks)', value: stockValue, percentage: total > 0 ? (stockValue / total) * 100 : 0, color: '#1a76f0' },
    { label: 'Mutual Funds', value: fundValue, percentage: total > 0 ? (fundValue / total) * 100 : 0, color: '#10b981' },
    { label: 'Cash', value: cash, percentage: total > 0 ? (cash / total) * 100 : 0, color: '#f59e0b' },
  ];
}

export function getMarketCapAllocation(stocks: StockHolding[]): { cap: string; value: number; percentage: number }[] {
  const map = new Map<string, number>();
  let total = 0;
  for (const s of stocks) {
    const val = s.quantity * s.currentPrice;
    const cap = s.marketCap === 'large' ? 'Large Cap' : s.marketCap === 'mid' ? 'Mid Cap' : 'Small Cap';
    map.set(cap, (map.get(cap) || 0) + val);
    total += val;
  }
  return Array.from(map.entries())
    .map(([cap, value]) => ({ cap, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function calculateXIRR(
  cashflows: { date: string; amount: number }[],
  maxIterations = 100,
  tolerance = 1e-6
): number {
  if (cashflows.length < 2) return 0;
  const sorted = [...cashflows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = new Date(sorted[0].date);

  const dayToYear = (date: string) =>
    (new Date(date).getTime() - firstDate.getTime()) / (365 * 24 * 60 * 60 * 1000);

  let rate = 0.1;
  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = 0;
    let dnpv = 0;
    for (const cf of sorted) {
      const t = dayToYear(cf.date);
      const factor = Math.pow(1 + rate, t);
      npv += cf.amount / factor;
      dnpv -= (t * cf.amount) / (factor * (1 + rate));
    }
    if (Math.abs(npv) < tolerance) break;
    if (dnpv === 0) break;
    rate = rate - npv / dnpv;
    if (rate <= -0.99) rate = -0.99;
  }
  return rate * 100;
}

export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

export function getSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return ((income - expenses) / income) * 100;
}

export function getInvestmentRate(income: number, investment: number): number {
  if (income <= 0) return 0;
  return (investment / income) * 100;
}

export function getMonthlyCashFlow(income: number, expenses: number, investment: number): {
  income: number;
  expenses: number;
  investment: number;
  remaining: number;
} {
  return {
    income,
    expenses,
    investment,
    remaining: income - expenses - investment,
  };
}

export function getExpenseCategories(
  monthlyExpenses: MonthlyExpense[]
): { name: string; amount: number; percentage: number; change: number; color: string }[] {
  if (monthlyExpenses.length === 0) return [];
  const latest = monthlyExpenses[monthlyExpenses.length - 1];
  const previous = monthlyExpenses[monthlyExpenses.length - 2];
  const total = latest.total;
  const colors: Record<string, string> = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#ec4899',
    Education: '#8b5cf6',
    Entertainment: '#14b8a6',
    Subscriptions: '#eab308',
    Bills: '#ef4444',
    Travel: '#06b6d4',
    Healthcare: '#10b981',
    Other: '#6b7280',
  };
  return Object.entries(latest.categories)
    .map(([name, amount]) => {
      const prevAmount = previous ? previous.categories[name] || 0 : amount;
      const change = prevAmount > 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0;
      return {
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        change,
        color: colors[name] || '#6b7280',
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function getGoalProgress(goal: Goal): number {
  if (goal.targetAmount <= 0) return 0;
  return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
}

export function projectGoalValue(
  currentAmount: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number
): number {
  const monthlyRate = annualReturnPercent / 100 / 12;
  const months = years * 12;
  let value = currentAmount;
  for (let i = 0; i < months; i++) {
    value = value * (1 + monthlyRate) + monthlyContribution;
  }
  return value;
}

export function getGoalProjectionData(
  goal: Goal,
  annualReturnPercent: number
): { year: number; value: number; target: number }[] {
  const data: { year: number; value: number; target: number }[] = [];
  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  const totalYears = Math.max(1, (targetDate.getTime() - now.getTime()) / (365 * 24 * 60 * 60 * 1000));
  for (let y = 0; y <= Math.ceil(totalYears); y++) {
    const value = projectGoalValue(goal.currentAmount, goal.monthlyContribution, annualReturnPercent, y);
    const targetAtYear = goal.targetAmount * Math.min(1, y / totalYears);
    data.push({ year: y, value: Math.round(value), target: Math.round(targetAtYear) });
  }
  return data;
}

export function getRequiredMonthlyContribution(
  currentAmount: number,
  targetAmount: number,
  annualReturnPercent: number,
  years: number
): number {
  if (years <= 0) return 0;
  const monthlyRate = annualReturnPercent / 100 / 12;
  const months = years * 12;
  const futureValueOfCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
  const remainingTarget = Math.max(0, targetAmount - futureValueOfCurrent);
  if (monthlyRate === 0) return remainingTarget / months;
  const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return remainingTarget / factor;
}

export function detectGoalConflicts(
  goals: Goal[],
  annualReturnPercent: number
): { hasConflict: boolean; message: string; goals: { name: string; onTrack: boolean; requiredContribution: number; currentContribution: number }[] } {
  const results = goals.map((goal) => {
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const years = Math.max(0.1, (targetDate.getTime() - now.getTime()) / (365 * 24 * 60 * 60 * 1000));
    const required = getRequiredMonthlyContribution(
      goal.currentAmount,
      goal.targetAmount,
      annualReturnPercent,
      years
    );
    return {
      name: goal.name,
      onTrack: goal.monthlyContribution >= required * 0.9,
      requiredContribution: Math.round(required),
      currentContribution: goal.monthlyContribution,
    };
  });
  const offTrack = results.filter((r) => !r.onTrack);
  return {
    hasConflict: offTrack.length > 0,
    message:
      offTrack.length > 0
        ? `Your current contribution level may not support ${offTrack.map((g) => g.name).join(', ')} under the selected assumptions.`
        : 'All goals are on track with current contributions.',
    goals: results,
  };
}

export function detectDuplicateFunds(
  funds: MutualFundHolding[]
): { fund1: string; fund2: string; overlap: string[]; overlapCount: number }[] {
  const duplicates: { fund1: string; fund2: string; overlap: string[]; overlapCount: number }[] = [];
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const overlap = funds[i].topHoldings.filter((h) => funds[j].topHoldings.includes(h));
      if (overlap.length >= 3) {
        duplicates.push({
          fund1: funds[i].name,
          fund2: funds[j].name,
          overlap,
          overlapCount: overlap.length,
        });
      }
    }
  }
  return duplicates;
}

export function detectMoneyLeaks(
  banks: BankAccount[],
  brokers: BrokerAccount[],
  funds: MutualFundHolding[],
  userProfile: UserProfile,
  transactions: Transaction[]
): { type: string; title: string; description: string; severity: 'high' | 'medium' | 'low' }[] {
  const leaks: { type: string; title: string; description: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const cash = getTotalCash(banks, brokers);
  const emergencyTarget = userProfile.monthlyExpenses * 6;

  if (cash > emergencyTarget * 1.3) {
    leaks.push({
      type: 'idle_cash',
      title: 'Excess idle cash',
      description: `You have ₹${formatINR(cash)} in cash, which is ${Math.round((cash / emergencyTarget) * 10) / 10}x your 6-month emergency fund target. Consider investing the surplus.`,
      severity: 'medium',
    });
  }

  const subscriptions = transactions.filter((t) => t.category === 'Subscriptions');
  const subNames = new Set(subscriptions.map((s) => s.description));
  if (subNames.size >= 4) {
    leaks.push({
      type: 'duplicate_subscriptions',
      title: 'Multiple recurring subscriptions',
      description: `You have ${subNames.size} active subscriptions (${Array.from(subNames).slice(0, 4).join(', ')}). Review if all are needed.`,
      severity: 'low',
    });
  }

  const duplicates = detectDuplicateFunds(funds);
  if (duplicates.length > 0) {
    leaks.push({
      type: 'duplicate_funds',
      title: 'Overlapping mutual funds',
      description: `${duplicates[0].fund1} and ${duplicates[0].fund2} share ${duplicates[0].overlapCount} top holdings (${duplicates[0].overlap.join(', ')}). Consider consolidating.`,
      severity: 'medium',
    });
  }

  const highExpenseFunds = funds.filter((f) => f.expenseRatio > 0.5);
  if (highExpenseFunds.length > 0) {
    leaks.push({
      type: 'high_cost',
      title: 'Relatively high expense ratios',
      description: `${highExpenseFunds.map((f) => f.name).join(', ')} ${highExpenseFunds.length > 1 ? 'have' : 'has'} an expense ratio above 0.5%. Lower-cost alternatives may exist.`,
      severity: 'low',
    });
  }

  return leaks;
}

export function calculateSIPProjection(
  monthlyAmount: number,
  years: number,
  annualReturnPercent: number,
  annualIncreasePercent = 0
): { year: number; invested: number; value: number }[] {
  const data: { year: number; invested: number; value: number }[] = [];
  let invested = 0;
  let value = 0;
  let currentMonthly = monthlyAmount;
  const monthlyRate = annualReturnPercent / 100 / 12;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      invested += currentMonthly;
      value = value * (1 + monthlyRate) + currentMonthly;
    }
    data.push({ year: y, invested: Math.round(invested), value: Math.round(value) });
    currentMonthly *= 1 + annualIncreasePercent / 100;
  }
  return data;
}

export function simulateInvestment(
  currentStocks: StockHolding[],
  currentFunds: MutualFundHolding[],
  currentCash: number,
  investmentAmount: number,
  targetSector: string
): {
  before: { sector: string; percentage: number }[];
  after: { sector: string; percentage: number }[];
  concentrationChange: number;
  cashImpact: number;
} {
  const stockValue = getStockSummary(currentStocks).currentValue;
  const fundValue = getMutualFundSummary(currentFunds).currentValue;
  const totalBefore = stockValue + fundValue + currentCash;

  const sectorBefore = getSectorAllocation(currentStocks);
  const before = sectorBefore.map((s) => ({
    sector: s.sector,
    percentage: totalBefore > 0 ? (s.value / totalBefore) * 100 : 0,
  }));

  const totalAfter = totalBefore + investmentAmount;
  const after = sectorBefore.map((s) => {
    const newValue = s.sector === targetSector ? s.value + investmentAmount : s.value;
    return {
      sector: s.sector,
      percentage: totalAfter > 0 ? (newValue / totalAfter) * 100 : 0,
    };
  });

  const targetBefore = before.find((s) => s.sector === targetSector)?.percentage || 0;
  const targetAfter = after.find((s) => s.sector === targetSector)?.percentage || 0;

  return {
    before,
    after,
    concentrationChange: targetAfter - targetBefore,
    cashImpact: investmentAmount,
  };
}

export function simulateDecision(
  expenseAmount: number,
  userProfile: UserProfile,
  currentCash: number,
  goals: Goal[]
): {
  canAfford: boolean;
  cashAfterExpense: number;
  cashImpactPercent: number;
  goalImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
} {
  const cashAfter = currentCash - expenseAmount;
  const emergencyFund = userProfile.monthlyExpenses * 6;
  const canAfford = cashAfter >= emergencyFund;
  const cashImpactPercent = currentCash > 0 ? (expenseAmount / currentCash) * 100 : 0;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (cashAfter < emergencyFund) riskLevel = 'high';
  else if (cashImpactPercent > 20) riskLevel = 'medium';

  const totalMonthlyContribution = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  const goalImpact =
    cashImpactPercent > 30
      ? 'This expense could impact your ability to maintain current goal contributions.'
      : 'Your goal contributions should not be affected by this expense.';

  const recommendation = canAfford
    ? `You can afford this expense while maintaining your emergency fund. Your cash balance would reduce to ₹${formatINR(cashAfter)}.`
    : `This expense would reduce your cash below your 6-month emergency fund target (₹${formatINR(emergencyFund)}). Consider delaying or reducing the expense.`;

  return {
    canAfford,
    cashAfterExpense: cashAfter,
    cashImpactPercent,
    goalImpact,
    riskLevel,
    recommendation,
  };
}

export function calculateFinancialHealthScore(
  userProfile: UserProfile,
  banks: BankAccount[],
  brokers: BrokerAccount[],
  stocks: StockHolding[],
  funds: MutualFundHolding[]
): {
  score: number;
  components: { name: string; score: number; maxScore: number; status: string }[];
  biggestStrength: string;
  biggestImprovement: string;
} {
  const cash = getTotalCash(banks, brokers);
  const emergencyTarget = userProfile.monthlyExpenses * 6;
  const stockValue = getStockSummary(stocks).currentValue;
  const fundValue = getMutualFundSummary(funds).currentValue;
  const totalInvested = stockValue + fundValue;

  const savingsRate = getSavingsRate(userProfile.monthlyIncome, userProfile.monthlyExpenses);
  const investmentRate = getInvestmentRate(userProfile.monthlyIncome, userProfile.monthlyInvestment);

  const savingsScore = Math.min(15, (savingsRate / 50) * 15);
  const emergencyScore = Math.min(15, (cash / emergencyTarget) * 15);
  const debtScore = 12;
  const diversificationScore = Math.min(12, (getSectorAllocation(stocks).length / 8) * 12);
  const riskScore = 10;
  const consistencyScore = Math.min(13, (investmentRate / 20) * 13);
  const goalScore = 8;
  const liquidityScore = Math.min(10, (cash / (cash + totalInvested)) * 10 + 5);
  const cashUtilScore = cash > emergencyTarget * 1.5 ? 5 : Math.min(10, (cash / emergencyTarget) * 10);

  const components = [
    { name: 'Savings Rate', score: Math.round(savingsScore), maxScore: 15, status: savingsScore > 10 ? 'Good' : 'Needs Improvement' },
    { name: 'Emergency Fund', score: Math.round(emergencyScore), maxScore: 15, status: emergencyScore > 10 ? 'Good' : 'Below Target' },
    { name: 'Debt Management', score: debtScore, maxScore: 15, status: 'Good' },
    { name: 'Diversification', score: Math.round(diversificationScore), maxScore: 12, status: diversificationScore > 8 ? 'Good' : 'Limited' },
    { name: 'Portfolio Risk', score: riskScore, maxScore: 12, status: 'Moderate' },
    { name: 'Investment Consistency', score: Math.round(consistencyScore), maxScore: 13, status: consistencyScore > 9 ? 'Excellent' : 'Fair' },
    { name: 'Goal Progress', score: goalScore, maxScore: 10, status: 'On Track' },
    { name: 'Liquidity', score: Math.round(liquidityScore), maxScore: 10, status: liquidityScore > 7 ? 'Good' : 'Low' },
    { name: 'Cash Utilization', score: Math.round(cashUtilScore), maxScore: 10, status: cashUtilScore > 7 ? 'Good' : 'Excess Cash' },
  ];

  const score = components.reduce((sum, c) => sum + c.score, 0);

  const sorted = [...components].sort((a, b) => b.score / b.maxScore - a.score / a.maxScore);
  const biggestStrength = sorted[0].name === 'Investment Consistency'
    ? 'Your monthly investment consistency is strong.'
    : `Your ${sorted[0].name.toLowerCase()} is your strongest area.`;
  const biggestImprovement = sorted[sorted.length - 1].name === 'Emergency Fund'
    ? 'Your emergency fund is below your selected target.'
    : `Your ${sorted[sorted.length - 1].name.toLowerCase()} needs attention.`;

  return { score, components, biggestStrength, biggestImprovement };
}

export function getPortfolioDNA(
  stocks: StockHolding[],
  funds: MutualFundHolding[],
  cash: number,
  userProfile: UserProfile
): {
  riskLevel: number;
  diversification: number;
  growthOrientation: string;
  liquidity: number;
  concentration: string;
  consistency: string;
  mismatch: string | null;
} {
  const sectors = getSectorAllocation(stocks);
  const maxSectorPct = sectors.length > 0 ? sectors[0].percentage : 0;
  const diversification = Math.round(Math.min(100, (sectors.length / 8) * 100 - maxSectorPct * 0.5));
  const equityValue = getStockSummary(stocks).currentValue + getMutualFundSummary(funds).currentValue;
  const totalValue = equityValue + cash;
  const liquidity = Math.round(totalValue > 0 ? (cash / totalValue) * 100 : 0);
  const riskLevel = Math.round(
    Math.min(100, maxSectorPct * 2 + (equityValue / totalValue) * 50)
  );
  const concentration = maxSectorPct > 30 ? 'High' : maxSectorPct > 20 ? 'Moderate' : 'Low';
  const consistency = 'Excellent';
  const growthOrientation = riskLevel > 60 ? 'High' : riskLevel > 40 ? 'Moderate' : 'Low';

  const riskMap = { conservative: 30, moderate: 55, aggressive: 80 };
  const userRiskLevel = riskMap[userProfile.riskTolerance] || 55;
  let mismatch: string | null = null;
  if (riskLevel > userRiskLevel + 15) {
    mismatch = 'Your portfolio appears more aggressive than your selected risk preference.';
  } else if (riskLevel < userRiskLevel - 15) {
    mismatch = 'Your portfolio appears more conservative than your selected risk preference.';
  }

  return {
    riskLevel,
    diversification,
    growthOrientation,
    liquidity,
    concentration,
    consistency,
    mismatch,
  };
}

export function getPortfolioCleanup(
  stocks: StockHolding[],
  funds: MutualFundHolding[]
): {
  keep: { name: string; reason: string }[];
  review: { name: string; reason: string }[];
  monitor: { name: string; reason: string }[];
  research: { name: string; reason: string }[];
} {
  const keep: { name: string; reason: string }[] = [];
  const review: { name: string; reason: string }[] = [];
  const monitor: { name: string; reason: string }[] = [];
  const research: { name: string; reason: string }[] = [];

  const sectorAlloc = getSectorAllocation(stocks);
  const topSector = sectorAlloc[0];

  for (const s of stocks) {
    const gain = ((s.currentPrice - s.averageCost) / s.averageCost) * 100;
    if (s.sector === topSector?.sector && topSector.percentage > 25) {
      review.push({
        name: s.name,
        reason: `Part of your largest sector allocation (${topSector.sector} at ${Math.round(topSector.percentage)}%). Consider reducing concentration.`,
      });
    } else if (gain > 50) {
      monitor.push({
        name: s.name,
        reason: `Strong performer (+${Math.round(gain)}% gain). Monitor for profit-taking opportunities.`,
      });
    } else {
      keep.push({
        name: s.name,
        reason: 'Well-positioned holding with reasonable allocation.',
      });
    }
  }

  const duplicates = detectDuplicateFunds(funds);
  for (const f of funds) {
    const isDuplicate = duplicates.some(
      (d) => d.fund1 === f.name || d.fund2 === f.name
    );
    if (isDuplicate) {
      review.push({
        name: f.name,
        reason: 'Overlapping holdings with another fund. Consider consolidating to reduce redundancy.',
      });
    } else if (f.expenseRatio > 0.5) {
      research.push({
        name: f.name,
        reason: `Expense ratio of ${f.expenseRatio}% is above 0.5%. Research lower-cost alternatives.`,
      });
    } else {
      keep.push({
        name: f.name,
        reason: 'Low-cost, well-diversified fund that aligns with your portfolio.',
      });
    }
  }

  return { keep, review, monitor, research };
}

export function formatINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `${(amount / 100000).toFixed(2)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toFixed(0);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
