import { useState } from 'react';
import Card from './Card';
import { formatINR } from '../../utils/format';

/**
 * Collapsible year-by-year breakdown of invested amount, value, and gains.
 * @param {{ data: Array<{year:number, invested:number, value:number, gains:number}> }} props
 */
export default function BreakdownTable({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data || data.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-6 min-h-14 text-left active:bg-slate-50/60 dark:active:bg-slate-800/30 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Year-by-year breakdown
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="overflow-x-auto border-t border-slate-200/60 dark:border-slate-800/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left font-semibold px-6 py-3">Year</th>
                <th className="text-right font-semibold px-6 py-3">Invested</th>
                <th className="text-right font-semibold px-6 py-3">Value</th>
                <th className="text-right font-semibold px-6 py-3">Gains</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.year}
                  className="border-t border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium tabular-nums">
                    {row.year}
                  </td>
                  <td className="px-6 py-2.5 text-right text-slate-600 dark:text-slate-300 tabular-nums">
                    {formatINR(row.invested)}
                  </td>
                  <td className="px-6 py-2.5 text-right text-slate-800 dark:text-slate-100 font-semibold tabular-nums">
                    {formatINR(row.value)}
                  </td>
                  <td className="px-6 py-2.5 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatINR(row.gains)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
