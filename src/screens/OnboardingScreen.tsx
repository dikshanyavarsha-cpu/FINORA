import { useState } from 'react';
import {
  Sparkles, ChevronRight, ShieldCheck, TrendingUp, Wallet,
  Building2, PiggyBank, Target, GraduationCap, Home, Plane,
  Car, Briefcase, Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

const goalOptions = [
  { id: 'emergency', label: 'Emergency Fund', icon: ShieldCheck },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'mba', label: 'MBA', icon: Briefcase },
  { id: 'car', label: 'Car', icon: Car },
  { id: 'house', label: 'House', icon: Home },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'retirement', label: 'Retirement', icon: PiggyBank },
  { id: 'wealth', label: 'Wealth Creation', icon: TrendingUp },
  { id: 'custom', label: 'Custom Goal', icon: Target },
];

const accountTypes = [
  { icon: Building2, label: 'Bank Accounts', color: 'from-brand-500 to-brand-700' },
  { icon: TrendingUp, label: 'Stocks', color: 'from-accent-500 to-accent-700' },
  { icon: Wallet, label: 'Mutual Funds', color: 'from-warning-500 to-warning-600' },
  { icon: Briefcase, label: 'Broker Accounts', color: 'from-slate-500 to-slate-700' },
];

export function OnboardingScreen() {
  const { setOnboarded, setUserProfile } = useApp();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleComplete = async () => {
    const finalProfile: UserProfile = {
      age: profile.age || 28,
      monthlyIncome: profile.monthlyIncome || 120000,
      monthlyExpenses: profile.monthlyExpenses || 62000,
      monthlyInvestment: profile.monthlyInvestment || 28000,
      currentSavings: profile.currentSavings || 245000,
      existingInvestments: profile.existingInvestments || 1000000,
      investmentExperience: profile.investmentExperience || 'intermediate',
      investmentHorizon: profile.investmentHorizon || 15,
      riskTolerance: profile.riskTolerance || 'moderate',
      goals: selectedGoals.length > 0 ? selectedGoals : ['MBA', 'House', 'Retirement'],
    };
    setUserProfile(finalProfile);
    setOnboarded(true);

    if (user) {
      await supabase.from('user_profiles').upsert({
        id: user.id,
        age: finalProfile.age,
        monthly_income: finalProfile.monthlyIncome,
        monthly_expenses: finalProfile.monthlyExpenses,
        monthly_investment: finalProfile.monthlyInvestment,
        current_savings: finalProfile.currentSavings,
        existing_investments: finalProfile.existingInvestments,
        investment_experience: finalProfile.investmentExperience,
        investment_horizon: finalProfile.investmentHorizon,
        risk_tolerance: finalProfile.riskTolerance,
        has_onboarded: true,
        updated_at: new Date().toISOString(),
      });
    }
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-8 shadow-2xl shadow-brand-500/30">
          <span className="font-display font-bold text-white text-3xl">F</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-white text-center leading-tight mb-3">
          Your entire financial life.<br />One intelligent view.
        </h1>
        <p className="text-slate-400 text-center text-sm max-w-xs mb-10">
          Connect your financial accounts, understand your money and make smarter financial decisions.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors border border-white/10"
          >
            Explore Demo
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-8 text-center max-w-xs">
          FINORA operates in demo mode with synthetic data. No real financial accounts are connected.
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-fade-in">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">F</span>
            </div>
            <span className="font-display font-semibold text-slate-900 dark:text-white">FINORA</span>
          </div>
          <div className="flex gap-1.5 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">Financial Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Tell us about yourself. Fields marked optional can be skipped.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Age</label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  placeholder="28"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Monthly Income (₹)</label>
                <input
                  type="number"
                  value={profile.monthlyIncome || ''}
                  onChange={(e) => setProfile({ ...profile, monthlyIncome: Number(e.target.value) })}
                  placeholder="1,20,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={profile.monthlyExpenses || ''}
                  onChange={(e) => setProfile({ ...profile, monthlyExpenses: Number(e.target.value) })}
                  placeholder="62,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={profile.monthlyInvestment || ''}
                  onChange={(e) => setProfile({ ...profile, monthlyInvestment: Number(e.target.value) })}
                  placeholder="28,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Current Savings (₹) <span className="text-slate-400">optional</span></label>
                <input
                  type="number"
                  value={profile.currentSavings || ''}
                  onChange={(e) => setProfile({ ...profile, currentSavings: Number(e.target.value) })}
                  placeholder="2,45,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Existing Investments (₹) <span className="text-slate-400">optional</span></label>
                <input
                  type="number"
                  value={profile.existingInvestments || ''}
                  onChange={(e) => setProfile({ ...profile, existingInvestments: Number(e.target.value) })}
                  placeholder="10,00,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Investment Experience</label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setProfile({ ...profile, investmentExperience: exp })}
                    className={`py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                      profile.investmentExperience === exp
                        ? 'bg-brand-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Risk Tolerance</label>
              <div className="grid grid-cols-3 gap-2">
                {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setProfile({ ...profile, riskTolerance: risk })}
                    className={`py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                      profile.riskTolerance === risk
                        ? 'bg-brand-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Investment Horizon (years)</label>
              <input
                type="number"
                value={profile.investmentHorizon || ''}
                onChange={(e) => setProfile({ ...profile, investmentHorizon: Number(e.target.value) })}
                placeholder="15"
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 p-5 bg-white/80 dark:bg-slate-900/80 glass border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 font-medium text-sm"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center justify-center gap-1"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-fade-in">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">F</span>
            </div>
            <span className="font-display font-semibold text-slate-900 dark:text-white">FINORA</span>
          </div>
          <div className="flex gap-1.5 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">Financial Goals</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select all that apply. You can add or change these later.</p>

          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoals((prev) =>
                      isSelected ? prev.filter((g) => g !== goal.id) : [...prev, goal.id]
                    );
                  }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-2 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon size={18} className={isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {goal.label}
                  </span>
                  {isSelected && <Check size={14} className="text-brand-600 dark:text-brand-400" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sticky bottom-0 p-5 bg-white/80 dark:bg-slate-900/80 glass border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 font-medium text-sm">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center justify-center gap-1"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 — Connect Accounts
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-fade-in">
      <div className="p-5 flex-1">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">F</span>
          </div>
          <span className="font-display font-semibold text-slate-900 dark:text-white">FINORA</span>
        </div>
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>
        <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">Connect Financial Accounts</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          In production, FINORA uses secure OAuth and consent-based aggregation. For this demo, use demo data to explore instantly.
        </p>

        <div className="space-y-3 mb-6">
          {accountTypes.map((acc, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${acc.color} flex items-center justify-center`}>
                <acc.icon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{acc.label}</p>
                <p className="text-xs text-slate-400">Connect via secure OAuth</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand-600 dark:text-brand-400" />
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">Use Demo Data</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Instantly populate FINORA with realistic synthetic financial data — 2 bank accounts, 2 brokers, 8 stocks, 6 mutual funds, 3 SIPs, 3 goals, and 12 months of history.
          </p>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-2">
          <ShieldCheck size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            FINORA never asks for banking passwords, PINs, OTPs, or CVVs. Real integrations use authorized financial-data aggregation with your explicit consent.
          </p>
        </div>
      </div>
      <div className="sticky bottom-0 p-5 bg-white/80 dark:bg-slate-900/80 glass border-t border-slate-200 dark:border-slate-700/50">
        <div className="flex gap-3">
          <button onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 font-medium text-sm">
            Back
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center justify-center gap-1"
          >
            Start with Demo Data
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
