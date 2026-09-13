import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputSlider from '../shared/InputSlider';
import ResultCard from '../shared/ResultCard';
import BreakdownTable from '../shared/BreakdownTable';
import Card from '../shared/Card';
import StickyResultBar from '../shared/StickyResultBar';
import ChartSkeleton from '../shared/ChartSkeleton';
import { calculateSIP, calculateStepUpSIP } from '../../utils/calculations';
import { validateRange } from '../../utils/validation';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

const GrowthChart = lazy(() => import('../shared/GrowthChart'));

const LIMITS = {
  monthlyInvestment: { min: 500, max: 500000 },
  rate: { min: 1, max: 30 },
  years: { min: 1, max: 40 },
  stepUp: { min: 0, max: 25 },
};

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [isStepUp, setIsStepUp] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);

  const errors = {
    monthlyInvestment: validateRange(monthlyInvestment, {
      ...LIMITS.monthlyInvestment,
      label: 'Monthly investment',
    }),
    rate: validateRange(rate, { ...LIMITS.rate, label: 'Expected return' }),
    years: validateRange(years, { ...LIMITS.years, label: 'Time period' }),
    stepUpPercent: isStepUp
      ? validateRange(stepUpPercent, { ...LIMITS.stepUp, label: 'Annual step-up' })
      : undefined,
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const debouncedMonthlyInvestment = useDebouncedValue(monthlyInvestment);
  const debouncedRate = useDebouncedValue(rate);
  const debouncedYears = useDebouncedValue(years);
  const debouncedStepUpPercent = useDebouncedValue(stepUpPercent);

  const result = useMemo(() => {
    if (hasErrors) return null;
    return isStepUp
      ? calculateStepUpSIP(debouncedMonthlyInvestment, debouncedRate, debouncedYears, debouncedStepUpPercent)
      : calculateSIP(debouncedMonthlyInvestment, debouncedRate, debouncedYears);
  }, [hasErrors, isStepUp, debouncedMonthlyInvestment, debouncedRate, debouncedYears, debouncedStepUpPercent]);

  return (
    <>
      <StickyResultBar label="Maturity Value" value={result?.maturityValue} visible={!!result} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">SIP Calculator</h2>
            <label className="flex items-center gap-2 min-h-11 -mr-2 pr-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isStepUp}
                onChange={(e) => setIsStepUp(e.target.checked)}
                className="w-5 h-5 rounded accent-accent-600"
              />
              Step-up SIP
            </label>
          </div>

          <InputSlider
            label="Monthly Investment"
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            min={LIMITS.monthlyInvestment.min}
            max={LIMITS.monthlyInvestment.max}
            step={500}
            prefix="₹"
            error={errors.monthlyInvestment}
          />

          <InputSlider
            label="Expected Return Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={LIMITS.rate.min}
            max={LIMITS.rate.max}
            step={0.5}
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

          {isStepUp && (
            <InputSlider
              label="Annual Step-up"
              value={stepUpPercent}
              onChange={setStepUpPercent}
              min={LIMITS.stepUp.min}
              max={LIMITS.stepUp.max}
              step={1}
              suffix="%"
              error={errors.stepUpPercent}
            />
          )}
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
