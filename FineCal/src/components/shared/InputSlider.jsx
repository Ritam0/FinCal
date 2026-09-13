import { formatNumberINR } from '../../utils/format';

/**
 * A labeled slider synced to a number input, with optional prefix/suffix and inline validation.
 *
 * @param {{
 *   label: string,
 *   value: number,
 *   onChange: (value: number) => void,
 *   min: number,
 *   max: number,
 *   step?: number,
 *   prefix?: string,
 *   suffix?: string,
 *   error?: string,
 * }} props
 */
export default function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  error,
}) {
  const progress = max > min ? ((clamp(value, min, max) - min) / (max - min)) * 100 : 0;
  const inputMode = Number.isInteger(step) ? 'numeric' : 'decimal';

  const handleSliderChange = (e) => {
    onChange(Number(e.target.value));
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const num = Number(raw);
    if (!Number.isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div
          className={`flex items-center min-h-11 rounded-lg border bg-white dark:bg-slate-800 px-3 ${
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-slate-200 dark:border-slate-700 focus-within:border-accent-500 dark:focus-within:border-accent-400'
          }`}
        >
          {prefix && <span className="text-slate-400 dark:text-slate-500 text-sm mr-1">{prefix}</span>}
          <input
            type="number"
            inputMode={inputMode}
            value={value}
            onChange={handleNumberChange}
            className="w-20 sm:w-24 bg-transparent text-right text-base sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none tabular-nums"
          />
          {suffix && <span className="text-slate-400 dark:text-slate-500 text-sm ml-1">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={typeof value === 'number' ? value : min}
        onChange={handleSliderChange}
        style={{ '--range-progress': `${progress}%` }}
        className="w-full py-3 touch-none"
      />

      <div className="flex justify-between mt-1 text-xs text-slate-400 dark:text-slate-500">
        <span>{prefix}{formatNumberINR(min)}{suffix}</span>
        <span>{prefix}{formatNumberINR(max)}{suffix}</span>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

function clamp(value, min, max) {
  const num = typeof value === 'number' ? value : min;
  return Math.min(Math.max(num, min), max);
}
