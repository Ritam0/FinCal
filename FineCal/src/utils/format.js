// Formatting helpers — Indian numbering system (lakh/crore) currency display.

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrFormatterDecimal = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export function formatINR(value, { decimals = false } = {}) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return decimals ? inrFormatterDecimal.format(safeValue) : inrFormatter.format(safeValue);
}

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export function formatCompactINR(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `₹${compactFormatter.format(safeValue)}`;
}

export function formatNumberINR(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN').format(safeValue);
}
