import Card from './Card';

/**
 * Placeholder shown while the (lazily-loaded) chart bundle is still fetching.
 */
export default function ChartSkeleton() {
  return (
    <Card className="p-6">
      <div className="h-3 w-32 rounded bg-slate-200/80 dark:bg-slate-700/50 animate-pulse mb-4" />
      <div className="h-64 sm:h-80 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 animate-pulse" />
    </Card>
  );
}
