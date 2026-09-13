// Shared inline-validation helper for numeric slider/number inputs.

/**
 * @param {number|string} value
 * @param {{ min: number, max: number, label: string }} constraints
 * @returns {string|undefined} error message, or undefined if valid
 */
export function validateRange(value, { min, max, label }) {
  if (value === '' || value === null || value === undefined) {
    return `${label} is required`;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return `${label} must be a number`;
  }
  if (num < min) {
    return `${label} must be at least ${min}`;
  }
  if (num > max) {
    return `${label} must be at most ${max}`;
  }
  return undefined;
}
