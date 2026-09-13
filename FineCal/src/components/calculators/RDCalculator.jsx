import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputSlider from '../shared/InputSlider';
import ResultCard from '../shared/ResultCard';
import BreakdownTable from '../shared/BreakdownTable';
import Card from '../shared/Card';
import StickyResultBar from '../shared/StickyResultBar';
import ChartSkeleton from '../shared/ChartSkeleton';
import { calculateRD } from '../../utils/calculations';
import { validateRange } from '../../utils/validation';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

const GrowthChart = lazy(() => import('../shared/GrowthChart'));

const LIMITS = {
  monthlyDeposit: { min: 500, max: 200000 },
  rate: { min: 1, max: 15 },
  years: { min: 1, max: 20 },
};

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const errors = {
    monthlyDeposit: validateRange(monthlyDeposit, {
      ...LIMITS.monthlyDeposit,
      label: 'Monthly deposit',
    }),
    rate: validateRange(rate, { ...LIMITS.rate, label: 'Interest rate' }),
    years: validateRange(years, { ...LIMITS.years, label: 'Time period' }),
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const debouncedMonthlyDeposit = useDebouncedValue(monthlyDeposit);
  const debouncedRate = useDebouncedValue(rate);
  const debouncedYears = useDebouncedValue(years);

  const result = useMemo(() => {
    if (hasErrors) return null;
    return calculateRD(debouncedMonthlyDeposit, debouncedRate, debouncedYears);
  }, [hasErrors, debouncedMonthlyDeposit, debouncedRate, debouncedYears]);

  return (
    <>
      <StickyResultBar label="Maturity Value" value={result?.maturityValue} visible={!!result} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Recurring Deposit Calculator</h2>

          <InputSlider
            label="Monthly Deposit"
            value={monthlyDeposit}
            onChange={setMonthlyDeposit}
            min={LIMITS.monthlyDeposit.min}
            max={LIMITS.monthlyDeposit.max}
            step={500}
            prefix="₹"
            error={errors.monthlyDeposit}
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
