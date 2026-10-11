import { useState } from 'react';
import {
  GraduationCap, Home, PiggyBank, Target, Plus, AlertTriangle,
  TrendingUp, ChevronRight, Info, Calendar, Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LineChart, ProgressRing } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import {
  getGoalProgress, getGoalProjectionData, detectGoalConflicts,
  calculateSIPProjection, getRequiredMonthlyContribution,
  formatCurrency, formatINR,
} from '@/utils/finance';
import type { Goal } from '@/types';

const iconMap: Record<string, typeof GraduationCap> = {
  GraduationCap, Home, PiggyBank,
};

export function GoalsScreen() {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState<'goals' | 'conflicts' | 'sip'>('goals');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipYears, setSipYears] = useState(15);
  const [sipReturn, setSipReturn] = useState(12);

  const goalConflicts = detectGoalConflicts(data.goals, 12);
  const sipProjection = calculateSIPProjection(sipAmount, sipYears, sipReturn, 0);
  const sipComparison = [5000, 10000, 15000].map((amt) => {
    const proj = calculateSIPProjection(amt, sipYears, sipReturn, 0);
    return { amount: amt, finalValue: proj[proj.length - 1].value, totalInvested: proj[proj.length - 1].invested };
  });

  const tabs = [
    { id: 'goals' as const, label: 'My Goals' },
    { id: 'conflicts' as const, label: 'Conflicts' },
    { id: 'sip' as const, label: 'SIP Simulator' },
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

      {activeTab === 'goals' && (
        <>
          {selectedGoal ? (
            <GoalDetail goal={selectedGoal} onBack={() => setSelectedGoal(null)} />
          ) : (
            <>
              <div className="px-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Your Financial Goals</h2>
                  <button className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                    <Plus size={14} />
                    Add Goal
                  </button>
                </div>
                <div className="space-y-3">
                  {data.goals.map((goal) => {
                    const progress = getGoalProgress(goal);
                    const Icon = iconMap[goal.icon] || Target;
                    const projection = getGoalProjectionData(goal, 12);
                    const targetDate = new Date(goal.targetDate);
                    const yearsLeft = Math.max(0, (targetDate.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000));
                    const required = getRequiredMonthlyContribution(goal.currentAmount, goal.targetAmount, 12, yearsLeft);
                    return (
                      <Card key={goal.id} onClick={() => setSelectedGoal(goal)}>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                                <Icon size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{goal.name}</p>
                                <p className="text-xs text-slate-400">Target: {targetDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</p>
                              </div>
                            </div>
                            <ProgressRing progress={progress} size={56} thickness={6} color={progress > 60 ? '#10b981' : progress > 30 ? '#f59e0b' : '#ef4444'} />
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-xs text-slate-400">Current</p>
                              <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(goal.currentAmount)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-400">Monthly</p>
                              <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(goal.monthlyContribution)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Target</p>
                              <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(goal.targetAmount)}</p>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: progress > 60 ? '#10b981' : progress > 30 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-[10px] ${goal.monthlyContribution >= required * 0.9 ? 'text-accent-500' : 'text-warning-500'}`}>
                              {goal.monthlyContribution >= required * 0.9 ? 'On track' : `Need ₹${formatINR(required)}/mo`}
                            </span>
                            <span className="text-[10px] text-slate-400">{progress.toFixed(0)}% complete</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'conflicts' && (
        <>
          <div className="px-5">
            <Card className={goalConflicts.hasConflict ? 'border-warning-200 dark:border-warning-500/20 bg-warning-50 dark:bg-warning-500/10' : 'border-accent-200 dark:border-accent-500/20 bg-accent-50 dark:bg-accent-500/10'}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className={goalConflicts.hasConflict ? 'text-warning-500' : 'text-accent-500'} />
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">Goal Conflict Detector</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{goalConflicts.message}</p>
                <p className="text-[10px] text-slate-400 mt-2">
                  Based on 12% assumed annual return. Actual returns may vary.
                </p>
              </div>
            </Card>
          </div>

          <div className="px-5 space-y-3">
            {goalConflicts.goals.map((g, i) => (
              <Card key={i}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{g.name}</p>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${g.onTrack ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400'}`}>
                      {g.onTrack ? 'On Track' : 'Behind'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                      <p className="text-[10px] text-slate-400">Current Contribution</p>
                      <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(g.currentContribution)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                      <p className="text-[10px] text-slate-400">Required Contribution</p>
                      <p className={`font-display font-semibold text-sm ${g.currentContribution >= g.requiredContribution ? 'text-accent-500' : 'text-warning-500'}`}>
                        {formatCurrency(g.requiredContribution)}
                      </p>
                    </div>
                  </div>
                  {!g.onTrack && (
                    <div className="mt-3 p-3 rounded-xl bg-warning-50 dark:bg-warning-500/10 flex items-start gap-2">
                      <Info size={12} className="text-warning-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Increase your monthly contribution by {formatCurrency(g.requiredContribution - g.currentContribution)} to stay on track.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Possible Trade-offs</h4>
                <div className="space-y-2">
                  {[
                    'Extend target dates by 1–2 years for goals that are behind.',
                    'Increase monthly contributions as income grows.',
                    'Prioritize high-priority goals and delay lower-priority ones.',
                    'Consider higher-return investments (with higher risk) for long-term goals.',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-brand-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-300">{tip}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">
                  These are not guaranteed predictions. Actual outcomes depend on market performance and your consistency.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'sip' && (
        <>
          <div className="px-5">
            <Card>
              <div className="p-5">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">SIP Simulator</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">Monthly SIP</label>
                      <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(sipAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="1000"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">Duration</label>
                      <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{sipYears} years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">Expected Return</label>
                      <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{sipReturn}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      value={sipReturn}
                      onChange={(e) => setSipReturn(Number(e.target.value))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0">
              <div className="p-5">
                <p className="text-xs text-white/70">Projected Value after {sipYears} years</p>
                <p className="font-display font-bold text-3xl text-white mt-1">
                  {formatCurrency(sipProjection[sipProjection.length - 1].value)}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-[10px] text-white/60">Total Invested</p>
                    <p className="font-display font-semibold text-sm text-white/90">{formatCurrency(sipProjection[sipProjection.length - 1].invested)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60">Wealth Gained</p>
                    <p className="font-display font-semibold text-sm text-accent-300">
                      {formatCurrency(sipProjection[sipProjection.length - 1].value - sipProjection[sipProjection.length - 1].invested)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Growth Over Time</h4>
                <LineChart
                  data={sipProjection.map((p) => ({ label: `Y${p.year}`, value: p.value, invested: p.invested }))}
                  showInvested
                  formatValue={(v) => `₹${formatINR(v)}`}
                />
              </div>
            </Card>
          </div>

          <div className="px-5">
            <Card>
              <div className="p-5">
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Compare SIP Amounts</h4>
                <div className="space-y-3">
                  {sipComparison.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-brand-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{formatCurrency(c.amount)}/month</span>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-sm text-slate-900 dark:text-white">{formatCurrency(c.finalValue)}</p>
                        <p className="text-[10px] text-slate-400">Invested: {formatCurrency(c.totalInvested)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">
                  Based on {sipReturn}% assumed annual return over {sipYears} years. Actual returns are not guaranteed.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function GoalDetail({ goal, onBack }: { goal: Goal; onBack: () => void }) {
  const progress = getGoalProgress(goal);
  const projection = getGoalProjectionData(goal, 12);
  const Icon = iconMap[goal.icon] || Target;
  const targetDate = new Date(goal.targetDate);
  const yearsLeft = Math.max(0, (targetDate.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000));
  const required = getRequiredMonthlyContribution(goal.currentAmount, goal.targetAmount, 12, yearsLeft);

  return (
    <div className="animate-fade-in">
      <div className="px-5">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 mb-3">
          <ChevronRight size={16} className="rotate-180" />
          Back to Goals
        </button>
      </div>
      <div className="px-5">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">{goal.name}</h2>
                <p className="text-xs text-white/60">Target: {targetDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing progress={progress} size={80} thickness={8} color="#ffffff" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-white/60">Current</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(goal.currentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/60">Target</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/60">Monthly</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(goal.monthlyContribution)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-5 mt-4">
        <Card>
          <div className="p-5">
            <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white mb-3">Projected Growth</h4>
            <LineChart
              data={projection.map((p) => ({ label: `Y${p.year}`, value: p.value, invested: p.target }))}
              showInvested
              formatValue={(v) => `₹${formatINR(v)}`}
            />
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-brand-500" />
                <span className="text-[10px] text-slate-400">Projected Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span className="text-[10px] text-slate-400">Target Path</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-1">Required Monthly</p>
              <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(required)}</p>
              <p className="text-[10px] text-slate-400 mt-1">at 12% p.a.</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-1">Years to Target</p>
              <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{yearsLeft.toFixed(1)}</p>
              <p className="text-[10px] text-slate-400 mt-1">years remaining</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="px-5 mt-4">
        <Card className={goal.monthlyContribution >= required * 0.9 ? 'border-accent-200 dark:border-accent-500/20 bg-accent-50 dark:bg-accent-500/10' : 'border-warning-200 dark:border-warning-500/20 bg-warning-50 dark:bg-warning-500/10'}>
          <div className="p-4 flex items-start gap-2">
            <TrendingUp size={16} className={goal.monthlyContribution >= required * 0.9 ? 'text-accent-500' : 'text-warning-500'} />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {goal.monthlyContribution >= required * 0.9 ? 'You are on track!' : 'Behind target'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {goal.monthlyContribution >= required * 0.9
                  ? `At your current contribution rate, you should reach your ${goal.name} goal on schedule.`
                  : `Increase your monthly contribution by ${formatCurrency(Math.max(0, required - goal.monthlyContribution))} to stay on track.`}
              </p>
              <p className="text-[10px] text-slate-400 mt-2">
                Assumption: 12% annual return. Not a guaranteed prediction.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
