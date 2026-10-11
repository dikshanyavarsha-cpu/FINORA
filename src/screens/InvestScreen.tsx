import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Newspaper, Search, ChevronRight,
  Sparkles, Info, ExternalLink, AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatPercent, formatINR } from '@/utils/finance';

export function InvestScreen() {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState<'discover' | 'news' | 'research'>('discover');

  const tabs = [
    { id: 'discover' as const, label: 'Discover' },
    { id: 'news' as const, label: 'News' },
    { id: 'research' as const, label: 'AI Research' },
  ];

  const marketStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845, change: 2.3, sector: 'Energy', pe: 24.5, marketCap: '₹19.2L Cr' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3850, change: 1.8, sector: 'Technology', pe: 28.2, marketCap: '₹14.1L Cr' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680, change: -0.5, sector: 'Banking', pe: 19.8, marketCap: '₹12.8L Cr' },
    { symbol: 'INFY', name: 'Infosys', price: 1820, change: 1.2, sector: 'Technology', pe: 26.1, marketCap: '₹7.5L Cr' },
    { symbol: 'ITC', name: 'ITC Limited', price: 445, change: 0.8, sector: 'Consumer Goods', pe: 22.4, marketCap: '₹5.6L Cr' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1380, change: 3.1, sector: 'Telecom', pe: 31.5, marketCap: '₹7.8L Cr' },
  ];

  const marketFunds = [
    { name: 'Parag Parikh Flexi Cap', nav: 88.3, change: 1.2, category: 'Flexi Cap', expense: 0.62, rating: 5 },
    { name: 'Axis Bluechip Fund', nav: 56.8, change: 0.8, category: 'Large Cap', expense: 0.52, rating: 4 },
    { name: 'SBI Nifty Index Fund', nav: 168, change: 1.0, category: 'Index', expense: 0.18, rating: 4 },
    { name: 'Mirae Asset Large Cap', nav: 38.5, change: 0.6, category: 'Large Cap', expense: 0.58, rating: 4 },
  ];

  const aiOpportunities = [
    {
      title: 'Healthcare Sector',
      reason: 'Your portfolio has zero exposure to healthcare. Adding a healthcare fund or stock could improve diversification and reduce sector concentration risk.',
      fundamentals: 'Healthcare sector P/E ratio is currently around 22x, in line with historical averages. The sector has shown stable earnings growth.',
      risks: 'Healthcare is subject to regulatory changes, drug pricing pressures, and clinical trial outcomes.',
      valuation: 'Sector P/E of 22x is reasonable relative to the Nifty 50 P/E of 25x.',
      portfolioImpact: 'Adding 5-10% healthcare exposure would reduce your technology concentration from 38% to approximately 33%.',
      alternatives: 'Consider pharma funds, hospital chains, or a diversified healthcare ETF.',
      whatCouldGoWrong: 'Regulatory changes, patent expirations, or a global health crisis could impact the sector negatively.',
    },
    {
      title: 'Debt / Bonds',
      reason: 'Your portfolio is 100% equity. Adding debt exposure could reduce overall portfolio volatility and provide stability during market downturns.',
      fundamentals: '10-year government bond yield is currently 7.1%. Corporate bonds offer 8-9% yields.',
      risks: 'Interest rate risk — bond prices fall when rates rise. Credit risk for corporate bonds.',
      valuation: 'Current yields are attractive relative to historical levels.',
      portfolioImpact: 'A 10-15% debt allocation would lower your portfolio risk level from 72 to approximately 60.',
      alternatives: 'Consider short-duration debt funds, corporate bond funds, or government securities.',
      whatCouldGoWrong: 'Rising interest rates would reduce bond values. Inflation could erode real returns.',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in pb-4">
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

      {activeTab === 'discover' && (
        <>
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">Market Overview</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Demo market data — not real prices. In production, this would connect to a licensed market data provider.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Stocks</h3>
            <div className="space-y-2">
              {marketStocks.map((stock, i) => {
                const isInPortfolio = data.stocks.some(s => s.symbol === stock.symbol);
                return (
                  <Card key={i}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInPortfolio ? 'bg-accent-50 dark:bg-accent-500/10' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{stock.symbol}</p>
                            {isInPortfolio && <span className="px-1.5 py-0.5 rounded-md bg-accent-50 dark:bg-accent-500/10 text-[9px] font-medium text-accent-600 dark:text-accent-400">OWNED</span>}
                          </div>
                          <p className="text-xs text-slate-400">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{stock.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-1 justify-end">
                          {stock.change >= 0 ? <TrendingUp size={12} className="text-accent-500" /> : <TrendingDown size={12} className="text-error-500" />}
                          <span className={`text-xs font-medium ${stock.change >= 0 ? 'text-accent-500' : 'text-error-500'}`}>
                            {formatPercent(stock.change)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-3 flex gap-4">
                      <span className="text-[10px] text-slate-400">P/E: {stock.pe}</span>
                      <span className="text-[10px] text-slate-400">Mkt Cap: {stock.marketCap}</span>
                      <span className="text-[10px] text-slate-400">Sector: {stock.sector}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="px-5">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Mutual Funds</h3>
            <div className="space-y-2">
              {marketFunds.map((fund, i) => {
                const isInPortfolio = data.mutualFunds.some(f => f.name === fund.name);
                return (
                  <Card key={i}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInPortfolio ? 'bg-accent-50 dark:bg-accent-500/10' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{fund.category.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{fund.name}</p>
                            {isInPortfolio && <span className="px-1.5 py-0.5 rounded-md bg-accent-50 dark:bg-accent-500/10 text-[9px] font-medium text-accent-600 dark:text-accent-400">OWNED</span>}
                          </div>
                          <p className="text-xs text-slate-400">{fund.category} · Expense: {fund.expense}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{fund.nav}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <TrendingUp size={12} className="text-accent-500" />
                          <span className="text-xs font-medium text-accent-500">{formatPercent(fund.change)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="px-5">
            <Card className="border-dashed">
              <div className="p-4 flex items-start gap-2">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Market data shown is simulated for demo purposes. In production, FINORA would connect to licensed market data providers through an adapter interface. Prices are not live and should not be used for trading decisions.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'news' && (
        <>
          <div className="px-5">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Market News</h3>
            <div className="space-y-3">
              {data.news.map((news) => (
                <Card key={news.id}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Newspaper size={14} className="text-brand-500" />
                      <span className="text-[10px] text-slate-400">{news.source} · {news.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-[9px] font-medium text-slate-500 dark:text-slate-400">{news.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{news.headline}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{news.summary}</p>

                    <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-500/10">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={12} className="text-brand-600 dark:text-brand-400" />
                        <span className="text-[10px] font-semibold text-brand-700 dark:text-brand-300">What Does This Mean For Me?</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{news.impactSummary}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-slate-400">Relevant holdings:</span>
                        {news.relevantHoldings.map((h, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[9px] font-medium text-brand-600 dark:text-brand-400">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="px-5">
            <Card className="border-dashed">
              <div className="p-4 flex items-start gap-2">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  News analysis is based on your portfolio holdings. FINORA does not overstate causality — the connections shown are potential relationships, not guaranteed outcomes.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'research' && (
        <>
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">AI Opportunities</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Areas that may deserve research based on your portfolio, diversification, goals, and risk preference.
                </p>
                <p className="text-[10px] text-slate-400 mt-2">
                  Educational analysis — not investment advice. Always do your own research.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5 space-y-3">
            {aiOpportunities.map((opp, i) => (
              <Card key={i}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                      <TrendingUp size={16} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white">{opp.title}</h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Why It May Be Relevant</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.reason}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Key Fundamentals</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.fundamentals}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Risks</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.risks}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Valuation Considerations</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.valuation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Portfolio Impact</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.portfolioImpact}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Alternative Areas To Research</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.alternatives}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-error-50 dark:bg-error-500/10">
                      <p className="text-[10px] font-semibold text-error-600 dark:text-error-400 uppercase tracking-wide mb-1">What Could Make This Wrong</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{opp.whatCouldGoWrong}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-1">
                    <AlertCircle size={12} className="text-slate-400" />
                    <p className="text-[10px] text-slate-400">
                      This is educational analysis, not regulated investment advice. Never invest based solely on this information.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
