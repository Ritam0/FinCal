import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import { formatCompactINR, formatINR } from '../../utils/format';
import { useIsMobile } from '../../utils/useIsMobile';

// Categorical palette (validated for adjacent + all-pairs CVD safety) — see dataviz skill.
const SERIES_COLORS = {
  invested: { light: '#2a78d6', dark: '#3987e5' }, // slot 1 — blue
  value: { light: '#eb6834', dark: '#d95926' }, // slot 2 — orange
};

function useIsDark() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-xl text-sm">
      <p className="font-medium text-slate-500 dark:text-slate-400 mb-1.5">Year {label}</p>
      {payload
        .slice()
        .reverse()
        .map((entry) => (
          <p key={entry.dataKey} className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
            <span className="font-semibold tabular-nums">{formatINR(entry.value)}</span>
          </p>
        ))}
    </div>
  );
}

/**
 * Line/area chart plotting invested amount vs total value across years.
 * @param {{ data: Array<{year:number, invested:number, value:number}> }} props
 */
export default function GrowthChart({ data }) {
  const isDark = useIsDark();
  const isMobile = useIsMobile();
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9';
  const axisColor = isDark ? '#898781' : '#898781';
  const investedColor = isDark ? SERIES_COLORS.invested.dark : SERIES_COLORS.invested.light;
  const valueColor = isDark ? SERIES_COLORS.value.dark : SERIES_COLORS.value.light;
  const tickFontSize = isMobile ? 10 : 12;
  const xAxisInterval = isMobile && data?.length > 12 ? Math.ceil(data.length / 6) - 1 : 0;

  if (!data || data.length === 0) return null;

  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-4">
        Growth Over Time
      </p>
      <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={valueColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={valueColor} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={investedColor} stopOpacity={0.14} />
              <stop offset="100%" stopColor={investedColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Y${y}`}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: tickFontSize }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            interval={xAxisInterval}
          />
          <YAxis
            tickFormatter={(v) => formatCompactINR(v)}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: tickFontSize }}
            axisLine={false}
            tickLine={false}
            width={isMobile ? 48 : 64}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: isMobile ? 11 : 13, paddingTop: 12 }}
            formatter={(value) => <span className="text-slate-600 dark:text-slate-300">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="Invested"
            stroke={investedColor}
            strokeWidth={2}
            fill="url(#investedFill)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--tw-color-white, #fff)' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name="Total Value"
            stroke={valueColor}
            strokeWidth={2}
            fill="url(#valueFill)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--tw-color-white, #fff)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </Card>
  );
}
