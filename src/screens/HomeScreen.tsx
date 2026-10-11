import { useState } from 'react';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ChevronRight,
  Sparkles, ArrowUpRight, ArrowDownRight, Info, ShieldCheck, Activity,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { DonutChart, LineChart, ProgressRing } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import {
  getNetWorth, getPortfolioSummary, calculateFinancialHealthScore,
  formatCurrency, formatINR, formatPercent, getTotalCash,
  getStockSummary, getMutualFundSummary,
} from '@/utils/finance';
import type { TabId } from '@/components/BottomNav';

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { data, userProfile } = useApp();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const netWorth = getNetWorth(data.bankAccounts, data.brokerAccounts, data.stocks, data.mutualFunds);
  const portfolio = getPortfolioSummary(data.stocks, data.mutualFunds);
  const healthScore = calculateFinancialHealthScore(userProfile, data.bankAccounts, data.brokerAccounts, data.stocks, data.mutualFunds);
  const cash = getTotalCash(data.bankAccounts, data.brokerAccounts);
  const stockSummary = getStockSummary(data.stocks);
  const fundSummary = getMutualFundSummary(data.mutualFunds);

  const priorities = [
    {
      id: 'p1',
      level: 'high' as const,
      title: 'Your equity exposure has become concentrated in one sector',
      why: 'Technology stocks now make up 38% of your equity portfolio, well above the 25% concentration threshold. This increases risk if the sector underperforms.',
      action: 'Consider rebalancing by reducing technology exposure or adding holdings in underrepresented sectors like Healthcare or Energy.',
    },
    {
      id: 'p2',
      level: 'review' as const,
      title: 'Your emergency fund is below your target',
      why: `Your current cash balance is ₹${formatINR(cash)}, which covers approximately ${Math.round((cash / (userProfile.monthlyExpenses * 6)) * 100)}% of your 6-month emergency fund target of ₹${formatINR(userProfile.monthlyExpenses * 6)}.`,
      action: 'Consider building your emergency fund to cover 6 months of expenses before increasing investment contributions.',
    },
    {
      id: 'p3',
      level: 'good' as const,
      title: 'Your monthly investment contributions are on track',
      why: `You invest ₹${formatINR(userProfile.monthlyInvestment)} per month, which is ${Math.round((userProfile.monthlyInvestment / userProfile.monthlyIncome) * 100)}% of your income. This is a healthy investment rate.`,
      action: 'Continue your SIPs consistently. Consider increasing your investment amount as your income grows.',
    },
  ];

  const levelConfig = {
    high: { icon: AlertCircle, color: 'text-error-500', bg: 'bg-error-50 dark:bg-error-500/10', border: 'border-error-200 dark:border-error-500/20', label: 'High Priority', dot: 'bg-error-500' },
    review: { icon: Info, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-500/10', border: 'border-warning-200 dark:border-warning-500/20', label: 'Review', dot: 'bg-warning-500' },
    good: { icon: CheckCircle2, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-500/10', border: 'border-accent-200 dark:border-accent-500/20', label: 'Good', dot: 'bg-accent-500' },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Demo Banner */}
      <div className="mx-5 mt-4 px-4 py-2.5 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 flex items-center gap-2">
        <ShieldCheck size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
        <p className="text-xs text-brand-700 dark:text-brand-300 font-medium">
          DEMO DATA — NOT REAL FINANCIAL INFORMATION
        </p>
      </div>

      {/* Financial Brief */}
      <div className="px-5">
        <Card className="overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 border-0">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-white/80" />
              <span className="text-xs text-white/70 font-medium">Your Financial Brief</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">Overall Health</p>
                <p className="font-display font-bold text-4xl text-white">{healthScore.score}<span className="text-xl text-white/50">/100</span></p>
              </div>
              <ProgressRing progress={healthScore.score} size={72} thickness={7} color="#ffffff" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              Your investments are performing positively, but your portfolio has become more concentrated than your selected preference.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-white/60 font-semibold uppercase tracking-wide">3 Things To Know</p>
              <div className="space-y-1.5">
                {[
                  'Portfolio concentration increased in technology sector.',
                  'Monthly savings rate improved to 48%.',
                  'MBA goal is on track at 32% completion.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-white/50 text-xs mt-0.5">{i + 1}.</span>
                    <p className="text-white/90 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-white/15">
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-1">1 Thing To Consider</p>
                <p className="text-white/90 text-sm">Review your equity allocation — technology exposure is above 35%.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Net Worth */}
      <div className="px-5">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Net Worth</p>
                <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(netWorth.total)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-accent-500">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">{formatPercent(2.4)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">vs last month</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <DonutChart
                data={netWorth.breakdown.map((b, i) => ({
                  label: b.label,
                  value: b.value,
                  percentage: b.percentage,
                  color: ['#1a76f0', '#10b981', '#f59e0b'][i],
                }))}
                size={140}
                thickness={22}
                centerValue={formatINR(netWorth.total)}
                centerLabel="Total"
              />
              <div className="flex-1 space-y-3">
                {netWorth.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#1a76f0', '#10b981', '#f59e0b'][i] }} />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</p>
                      <p className="text-[10px] text-slate-400">{item.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={14} className="text-brand-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Stocks</span>
              </div>
              <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(stockSummary.currentValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-semibold ${stockSummary.totalGain >= 0 ? 'text-accent-500' : 'text-error-500'}`}>
                  {formatPercent(stockSummary.totalGainPercent)}
                </span>
                <span className="text-[10px] text-slate-400">all-time</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity size={14} className="text-accent-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mutual Funds</span>
              </div>
              <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(fundSummary.currentValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-semibold ${fundSummary.totalGain >= 0 ? 'text-accent-500' : 'text-error-500'}`}>
                  {formatPercent(fundSummary.totalGainPercent)}
                </span>
                <span className="text-[10px] text-slate-400">all-time</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="px-5">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white">Portfolio Performance</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 12 months</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(portfolio.totalCurrent)}</p>
                <div className="flex items-center gap-1 justify-end">
                  {portfolio.totalGain >= 0 ? <TrendingUp size={12} className="text-accent-500" /> : <TrendingDown size={12} className="text-error-500" />}
                  <span className={`text-xs font-semibold ${portfolio.totalGain >= 0 ? 'text-accent-500' : 'text-error-500'}`}>
                    {formatCurrency(portfolio.totalGain)} ({formatPercent(portfolio.totalGainPercent)})
                  </span>
                </div>
              </div>
            </div>
            <LineChart
              data={data.portfolioHistory}
              showInvested
              formatValue={(v) => `₹${formatINR(v)}`}
            />
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-brand-500" />
                <span className="text-[10px] text-slate-400">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span className="text-[10px] text-slate-400">Invested</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Your Priorities */}
      <div className="px-5">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">Your Priorities</h2>
        <div className="space-y-3">
          {priorities.map((p) => {
            const cfg = levelConfig[p.level];
            const Icon = cfg.icon;
            const isExpanded = expandedInsight === p.id;
            return (
              <Card key={p.id} className={`border ${cfg.border}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.title}</p>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-3 animate-slide-up">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Why this matters</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{p.why}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">What you can consider</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{p.action}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Info size={12} />
                        <span>Based on your portfolio data as of Aug 27, 2026</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedInsight(isExpanded ? null : p.id)}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 mt-3"
                  >
                    {isExpanded ? 'Hide Analysis' : 'View Analysis'}
                    <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Financial Health Score Breakdown */}
      <div className="px-5">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">Financial Health</h3>
              <button onClick={() => onNavigate('ai')} className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                Ask AI
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <ProgressRing progress={healthScore.score} size={90} thickness={9} color={healthScore.score > 70 ? '#10b981' : healthScore.score > 50 ? '#f59e0b' : '#ef4444'} />
              <div className="flex-1 space-y-1.5">
                {healthScore.components.slice(0, 5).map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(c.score / c.maxScore) * 100}%`,
                            backgroundColor: c.score / c.maxScore > 0.7 ? '#10b981' : c.score / c.maxScore > 0.4 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 w-8 text-right">{c.score}/{c.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <div className="p-3 rounded-2xl bg-accent-50 dark:bg-accent-500/10">
                <p className="text-[10px] font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wide mb-1">Biggest Strength</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{healthScore.biggestStrength}</p>
              </div>
              <div className="p-3 rounded-2xl bg-warning-50 dark:bg-warning-500/10">
                <p className="text-[10px] font-semibold text-warning-600 dark:text-warning-400 uppercase tracking-wide mb-1">Biggest Improvement</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{healthScore.biggestImprovement}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">
              Analytical score generated by FINORA. Not an official financial rating.
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-4">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Decision Simulator', tab: 'ai' as TabId, desc: 'Can I afford it?', icon: '🎯' },
            { label: 'Investment Lab', tab: 'invest' as TabId, desc: 'What if I invest?', icon: '🧪' },
            { label: 'Money Leaks', tab: 'money' as TabId, desc: 'Find hidden waste', icon: '🔍' },
            { label: 'Portfolio DNA', tab: 'portfolio' as TabId, desc: 'Analyze your mix', icon: '🧬' },
          ].map((action, i) => (
            <Card key={i} onClick={() => onNavigate(action.tab)}>
              <div className="p-4">
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{action.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
