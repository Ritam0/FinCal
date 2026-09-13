import Card from './Card';
import AnimatedNumber from './AnimatedNumber';

/**
 * Displays the headline result of a calculator plus invested amount, gains, and an optional extra stat.
 *
 * @param {{ maturityValue: number, investedAmount: number, estimatedGains: number, extra?: { label: string, value: number }, headlineLabel?: string, headlineValue?: number }} props
 */
export default function ResultCard({
  maturityValue,
  investedAmount,
  estimatedGains,
  extra,
  headlineLabel = 'Maturity Value',
  headlineValue,
}) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
        {headlineLabel}
      </p>
      <AnimatedNumber
        value={headlineValue ?? maturityValue}
        className="block text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-400 dark:to-accent-300 bg-clip-text text-transparent"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
            Invested Amount
          </p>
          <AnimatedNumber
            value={investedAmount}
            className="block text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums"
          />
        </div>
        <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
            Estimated Gains
          </p>
          <AnimatedNumber
            value={estimatedGains}
            className="block text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums"
          />
        </div>
      </div>

      {extra && (
        <div className="mt-4 rounded-2xl bg-accent-50/80 dark:bg-accent-500/10 border border-accent-100/80 dark:border-accent-800/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600/80 dark:text-accent-300/80 mb-1">
            {extra.label}
          </p>
          <AnimatedNumber
            value={extra.value}
            className="block text-lg font-bold text-accent-800 dark:text-accent-200 tabular-nums"
          />
        </div>
      )}
    </Card>
  );
}
