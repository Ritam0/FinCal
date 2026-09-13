import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './components/shared/ThemeToggle';
import SIPCalculator from './components/calculators/SIPCalculator';
import LumpsumCalculator from './components/calculators/LumpsumCalculator';
import FDCalculator from './components/calculators/FDCalculator';
import RDCalculator from './components/calculators/RDCalculator';
import GoalPlannerCalculator from './components/calculators/GoalPlannerCalculator';
import ComparisonMode from './components/calculators/ComparisonMode';
import {
  TrendingUpIcon,
  BanknoteIcon,
  LockIcon,
  RepeatIcon,
  FlagIcon,
  ScaleIcon,
} from './components/shared/icons';

const CALCULATORS = [
  { id: 'sip', label: 'SIP', navLabel: 'SIP', icon: TrendingUpIcon, component: SIPCalculator },
  { id: 'lumpsum', label: 'Lumpsum', navLabel: 'Lumpsum', icon: BanknoteIcon, component: LumpsumCalculator },
  { id: 'fd', label: 'Fixed Deposit', navLabel: 'FD', icon: LockIcon, component: FDCalculator },
  { id: 'rd', label: 'Recurring Deposit', navLabel: 'RD', icon: RepeatIcon, component: RDCalculator },
  { id: 'goal', label: 'Goal Planner', navLabel: 'Goal', icon: FlagIcon, component: GoalPlannerCalculator },
  { id: 'compare', label: 'Compare', navLabel: 'Compare', icon: ScaleIcon, component: ComparisonMode },
];

function App() {
  const [activeId, setActiveId] = useState('sip');

  const active = CALCULATORS.find((c) => c.id === activeId) ?? CALCULATORS[0];
  const ActiveComponent = active.component;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-md shadow-accent-500/30 flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">FineCal</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Desktop / tablet tab nav */}
        <nav className="hidden lg:block max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 pb-2">
            {CALCULATORS.map((calc) => (
              <button
                key={calc.id}
                type="button"
                onClick={() => setActiveId(calc.id)}
                className={`relative whitespace-nowrap rounded-xl px-3.5 min-h-11 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${
                  activeId === calc.id
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {activeId === calc.id && (
                  <motion.span
                    layoutId="desktopActiveTab"
                    className="absolute inset-0 bg-accent-600 rounded-xl shadow-md shadow-accent-500/30"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative">{calc.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-t border-white/40 dark:border-slate-800/60"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-6">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            const isActive = calc.id === activeId;
            return (
              <button
                key={calc.id}
                type="button"
                onClick={() => setActiveId(calc.id)}
                className="relative flex flex-col items-center justify-center gap-1 min-h-[56px] py-1.5 active:scale-90 transition-transform duration-150"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobileActivePill"
                    className="absolute top-1 w-9 h-6 rounded-full bg-accent-50 dark:bg-accent-500/15"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={`relative w-5 h-5 transition-colors ${
                    isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span
                  className={`relative text-[10px] font-medium leading-none transition-colors ${
                    isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {calc.navLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
