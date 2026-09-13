import { lazy, Suspense, useMemo, useState } from 'react';
import InputSlider from '../shared/InputSlider';
import Card from '../shared/Card';
import SwipeCarousel from '../shared/SwipeCarousel';
import AnimatedNumber from '../shared/AnimatedNumber';
import ChartSkeleton from '../shared/ChartSkeleton';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { SCENARIO_COLORS } from '../../utils/scenarioColors';
import { formatINR } from '../../utils/format';
import {
  calculateSIP,
  calculateStepUpSIP,
  calculateLumpsum,
  calculateFD,
  calculateRD,
  calculateGoalSIP,
} from '../../utils/calculations';

const ComparisonChart = lazy(() => import('./ComparisonChart'));

const TYPES = [
  { value: 'sip', label: 'SIP' },
  { value: 'stepup', label: 'Step-up SIP' },
  { value: 'lumpsum', label: 'Lumpsum' },
  { value: 'fd', label: 'Fixed Deposit' },
  { value: 'rd', label: 'Recurring Deposit' },
  { value: 'goal', label: 'Goal Planner' },
];

function useIsDark() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function defaultScenario(index) {
  return {
    id: `scenario-${Date.now()}-${index}`,
    label: `Scenario ${String.fromCharCode(65 + index)}`,
    type: 'sip',
    amount: 10000,
    rate: 12,
    years: 10,
    stepUpPercent: 10,
    frequency: 'quarterly',
  };
}

function computeResult(scenario) {
  const { type, amount, rate, years, stepUpPercent, frequency } = scenario;
  switch (type) {
    case 'sip':
      return calculateSIP(amount, rate, years);
    case 'stepup':
      return calculateStepUpSIP(amount, rate, years, stepUpPercent);
    case 'lumpsum':
      return calculateLumpsum(amount, rate, years);
    case 'fd':
      return calculateFD(amount, rate, years, frequency);
    case 'rd':
      return calculateRD(amount, rate, years);
    case 'goal': {
      const goal = calculateGoalSIP(amount, rate, years);
      return { ...goal, maturityValue: goal.maturityValue };
    }
    default:
      return calculateSIP(amount, rate, years);
  }
}

function mergeByYear(scenarios) {
  const maxYear = Math.max(
    0,
    ...scenarios.map((s) => s.result.yearlyBreakdown.at(-1)?.year ?? 0)
  );
  const rows = [];
  for (let year = 1; year <= maxYear; year++) {
    const row = { year };
    scenarios.forEach((s) => {
      const point = s.result.yearlyBreakdown.find((p) => p.year === year);
      row[s.id] = point ? point.value : null;
    });
    rows.push(row);
  }
  return rows;
}

function ScenarioEditor({ scenario, onChange, onRemove, canRemove, colorHex }) {
  const update = (patch) => onChange({ ...scenario, ...patch });

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorHex }} />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">{scenario.label}</h3>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-slate-400 hover:text-red-500 dark:hover:text-red-400 min-h-11 px-2 -mr-2"
          >
            Remove
          </button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
          Calculator Type
        </label>
        <select
          value={scenario.type}
          onChange={(e) => update({ type: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 px-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-accent-500 transition-colors"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <InputSlider
        label={scenario.type === 'lumpsum' ? 'Investment Amount' : scenario.type === 'goal' ? 'Target Amount' : scenario.type === 'fd' ? 'Deposit Amount' : 'Monthly Amount'}
        value={scenario.amount}
        onChange={(v) => update({ amount: v })}
        min={scenario.type === 'goal' ? 100000 : 500}
        max={scenario.type === 'goal' || scenario.type === 'lumpsum' || scenario.type === 'fd' ? 10000000 : 500000}
        step={scenario.type === 'goal' ? 50000 : scenario.type === 'lumpsum' || scenario.type === 'fd' ? 1000 : 500}
        prefix="₹"
      />

      <InputSlider
        label="Expected Return (p.a.)"
        value={scenario.rate}
        onChange={(v) => update({ rate: v })}
        min={1}
        max={30}
        step={0.5}
        suffix="%"
      />

      <InputSlider
        label="Time Period"
        value={scenario.years}
        onChange={(v) => update({ years: v })}
        min={1}
        max={40}
        step={1}
        suffix=" yrs"
      />

      {scenario.type === 'stepup' && (
        <InputSlider
          label="Annual Step-up"
          value={scenario.stepUpPercent}
          onChange={(v) => update({ stepUpPercent: v })}
          min={0}
          max={25}
          step={1}
          suffix="%"
        />
      )}

      {scenario.type === 'fd' && (
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Compounding
          </label>
          <select
            value={scenario.frequency}
            onChange={(e) => update({ frequency: e.target.value })}
            className="w-full min-h-11 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 px-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-accent-500 transition-colors"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-Yearly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}
    </Card>
  );
}

export default function ComparisonMode() {
  const [scenarios, setScenarios] = useState([defaultScenario(0), defaultScenario(1)]);
  const isDark = useIsDark();
  const debouncedScenarios = useDebouncedValue(scenarios, 150);

  const scenariosWithResults = useMemo(
    () => debouncedScenarios.map((s) => ({ ...s, result: computeResult(s) })),
    [debouncedScenarios]
  );

  const chartData = useMemo(() => mergeByYear(scenariosWithResults), [scenariosWithResults]);

  const addScenario = () => {
    if (scenarios.length >= 3) return;
    setScenarios([...scenarios, defaultScenario(scenarios.length)]);
  };

  const removeScenario = (id) => {
    if (scenarios.length <= 2) return;
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const updateScenario = (updated) => {
    setScenarios(scenarios.map((s) => (s.id === updated.id ? updated : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Compare Scenarios</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare 2-3 investment scenarios side by side.
          </p>
        </div>
        <button
          type="button"
          onClick={addScenario}
          disabled={scenarios.length >= 3}
          className="rounded-lg bg-accent-600 text-white text-sm font-medium px-4 min-h-11 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-700 active:scale-95 transition-all shrink-0"
        >
          + Add Scenario
        </button>
      </div>

      <SwipeCarousel>
        {scenarios.map((scenario, index) => (
          <ScenarioEditor
            key={scenario.id}
            scenario={scenario}
            onChange={updateScenario}
            onRemove={() => removeScenario(scenario.id)}
            canRemove={scenarios.length > 2}
            colorHex={isDark ? SCENARIO_COLORS[index].dark : SCENARIO_COLORS[index].light}
          />
        ))}
      </SwipeCarousel>

      <Suspense fallback={<ChartSkeleton />}>
        <ComparisonChart chartData={chartData} scenariosWithResults={scenariosWithResults} isDark={isDark} />
      </Suspense>

      <SwipeCarousel>
        {scenariosWithResults.map((s, index) => (
          <Card key={s.id} className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isDark ? SCENARIO_COLORS[index].dark : SCENARIO_COLORS[index].light }}
              />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.label}</p>
              <span className="text-xs text-slate-400">· {TYPES.find((t) => t.value === s.type)?.label}</span>
            </div>
            <AnimatedNumber
              value={s.result.maturityValue}
              className="block text-2xl font-extrabold text-accent-600 dark:text-accent-400 tracking-tight mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Invested</span>
              <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                {formatINR(s.result.investedAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500 dark:text-slate-400">Gains</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatINR(s.result.estimatedGains)}
              </span>
            </div>
            {s.type === 'goal' && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500 dark:text-slate-400">Required Monthly SIP</span>
                <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                  {formatINR(s.result.requiredMonthlyInvestment)}
                </span>
              </div>
            )}
          </Card>
        ))}
      </SwipeCarousel>
    </div>
  );
}
