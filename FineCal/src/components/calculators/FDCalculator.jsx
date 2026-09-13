import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputSlider from '../shared/InputSlider';
import ResultCard from '../shared/ResultCard';
import BreakdownTable from '../shared/BreakdownTable';
import Card from '../shared/Card';
import StickyResultBar from '../shared/StickyResultBar';
import ChartSkeleton from '../shared/ChartSkeleton';
import { calculateFD } from '../../utils/calculations';
import { validateRange } from '../../utils/validation';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

const GrowthChart = lazy(() => import('../shared/GrowthChart'));

const LIMITS = {
  principal: { min: 1000, max: 10000000 },
  rate: { min: 1, max: 15 },
  years: { min: 1, max: 20 },
};

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half-yearly', label: 'Half-Yearly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState('quarterly');

  const errors = {
    principal: validateRange(principal, { ...LIMITS.principal, label: 'Deposit amount' }),
    rate: validateRange(rate, { ...LIMITS.rate, label: 'Interest rate' }),
    years: validateRange(years, { ...LIMITS.years, label: 'Time period' }),
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const debouncedPrincipal = useDebouncedValue(principal);
  const debouncedRate = useDebouncedValue(rate);
  const debouncedYears = useDebouncedValue(years);

  const result = useMemo(() => {
    if (hasErrors) return null;
    return calculateFD(debouncedPrincipal, debouncedRate, debouncedYears, frequency);
  }, [hasErrors, debouncedPrincipal, debouncedRate, debouncedYears, frequency]);

  return (
    <>
      <StickyResultBar label="Maturity Value" value={result?.maturityValue} visible={!!result} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Fixed Deposit Calculator</h2>

          <InputSlider
            label="Deposit Amount"
            value={principal}
            onChange={setPrincipal}
            min={LIMITS.principal.min}
            max={LIMITS.principal.max}
            step={1000}
            prefix="₹"
            error={errors.principal}
          />

          <InputSlider
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={LIMITS.rate.min}
            max={LIMITS.rate.max}
            step={0.1}
            suffix="%"
            error={errors.rate}
          />

          <InputSlider
            label="Time Period"
            value={years}
            onChange={setYears}
            min={LIMITS.years.min}
            max={LIMITS.years.max}
            step={1}
            suffix=" yrs"
            error={errors.years}
          />

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFrequency(f.value)}
                  className={`rounded-xl px-3 min-h-11 text-sm font-medium border transition-all duration-150 active:scale-95 ${
                    frequency === f.value
                      ? 'bg-accent-600 border-accent-600 text-white shadow-md shadow-accent-500/25'
                      : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-accent-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-6"
              >
                <ResultCard
                  maturityValue={result.maturityValue}
                  investedAmount={result.investedAmount}
                  estimatedGains={result.estimatedGains}
                />
                <Suspense fallback={<ChartSkeleton />}>
                  <GrowthChart data={result.yearlyBreakdown} />
                </Suspense>
                <BreakdownTable data={result.yearlyBreakdown} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-8 text-center text-sm text-slate-400">
                  Fix the highlighted inputs to see results.
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
