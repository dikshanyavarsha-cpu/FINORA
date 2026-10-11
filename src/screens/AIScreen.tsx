import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, TrendingUp, AlertTriangle, Info, ChevronRight,
  FlaskConical, Target, CheckCircle2, Clock, MessageSquare, Brain,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import {
  getPortfolioSummary, getSectorAllocation, getTotalCash,
  getSavingsRate, getInvestmentRate, detectMoneyLeaks,
  detectGoalConflicts, simulateInvestment, simulateDecision,
  getPortfolioDNA, formatCurrency, formatINR, formatPercent,
} from '@/utils/finance';
import type { AIConversation } from '@/types';

const suggestedPrompts = [
  'How am I doing financially?',
  'Why did my portfolio fall?',
  'Where am I overspending?',
  'Am I diversified?',
  'What is my biggest financial weakness?',
  'How much can I invest this month?',
  'How close am I to my goal?',
  'Explain XIRR.',
];

export function AIScreen() {
  const { data, userProfile, conversations, addConversation } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'lab' | 'simulator'>('chat');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Investment Lab state
  const [labAmount, setLabAmount] = useState(50000);
  const [labSector, setLabSector] = useState('Technology');

  // Decision Simulator state
  const [decisionAmount, setDecisionAmount] = useState(100000);
  const [decisionResult, setDecisionResult] = useState<ReturnType<typeof simulateDecision> | null>(null);

  const tabs = [
    { id: 'chat' as const, label: 'Finora AI', icon: MessageSquare },
    { id: 'lab' as const, label: 'Investment Lab', icon: FlaskConical },
    { id: 'simulator' as const, label: 'Decision Sim', icon: Target },
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversations, isTyping]);

  const generateResponse = (question: string): string => {
    const portfolio = getPortfolioSummary(data.stocks, data.mutualFunds);
    const cash = getTotalCash(data.bankAccounts, data.brokerAccounts);
    const sectors = getSectorAllocation(data.stocks);
    const savingsRate = getSavingsRate(userProfile.monthlyIncome, userProfile.monthlyExpenses);
    const investmentRate = getInvestmentRate(userProfile.monthlyIncome, userProfile.monthlyInvestment);
    const leaks = detectMoneyLeaks(data.bankAccounts, data.brokerAccounts, data.mutualFunds, userProfile, data.transactions);
    const goalConflicts = detectGoalConflicts(data.goals, 12);
    const dna = getPortfolioDNA(data.stocks, data.mutualFunds, cash, userProfile);
    const q = question.toLowerCase();

    if (q.includes('how am i') || q.includes('doing') || q.includes('financial')) {
      return `Here's your financial snapshot:\n\n• Net Worth: ${formatCurrency(cash + portfolio.totalCurrent)}\n• Portfolio Value: ${formatCurrency(portfolio.totalCurrent)}\n• Total Returns: ${formatCurrency(portfolio.totalGain)} (${formatPercent(portfolio.totalGainPercent)})\n• Savings Rate: ${savingsRate.toFixed(0)}%\n• Investment Rate: ${investmentRate.toFixed(0)}%\n\nYour biggest strength is your investment consistency — you're investing ${investmentRate.toFixed(0)}% of your income monthly. Your main area to watch is your emergency fund, which is below your 6-month expense target.\n\nNote: This is an analytical summary based on your connected demo data, not a financial rating.`;
    }
    if (q.includes('portfolio') && (q.includes('fall') || q.includes('drop') || q.includes('down'))) {
      return `Your portfolio is currently valued at ${formatCurrency(portfolio.totalCurrent)}, with an overall gain of ${formatCurrency(portfolio.totalGain)} (${formatPercent(portfolio.totalGainPercent)}).\n\nIf you're seeing a recent dip, here are the likely factors based on your holdings:\n\n• Your technology sector exposure is ${sectors[0]?.percentage.toFixed(0)}%, which makes your portfolio sensitive to IT sector movements.\n• Your largest stock holdings (TCS, Infosys, Wipro) are all in technology — if IT stocks declined, your portfolio would be affected more than a diversified one.\n\nConsider reviewing whether your sector concentration aligns with your risk tolerance.`;
    }
    if (q.includes('spend') || q.includes('overspend') || q.includes('expense')) {
      const latestExpenses = data.monthlyExpenses[data.monthlyExpenses.length - 1];
      const prevExpenses = data.monthlyExpenses[data.monthlyExpenses.length - 2];
      const foodChange = ((latestExpenses.categories.Food - prevExpenses.categories.Food) / prevExpenses.categories.Food) * 100;
      const travelChange = ((latestExpenses.categories.Travel - prevExpenses.categories.Travel) / prevExpenses.categories.Travel) * 100;
      return `Looking at your recent spending:\n\n• Total spending this month: ${formatCurrency(latestExpenses.total)}\n• Food: ${formatCurrency(latestExpenses.categories.Food)} (${foodChange > 0 ? '+' : ''}${foodChange.toFixed(0)}% vs last month)\n• Travel: ${formatCurrency(latestExpenses.categories.Travel)} (${travelChange > 0 ? '+' : ''}${travelChange.toFixed(0)}% vs last month)\n• Subscriptions: ${formatCurrency(latestExpenses.categories.Subscriptions)}\n\nYour travel and food spending increased compared to last month. Consider setting a monthly dining budget if this trend continues.`;
    }
    if (q.includes('diversif')) {
      return `Your portfolio diversification analysis:\n\n• Sectors represented: ${sectors.length}\n• Largest sector: ${sectors[0]?.sector} at ${sectors[0]?.percentage.toFixed(0)}%\n• Diversification score: ${dna.diversification}/100\n• Concentration: ${dna.concentration}\n\n${dna.mismatch ? `⚠️ ${dna.mismatch}\n\n` : ''}Your technology exposure is the highest at ${sectors.find(s => s.sector === 'Technology')?.percentage.toFixed(0)}%. Consider adding exposure to underrepresented sectors like Healthcare, Energy, or Consumer Goods to improve diversification.`;
    }
    if (q.includes('weakness') || q.includes('weak') || q.includes('improve')) {
      return `Based on your financial data, here are areas that could improve:\n\n1. Emergency Fund: Your cash balance of ${formatCurrency(cash)} covers about ${Math.round((cash / (userProfile.monthlyExpenses * 6)) * 100)}% of your 6-month target.\n\n2. Sector Concentration: ${sectors[0]?.sector} represents ${sectors[0]?.percentage.toFixed(0)}% of your equity portfolio.\n\n3. ${leaks.length > 0 ? `Money Leaks: ${leaks.length} potential inefficiencies detected, including ${leaks[0]?.title.toLowerCase()}.` : 'No major money leaks detected.'}\n\n4. ${goalConflicts.hasConflict ? 'Goal Funding: Some goals may need higher contributions.' : 'Goals are on track.'}\n\nFocus on building your emergency fund first, then consider rebalancing your sector exposure.`;
    }
    if (q.includes('invest this month') || q.includes('how much can i')) {
      const remaining = userProfile.monthlyIncome - userProfile.monthlyExpenses - userProfile.monthlyInvestment;
      return `Based on your cash flow:\n\n• Monthly Income: ${formatCurrency(userProfile.monthlyIncome)}\n• Monthly Expenses: ${formatCurrency(userProfile.monthlyExpenses)}\n• Current Investments (SIPs): ${formatCurrency(userProfile.monthlyInvestment)}\n• Remaining Cash: ${formatCurrency(remaining)}\n\nYou could potentially invest up to ${formatCurrency(remaining)} more this month while keeping some buffer. However, consider building your emergency fund first — your current cash balance is below your 6-month expense target.`;
    }
    if (q.includes('goal') || q.includes('close')) {
      const goal = data.goals[0];
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      return `Your ${goal.name} goal:\n\n• Target: ${formatCurrency(goal.targetAmount)}\n• Current: ${formatCurrency(goal.currentAmount)}\n• Progress: ${progress.toFixed(0)}%\n• Monthly Contribution: ${formatCurrency(goal.monthlyContribution)}\n• Target Date: ${new Date(goal.targetDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}\n\n${goalConflicts.hasConflict ? '⚠️ ' + goalConflicts.message : 'This goal is on track with your current contribution rate.'}`;
    }
    if (q.includes('xirr')) {
      return `XIRR (Extended Internal Rate of Return) is a way to calculate your annualized return when you invest money at different times.\n\nUnlike simple return percentages, XIRR accounts for:\n• The timing of each investment\n• The amount of each investment\n• The current value of your portfolio\n\nYour portfolio's estimated XIRR is approximately ${formatPercent(portfolio.totalGainPercent)} based on your investment history.\n\nThink of it as: "If I had put all my money in at once, what annual return would give me the same result?"\n\nNote: This is a simplified calculation. A precise XIRR requires exact cashflow dates.`;
    }
    if (q.includes('sip') && q.includes('increase')) {
      return `If you increase your SIP:\n\nCurrently you invest ${formatCurrency(userProfile.monthlyInvestment)} per month across ${data.sips.length} SIPs.\n\nIf you increase by ₹5,000/month to ${formatCurrency(userProfile.monthlyInvestment + 5000)}:\n• Over 10 years at 12% p.a., the extra ₹5,000/month alone could grow to approximately ${formatCurrency(5000 * 12 * 10 * 1.8)} (rough estimate).\n• Your savings rate would increase from ${savingsRate.toFixed(0)}% to ${((userProfile.monthlyIncome - userProfile.monthlyExpenses - userProfile.monthlyInvestment - 5000) / userProfile.monthlyIncome * 100).toFixed(0)}%.\n\nBefore increasing, make sure your emergency fund is fully funded.`;
    }
    if (q.includes('research') || q.includes('which') || q.includes('what should i')) {
      return `Based on your portfolio analysis, here are areas worth researching:\n\n1. Healthcare sector — currently underrepresented in your portfolio. Adding exposure could improve diversification.\n\n2. Consumer Goods — you have only one holding (ITC) in this sector.\n\n3. Index funds with lower expense ratios — some of your active funds charge above 0.5%.\n\n4. Debt instruments — your portfolio is heavily equity-oriented. Adding some debt exposure could reduce overall risk.\n\nRemember: This is educational analysis based on your current holdings, not investment advice. Always do your own research and consider consulting a licensed financial advisor.`;
    }
    return `I can help you understand your finances based on your connected data. Try asking about:\n\n• Your portfolio performance\n• Spending patterns\n• Diversification\n• Goal progress\n• How much you can invest\n• Financial weaknesses\n\nI use your actual financial data to provide analytical insights. I won't make up numbers or guarantee returns.`;
  };

  const handleSend = (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;
    const userMsg: AIConversation = {
      id: `conv-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    addConversation(userMsg);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(message);
      addConversation({
        id: `conv-${Date.now()}-ai`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
    }, 800);
  };

  const sectors = getSectorAllocation(data.stocks);
  const cash = getTotalCash(data.bankAccounts, data.brokerAccounts);
  const simulation = simulateInvestment(data.stocks, data.mutualFunds, cash, labAmount, labSector);

  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Finora AI</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                  Your AI financial co-pilot. Ask me anything about your money, portfolio, or goals.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-left p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {conversations.map((conv) => (
              <div key={conv.id} className={`flex ${conv.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl ${
                  conv.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 rounded-bl-md'
                }`}>
                  {conv.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} className="text-brand-500" />
                      <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">Finora AI</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{conv.content}</p>
                  {conv.role === 'assistant' && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-accent-500" /> Based on your data
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Brain size={10} /> Confidence: Moderate
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-bl-md p-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-brand-500" />
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-16 px-5 py-3 bg-white/80 dark:bg-slate-900/80 glass border-t border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your finances..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => handleSend()}
                className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white hover:bg-brand-700 transition-colors shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="space-y-4 pb-4">
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical size={18} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">AI Investment Lab</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Simulate a hypothetical investment and see how it would change your portfolio. This is a simulation only — no transaction is executed.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-4">Simulation Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">Investment Amount</label>
                      <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(labAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={labAmount}
                      onChange={(e) => setLabAmount(Number(e.target.value))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Target Sector</label>
                    <div className="flex flex-wrap gap-2">
                      {sectors.map((s) => (
                        <button
                          key={s.sector}
                          onClick={() => setLabSector(s.sector)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            labSector === s.sector
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {s.sector}
                        </button>
                      ))}
                      <button
                        onClick={() => setLabSector('Healthcare')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          labSector === 'Healthcare'
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        + Healthcare
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-2">BEFORE</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{labSector} Exposure</p>
                  <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                    {simulation.before.find(s => s.sector === labSector)?.percentage.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </Card>
              <Card className="border-brand-300 dark:border-brand-600">
                <div className="p-4">
                  <p className="text-xs text-brand-600 dark:text-brand-400 mb-2">AFTER</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{labSector} Exposure</p>
                  <p className="font-display font-bold text-2xl text-brand-600 dark:text-brand-400">
                    {simulation.after.find(s => s.sector === labSector)?.percentage.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Impact Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-brand-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Concentration Change</span>
                    </div>
                    <span className={`text-sm font-semibold ${simulation.concentrationChange > 0 ? 'text-warning-500' : 'text-accent-500'}`}>
                      {simulation.concentrationChange > 0 ? '+' : ''}{simulation.concentrationChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-warning-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Cash Impact</span>
                    </div>
                    <span className="text-sm font-semibold text-error-500">-{formatCurrency(simulation.cashImpact)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2">
                      <Info size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Risk Impact</span>
                    </div>
                    <span className="text-sm font-semibold text-warning-500">
                      {simulation.concentrationChange > 5 ? 'Increases concentration' : 'Minimal change'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-warning-50 dark:bg-warning-500/10">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {simulation.concentrationChange > 5
                      ? `This investment would increase your ${labSector} concentration by ${simulation.concentrationChange.toFixed(1)} percentage points. Consider whether this aligns with your diversification goals.`
                      : `This investment would have a minimal impact on your ${labSector} concentration. It appears reasonable within your current allocation.`}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-3">
                  Simulation only. FINORA does not execute trades. Not investment advice.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Allocation Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-2">Before</p>
                    <BarChart data={simulation.before.map(s => ({ label: s.sector.slice(0, 4), value: s.percentage, color: '#94a3b8' }))} height={120} formatValue={(v) => `${v.toFixed(0)}%`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-500 mb-2">After</p>
                    <BarChart data={simulation.after.map(s => ({ label: s.sector.slice(0, 4), value: s.percentage, color: s.sector === labSector ? '#1a76f0' : '#94a3b8' }))} height={120} formatValue={(v) => `${v.toFixed(0)}%`} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="space-y-4 pb-4">
          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-brand-200 dark:border-brand-500/20">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={18} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">Financial Decision Simulator</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ask "Can I afford it?" and get an analysis of the financial impact. No outcome is guaranteed.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-4">Quick Scenarios</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '₹1L Phone', amount: 100000 },
                    { label: '₹20L Car', amount: 2000000 },
                    { label: '₹10L Education', amount: 1000000 },
                    { label: '₹2L Travel', amount: 200000 },
                  ].map((scenario, i) => (
                    <button
                      key={i}
                      onClick={() => setDecisionAmount(scenario.amount)}
                      className={`p-3 rounded-2xl text-sm font-medium transition-all ${
                        decisionAmount === scenario.amount
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">Custom Amount</label>
                    <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(decisionAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="3000000"
                    step="10000"
                    value={decisionAmount}
                    onChange={(e) => setDecisionAmount(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                </div>
                <button
                  onClick={() => setDecisionResult(simulateDecision(decisionAmount, userProfile, cash, data.goals))}
                  className="w-full mt-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors"
                >
                  Analyze Impact
                </button>
              </div>
            </Card>
          </div>

          {decisionResult && (
            <div className="px-5 space-y-3 animate-slide-up">
              <Card className={decisionResult.canAfford ? 'border-accent-200 dark:border-accent-500/20' : 'border-error-200 dark:border-error-500/20'}>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${decisionResult.canAfford ? 'bg-accent-50 dark:bg-accent-500/10' : 'bg-error-50 dark:bg-error-500/10'}`}>
                      {decisionResult.canAfford ? <CheckCircle2 size={24} className="text-accent-500" /> : <AlertTriangle size={24} className="text-error-500" />}
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {decisionResult.canAfford ? 'You can afford this' : 'Consider carefully'}
                      </p>
                      <p className="text-xs text-slate-400">Risk level: {decisionResult.riskLevel}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Financial Impact</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{decisionResult.recommendation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cash Flow Impact</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        This expense represents {decisionResult.cashImpactPercent.toFixed(1)}% of your current cash balance. After this expense, you would have {formatCurrency(decisionResult.cashAfterExpense)} remaining.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Goal Impact</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{decisionResult.goalImpact}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                      <Info size={12} className="shrink-0 mt-0.5" />
                      This is an analytical simulation based on your current financial position. It does not guarantee any outcome. Consider your full financial situation before making major decisions.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
