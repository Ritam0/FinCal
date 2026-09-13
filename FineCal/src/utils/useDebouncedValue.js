import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates after `delay` ms of no further changes.
 * Used to avoid re-running expensive calculations on every slider-drag tick.
 */
export function useDebouncedValue(value, delay = 150) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
