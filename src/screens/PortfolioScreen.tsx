import { useState } from 'react';
import {
  TrendingUp, TrendingDown, ChevronRight, Sparkles, Dna,
  CheckCircle2, AlertTriangle, Eye, Search, Info, PieChart,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DonutChart, LineChart, BarChart } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import {
  getPortfolioSummary, aggregateHoldings, getSectorAllocation,
  getAssetAllocation, getMarketCapAllocation, getPortfolioDNA,
  getPortfolioCleanup, calculateXIRR, calculateCAGR,
  formatCurrency, formatINR, formatPercent,
} from '@/utils/finance';

export function PortfolioScreen() {
  const { data, userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'dna' | 'cleanup'>('overview');

  const portfolio = getPortfolioSummary(data.stocks, data.mutualFunds);
  const holdings = aggregateHoldings(data.stocks, data.mutualFunds);
  const sectors = getSectorAllocation(data.stocks);
  const cash = data.bankAccounts.reduce((s, b) => s + b.balance, 0) + data.brokerAccounts.reduce((s, b) => s + b.balance, 0);
  const assetAlloc = getAssetAllocation(data.stocks, data.mutualFunds, cash);
  const marketCap = getMarketCapAllocation(data.stocks);
  const dna = getPortfolioDNA(data.stocks, data.mutualFunds, cash, userProfile);
  const cleanup = getPortfolioCleanup(data.stocks, data.mutualFunds);
  const xirr = calculateXIRR([
    { date: '2024-01-01', amount: -500000 },
    { date: '2024-06-01', amount: -100000 },
    { date: '2025-01-01', amount: -100000 },
    { date: '2025-06-01', amount: -100000 },
    { date: '2026-01-01', amount: -100000 },
    { date: '2026-08-27', amount: portfolio.totalCurrent },
  ]);
  const cagr = calculateCAGR(820000, portfolio.totalCurrent, 1.75);

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'holdings' as const, label: 'Holdings' },
    { id: 'dna' as const, label: 'DNA' },
    { id: 'cleanup' as const, label: 'Cleanup' },
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
          {/* Portfolio Value */}
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0">
              <div className="p-5">
                <p className="text-xs text-white/70 font-medium mb-1">Total Portfolio Value</p>
                <p className="font-display font-bold text-3xl text-white">{formatCurrency(portfolio.totalCurrent)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    {portfolio.totalGain >= 0 ? <TrendingUp size={14} className="text-accent-300" /> : <TrendingDown size={14} className="text-red-300" />}
                    <span className="text-sm text-white/90 font-semibold">
                      {formatCurrency(portfolio.totalGain)} ({formatPercent(portfolio.totalGainPercent)})
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="px-5">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Invested', value: formatCurrency(portfolio.totalInvested) },
                { label: 'XIRR', value: `${xirr.toFixed(1)}%` },
                { label: 'CAGR', value: `${cagr.toFixed(1)}%` },
                { label: "Today's Move", value: `${formatPercent(portfolio.todayChangePercent)}`, positive: true },
                { label: 'Abs. Return', value: formatPercent(portfolio.totalGainPercent), positive: portfolio.totalGain >= 0 },
                { label: 'Total Holdings', value: `${holdings.length}` },
              ].map((m, i) => (
                <Card key={i}>
                  <div className="p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5">{m.label}</p>
                    <p className={`font-display font-semibold text-sm ${m.positive ? 'text-accent-500' : 'text-slate-900 dark:text-white'}`}>{m.value}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Performance History</h3>
                <LineChart data={data.portfolioHistory} showInvested formatValue={(v) => `₹${formatINR(v)}`} />
              </div>
            </Card>
          </div>

          {/* Asset Allocation */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Asset Allocation</h3>
                <div className="flex items-center gap-6">
                  <DonutChart
                    data={assetAlloc}
                    size={140}
                    thickness={22}
                    centerValue={`${Math.round(assetAlloc[0].percentage)}%`}
                    centerLabel="Equity"
                  />
                  <div className="flex-1 space-y-2">
                    {assetAlloc.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">{item.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sector Allocation */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Sector Allocation</h3>
                <div className="space-y-2">
                  {sectors.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{s.sector}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{s.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.percentage}%`,
                            backgroundColor: s.percentage > 30 ? '#ef4444' : s.percentage > 20 ? '#f59e0b' : '#1a76f0',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {sectors[0] && sectors[0].percentage > 30 && (
                  <div className="mt-3 p-3 rounded-2xl bg-warning-50 dark:bg-warning-500/10 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-warning-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">{sectors[0].sector}</span> represents {sectors[0].percentage.toFixed(1)}% of your equity portfolio, above the 30% concentration threshold.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Market Cap */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Market Cap Distribution</h3>
                <BarChart
                  data={marketCap.map((m) => ({ label: m.cap, value: m.percentage, color: m.cap === 'Large Cap' ? '#1a76f0' : m.cap === 'Mid Cap' ? '#10b981' : '#f59e0b' }))}
                  formatValue={(v) => `${v.toFixed(0)}%`}
                />
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'holdings' && (
        <>
          <div className="px-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">All Holdings ({holdings.length})</h3>
            <p className="text-xs text-slate-400 mb-3">Aggregated across all brokers and platforms</p>
            <div className="space-y-3">
              {holdings.map((h, i) => (
                <Card key={i}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{h.name}</p>
                          {h.type === 'mutualFund' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-accent-50 dark:bg-accent-500/10 text-[9px] font-medium text-accent-600 dark:text-accent-400">FUND</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {h.totalQuantity} units · Avg ₹{h.weightedAvgCost.toFixed(2)}
                          {h.sources.length > 1 && ` · ${h.sources.length} accounts`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(h.currentValue)}</p>
                        <p className={`text-xs font-medium ${h.gain >= 0 ? 'text-accent-500' : 'text-error-500'}`}>
                          {h.gain >= 0 ? '+' : ''}{formatCurrency(h.gain)} ({formatPercent(h.gainPercent)})
                        </p>
                      </div>
                    </div>
                    {h.sources.length > 1 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50">
                        <p className="text-[10px] text-slate-400 mb-1.5">Aggregated from:</p>
                        <div className="flex flex-wrap gap-2">
                          {h.sources.map((src, j) => (
                            <span key={j} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-[10px] text-slate-600 dark:text-slate-300">
                              {src.account}: {src.quantity} units @ ₹{src.cost.toFixed(2)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'dna' && (
        <>
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Dna size={18} className="text-white/80" />
                  <h3 className="font-display font-semibold text-white">Portfolio DNA</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  A unique analytical fingerprint of your portfolio's characteristics.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Risk Level', value: `${dna.riskLevel}`, max: 100, color: dna.riskLevel > 60 ? '#f59e0b' : '#10b981' },
                    { label: 'Diversification', value: `${dna.diversification}`, max: 100, color: '#10b981' },
                    { label: 'Growth Orientation', value: dna.growthOrientation, isText: true },
                    { label: 'Liquidity', value: `${dna.liquidity}`, max: 100, color: '#1a76f0' },
                    { label: 'Concentration', value: dna.concentration, isText: true },
                    { label: 'Consistency', value: dna.consistency, isText: true },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/10">
                      <p className="text-[10px] text-white/60 uppercase tracking-wide">{item.label}</p>
                      {item.isText ? (
                        <p className="font-display font-bold text-lg text-white mt-1">{item.value}</p>
                      ) : (
                        <>
                          <p className="font-display font-bold text-lg text-white mt-1">{item.value}<span className="text-sm text-white/50">/100</span></p>
                          <div className="w-full h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Risk Mismatch */}
          {dna.mismatch && (
            <div className="px-5">
              <Card className="border-warning-200 dark:border-warning-500/20 bg-warning-50 dark:bg-warning-500/10">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-warning-500" />
                    <span className="text-sm font-semibold text-warning-700 dark:text-warning-400">Portfolio vs. Risk Profile Mismatch</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{dna.mismatch}</p>
                  <div className="mt-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/40">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Your Stated Risk Profile:</span> {userProfile.riskTolerance}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-semibold">Portfolio Risk Level:</span> {dna.riskLevel}/100
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    This is an analytical observation, not a regulated suitability determination.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* How Calculated */}
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">How These Are Calculated</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Risk Level', desc: 'Based on sector concentration, equity-to-total ratio, and largest holding weight.' },
                    { name: 'Diversification', desc: 'Number of sectors represented, adjusted for concentration in any single sector.' },
                    { name: 'Growth Orientation', desc: 'Derived from the proportion of equity vs. debt and cash holdings.' },
                    { name: 'Liquidity', desc: 'Ratio of cash and easily redeemable holdings to total portfolio value.' },
                    { name: 'Concentration', desc: 'Percentage of portfolio in the single largest sector.' },
                    { name: 'Consistency', desc: 'Based on your SIP investment regularity and monthly contribution rate.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Info size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'cleanup' && (
        <>
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">AI Portfolio Cleanup</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Your portfolio analyzed for duplicates, overlaps, concentration, and alignment with your goals. Nothing is sold automatically — these are research suggestions.
                </p>
              </div>
            </Card>
          </div>

          {[
            { title: 'KEEP', icon: CheckCircle2, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-500/10', items: cleanup.keep },
            { title: 'REVIEW', icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-500/10', items: cleanup.review },
            { title: 'MONITOR', icon: Eye, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-500/10', items: cleanup.monitor },
            { title: 'RESEARCH', icon: Search, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-700/30', items: cleanup.research },
          ].map((section, i) => (
            <div key={i} className="px-5">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-xl ${section.bg} flex items-center justify-center`}>
                  <section.icon size={14} className={section.color} />
                </div>
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white">{section.title}</h4>
                <span className="text-xs text-slate-400">({section.items.length})</span>
              </div>
              <div className="space-y-2">
                {section.items.length === 0 ? (
                  <Card>
                    <div className="p-4">
                      <p className="text-xs text-slate-400">No items in this category.</p>
                    </div>
                  </Card>
                ) : (
                  section.items.map((item, j) => (
                    <Card key={j}>
                      <div className="p-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}

          <div className="px-5">
            <Card className="border-dashed">
              <div className="p-4 flex items-start gap-2">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  FINORA never automatically sells or buys. These are analytical suggestions for your own research. Always consult a licensed advisor for personalized investment decisions.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
