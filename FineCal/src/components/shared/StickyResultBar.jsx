import AnimatedNumber from './AnimatedNumber';

/**
 * Mobile-only sticky strip that keeps the headline result visible while the user
 * scrolls through the input form. Pinned just below the app header.
 *
 * @param {{ label: string, value: number | undefined, visible: boolean }} props
 */
export default function StickyResultBar({ label, value, visible }) {
  if (!visible) return null;

  return (
    <div className="lg:hidden sticky top-[72px] z-10 mb-4">
      <div className="rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/40 shadow-lg shadow-slate-200/40 dark:shadow-black/30 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <AnimatedNumber
          value={value}
          className="text-lg font-extrabold text-accent-600 dark:text-accent-400 tabular-nums"
        />
      </div>
    </div>
  );
}
