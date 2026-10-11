import { useState } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Search, AlertTriangle, Building2, CreditCard, ChevronRight, Info,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { BarChart, DonutChart } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import {
  getTotalCash, getMonthlyCashFlow, getSavingsRate, getInvestmentRate,
  getExpenseCategories, detectMoneyLeaks, formatCurrency, formatINR, formatPercent,
} from '@/utils/finance';

export function MoneyScreen() {
  const { data, userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'leaks' | 'accounts'>('overview');
  const [expandedLeak, setExpandedLeak] = useState<string | null>(null);

  const cash = getTotalCash(data.bankAccounts, data.brokerAccounts);
  const cashFlow = getMonthlyCashFlow(userProfile.monthlyIncome, userProfile.monthlyExpenses, userProfile.monthlyInvestment);
  const savingsRate = getSavingsRate(userProfile.monthlyIncome, userProfile.monthlyExpenses);
  const investmentRate = getInvestmentRate(userProfile.monthlyIncome, userProfile.monthlyInvestment);
  const expenseCategories = getExpenseCategories(data.monthlyExpenses);
  const moneyLeaks = detectMoneyLeaks(data.bankAccounts, data.brokerAccounts, data.mutualFunds, userProfile, data.transactions);

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'expenses' as const, label: 'Expenses' },
    { id: 'leaks' as const, label: 'Money Leaks' },
    { id: 'accounts' as const, label: 'Accounts' },
  ];

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Tab Switcher */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Cash Overview */}
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={16} className="text-white/80" />
                  <span className="text-xs text-white/70 font-medium">Total Cash</span>
                </div>
                <p className="font-display font-bold text-3xl text-white">{formatCurrency(cash)}</p>
                <p className="text-xs text-white/60 mt-1">Across {data.bankAccounts.length + data.brokerAccounts.length} accounts</p>
              </div>
            </Card>
          </div>

          {/* Cash Flow */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Monthly Cash Flow</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-accent-50 dark:bg-accent-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center">
                        <ArrowDownRight size={16} className="text-accent-600 dark:text-accent-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Income</span>
                    </div>
                    <span className="font-display font-semibold text-slate-900 dark:text-white">{formatCurrency(cashFlow.income)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-error-50 dark:bg-error-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-error-100 dark:bg-error-500/20 flex items-center justify-center">
                        <ArrowUpRight size={16} className="text-error-600 dark:text-error-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Expenses</span>
                    </div>
                    <span className="font-display font-semibold text-slate-900 dark:text-white">{formatCurrency(cashFlow.expenses)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-50 dark:bg-brand-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                        <TrendingUp size={16} className="text-brand-600 dark:text-brand-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Investments</span>
                    </div>
                    <span className="font-display font-semibold text-slate-900 dark:text-white">{formatCurrency(cashFlow.investment)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Remaining Cash</span>
                    <span className="font-display font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(cashFlow.remaining)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Rates */}
          <div className="px-5">
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <div className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Savings Rate</p>
                  <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">{savingsRate.toFixed(0)}%</p>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div className="h-full bg-accent-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, savingsRate)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{formatCurrency(userProfile.monthlyIncome - userProfile.monthlyExpenses)} saved monthly</p>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Investment Rate</p>
                  <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">{investmentRate.toFixed(0)}%</p>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, investmentRate)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{formatCurrency(userProfile.monthlyInvestment)} invested monthly</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Monthly Spending</h3>
                <BarChart
                  data={data.monthlyExpenses.map((m) => ({
                    label: m.month.split(' ')[0],
                    value: m.total,
                    color: '#1a76f0',
                  }))}
                  formatValue={(v) => `₹${formatINR(v)}`}
                />
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'expenses' && (
        <>
          {/* Where Did My Money Go */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">Where Did My Money Go?</h3>
                <p className="text-xs text-slate-400 mb-4">August 2026 spending breakdown</p>
                <div className="flex items-center gap-6">
                  <DonutChart
                    data={expenseCategories.map((c) => ({
                      label: c.name,
                      value: c.amount,
                      percentage: c.percentage,
                      color: c.color,
                    }))}
                    size={150}
                    thickness={24}
                    centerValue={formatINR(data.monthlyExpenses[data.monthlyExpenses.length - 1].total)}
                    centerLabel="Total"
                  />
                  <div className="flex-1 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {expenseCategories.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(cat.amount)}</span>
                          <span className={`text-[10px] ml-1.5 ${cat.change > 0 ? 'text-error-500' : 'text-accent-500'}`}>
                            {cat.change > 0 ? '↑' : '↓'} {Math.abs(cat.change).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Details */}
          <div className="px-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Category Breakdown</h3>
            <div className="space-y-2">
              {expenseCategories.map((cat, i) => (
                <Card key={i}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{cat.name}</p>
                        <p className="text-xs text-slate-400">{cat.percentage.toFixed(1)}% of spending</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(cat.amount)}</p>
                      <p className={`text-[10px] ${cat.change > 0 ? 'text-error-500' : 'text-accent-500'}`}>
                        {cat.change > 0 ? '↑' : '↓'} {Math.abs(cat.change).toFixed(0)}% vs last month
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={14} className="text-brand-600 dark:text-brand-400" />
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">AI Expense Insight</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Your travel spending increased by 22% compared to last month, primarily from a trip booking. Food expenses also rose 14%, driven by more dining out. Consider setting a monthly dining budget to keep this category in check.
                </p>
                <p className="text-[10px] text-slate-400 mt-2">Based on your transaction history from Jun–Aug 2026</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'leaks' && (
        <>
          <div className="px-5">
            <Card className="bg-gradient-to-br from-error-500/10 to-warning-500/10 border-error-200 dark:border-error-500/20">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={18} className="text-error-500" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">Money Leak Detector</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  AI-powered analysis of your financial data to find potential inefficiencies. These are observations, not guaranteed savings.
                </p>
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-slate-800/40">
                  <Info size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {moneyLeaks.length} potential {moneyLeaks.length === 1 ? 'issue' : 'issues'} detected
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5 space-y-3">
            {moneyLeaks.map((leak, i) => {
              const isExpanded = expandedLeak === `leak-${i}`;
              const severityConfig = {
                high: { bg: 'bg-error-50 dark:bg-error-500/10', border: 'border-error-200 dark:border-error-500/20', text: 'text-error-600 dark:text-error-400', dot: 'bg-error-500' },
                medium: { bg: 'bg-warning-50 dark:bg-warning-500/10', border: 'border-warning-200 dark:border-warning-500/20', text: 'text-warning-600 dark:text-warning-400', dot: 'bg-warning-500' },
                low: { bg: 'bg-slate-50 dark:bg-slate-700/30', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
              };
              const cfg = severityConfig[leak.severity];
              return (
                <Card key={i} className={`border ${cfg.border}`}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <AlertTriangle size={16} className={cfg.text} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.text}`}>{leak.severity} priority</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{leak.title}</p>
                        {isExpanded && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 animate-slide-up">{leak.description}</p>
                        )}
                        <button
                          onClick={() => setExpandedLeak(isExpanded ? null : `leak-${i}`)}
                          className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 mt-2"
                        >
                          {isExpanded ? 'Hide' : 'View Details'}
                          <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'accounts' && (
        <>
          <div className="px-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Bank Accounts</h3>
            <div className="space-y-3">
              {data.bankAccounts.map((acc) => (
                <Card key={acc.id}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{acc.bankName}</p>
                        <p className="text-xs text-slate-400">{acc.name} · {acc.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-semibold text-slate-900 dark:text-white">{formatCurrency(acc.balance)}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{acc.accountType}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="px-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Broker Accounts</h3>
            <div className="space-y-3">
              {data.brokerAccounts.map((acc) => (
                <Card key={acc.id}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                        <CreditCard size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{acc.brokerName}</p>
                        <p className="text-xs text-slate-400">{acc.name} · {acc.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-semibold text-slate-900 dark:text-white">{formatCurrency(acc.balance)}</p>
                      <p className="text-[10px] text-slate-400">Cash balance</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="px-5">
            <Card className="border-dashed">
              <div className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                  <TrendingDown size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Unused account detected</p>
                  <p className="text-xs text-slate-400">Your Groww Demat account has had low activity for 2 months.</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
