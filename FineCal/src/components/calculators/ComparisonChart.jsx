import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../shared/Card';
import { useIsMobile } from '../../utils/useIsMobile';
import { SCENARIO_COLORS } from '../../utils/scenarioColors';
import { formatCompactINR, formatINR } from '../../utils/format';

function CustomTooltip({ active, payload, label, scenarios }) {
  if (!active || !payload || payload.length === 0) return null;
  const labelById = Object.fromEntries(scenarios.map((s) => [s.id, s.label]));

  return (
    <div className="rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-xl text-sm">
      <p className="font-medium text-slate-500 dark:text-slate-400 mb-1.5">Year {label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{labelById[entry.dataKey]}:</span>
          <span className="font-semibold tabular-nums">{formatINR(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * Overlaid growth-comparison line chart for 2-3 scenarios.
 * @param {{ chartData: Array<object>, scenariosWithResults: Array<object>, isDark: boolean }} props
 */
export default function ComparisonChart({ chartData, scenariosWithResults, isDark }) {
  const isMobile = useIsMobile();
  const tickFontSize = isMobile ? 10 : 12;
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9';
  const axisColor = '#898781';

  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-4">
        Growth Comparison
      </p>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(y) => `Y${y}`}
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: tickFontSize }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatCompactINR(v)}
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: tickFontSize }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 48 : 64}
            />
            <Tooltip content={<CustomTooltip scenarios={scenariosWithResults} />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: isMobile ? 11 : 13, paddingTop: 12 }}
              formatter={(value) => {
                const s = scenariosWithResults.find((sc) => sc.id === value);
                return <span className="text-slate-600 dark:text-slate-300">{s?.label ?? value}</span>;
              }}
            />
            {scenariosWithResults.map((s, index) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.id}
                stroke={isDark ? SCENARIO_COLORS[index].dark : SCENARIO_COLORS[index].light}
                strokeWidth={2}
                dot={false}
                connectNulls
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
