// Pure calculation functions for all calculators.
// Money in, money out — no React, no side effects.

const MONTHS_IN_YEAR = 12;

/**
 * SIP (Systematic Investment Plan) — fixed monthly investment.
 * Uses monthly compounding: standard SIP future-value formula.
 *
 * @param {number} monthlyInvestment
 * @param {number} annualRatePercent - expected annual return, e.g. 12
 * @param {number} years
 * @returns {{ maturityValue: number, investedAmount: number, estimatedGains: number, yearlyBreakdown: Array }}
 */
export function calculateSIP(monthlyInvestment, annualRatePercent, years) {
  const i = annualRatePercent / 100 / MONTHS_IN_YEAR;
  const totalMonths = Math.round(years * MONTHS_IN_YEAR);
  const yearlyBreakdown = [];

  let value = 0;
  let invested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    value = i === 0 ? value + monthlyInvestment : (value + monthlyInvestment) * (1 + i);
    invested += monthlyInvestment;

    if (month % MONTHS_IN_YEAR === 0 || month === totalMonths) {
      yearlyBreakdown.push({
        year: Math.ceil(month / MONTHS_IN_YEAR),
        invested: round2(invested),
        value: round2(value),
        gains: round2(value - invested),
      });
    }
  }

  return {
    maturityValue: round2(value),
    investedAmount: round2(invested),
    estimatedGains: round2(value - invested),
    yearlyBreakdown,
  };
}

/**
 * Step-up SIP — monthly investment increases by a fixed % every year.
 *
 * @param {number} initialMonthlyInvestment
 * @param {number} annualRatePercent - expected annual return
 * @param {number} years
 * @param {number} stepUpPercent - annual increase in monthly investment, e.g. 10
 */
export function calculateStepUpSIP(initialMonthlyInvestment, annualRatePercent, years, stepUpPercent) {
  const i = annualRatePercent / 100 / MONTHS_IN_YEAR;
  const totalMonths = Math.round(years * MONTHS_IN_YEAR);
  const yearlyBreakdown = [];

  let value = 0;
  let invested = 0;
  let currentMonthlyInvestment = initialMonthlyInvestment;

  for (let month = 1; month <= totalMonths; month++) {
    // Bump the monthly amount at the start of each new year (after year 1).
    const currentYearNumber = Math.floor((month - 1) / MONTHS_IN_YEAR) + 1;
    if (month > 1 && (month - 1) % MONTHS_IN_YEAR === 0) {
      currentMonthlyInvestment = initialMonthlyInvestment * Math.pow(1 + stepUpPercent / 100, currentYearNumber - 1);
    }

    value = i === 0 ? value + currentMonthlyInvestment : (value + currentMonthlyInvestment) * (1 + i);
    invested += currentMonthlyInvestment;

    if (month % MONTHS_IN_YEAR === 0 || month === totalMonths) {
      yearlyBreakdown.push({
        year: Math.ceil(month / MONTHS_IN_YEAR),
        invested: round2(invested),
        value: round2(value),
        gains: round2(value - invested),
      });
    }
  }

  return {
    maturityValue: round2(value),
    investedAmount: round2(invested),
    estimatedGains: round2(value - invested),
    yearlyBreakdown,
  };
}

/**
 * Lumpsum — single upfront investment, compounded annually (with monthly-resolution breakdown).
 *
 * @param {number} principal
 * @param {number} annualRatePercent
 * @param {number} years
 */
export function calculateLumpsum(principal, annualRatePercent, years) {
  const r = annualRatePercent / 100;
  const yearlyBreakdown = [];
  const totalYears = Math.round(years);

  for (let year = 1; year <= totalYears; year++) {
    const value = principal * Math.pow(1 + r, year);
    yearlyBreakdown.push({
      year,
      invested: round2(principal),
      value: round2(value),
      gains: round2(value - principal),
    });
  }

  const maturityValue = principal * Math.pow(1 + r, years);

  return {
    maturityValue: round2(maturityValue),
    investedAmount: round2(principal),
    estimatedGains: round2(maturityValue - principal),
    yearlyBreakdown,
  };
}

const COMPOUNDING_FREQUENCIES = {
  monthly: 12,
  quarterly: 4,
  'half-yearly': 2,
  yearly: 1,
};

/**
 * Fixed Deposit — compound interest with a selectable compounding frequency.
 *
 * @param {number} principal
 * @param {number} annualRatePercent
 * @param {number} years
 * @param {'monthly'|'quarterly'|'half-yearly'|'yearly'} compoundingFrequency
 */
export function calculateFD(principal, annualRatePercent, years, compoundingFrequency = 'quarterly') {
  const n = COMPOUNDING_FREQUENCIES[compoundingFrequency] ?? COMPOUNDING_FREQUENCIES.quarterly;
  const r = annualRatePercent / 100;
  const yearlyBreakdown = [];
  const totalYears = Math.round(years);

  for (let year = 1; year <= totalYears; year++) {
    const value = principal * Math.pow(1 + r / n, n * year);
    yearlyBreakdown.push({
      year,
      invested: round2(principal),
      value: round2(value),
      gains: round2(value - principal),
    });
  }

  const maturityValue = principal * Math.pow(1 + r / n, n * years);

  return {
    maturityValue: round2(maturityValue),
    investedAmount: round2(principal),
    estimatedGains: round2(maturityValue - principal),
    yearlyBreakdown,
  };
}

/**
 * Recurring Deposit — fixed monthly deposit, quarterly-compounded (standard Indian RD convention).
 *
 * @param {number} monthlyDeposit
 * @param {number} annualRatePercent
 * @param {number} years
 */
export function calculateRD(monthlyDeposit, annualRatePercent, years) {
  const n = 4; // quarterly compounding, standard for RD
  const r = annualRatePercent / 100;
  const totalMonths = Math.round(years * MONTHS_IN_YEAR);
  const yearlyBreakdown = [];

  let invested = 0;

  // Each monthly deposit compounds quarterly for the remaining time until maturity.
  const valueOfDeposit = (depositMonth, asOfMonth) => {
    const monthsRemaining = asOfMonth - depositMonth + 1;
    const yearsRemaining = monthsRemaining / MONTHS_IN_YEAR;
    return monthlyDeposit * Math.pow(1 + r / n, n * yearsRemaining);
  };

  for (let month = 1; month <= totalMonths; month++) {
    invested += monthlyDeposit;

    if (month % MONTHS_IN_YEAR === 0 || month === totalMonths) {
      let value = 0;
      for (let depositMonth = 1; depositMonth <= month; depositMonth++) {
        value += valueOfDeposit(depositMonth, month);
      }
      yearlyBreakdown.push({
        year: Math.ceil(month / MONTHS_IN_YEAR),
        invested: round2(invested),
        value: round2(value),
        gains: round2(value - invested),
      });
    }
  }

  const maturityValue = yearlyBreakdown.length > 0 ? yearlyBreakdown[yearlyBreakdown.length - 1].value : 0;

  return {
    maturityValue: round2(maturityValue),
    investedAmount: round2(invested),
    estimatedGains: round2(maturityValue - invested),
    yearlyBreakdown,
  };
}

/**
 * Goal Planner (reverse SIP) — required monthly SIP to reach a target corpus.
 *
 * @param {number} targetAmount
 * @param {number} annualRatePercent
 * @param {number} years
 * @returns {{ requiredMonthlyInvestment: number, investedAmount: number, estimatedGains: number, yearlyBreakdown: Array }}
 */
export function calculateGoalSIP(targetAmount, annualRatePercent, years) {
  const i = annualRatePercent / 100 / MONTHS_IN_YEAR;
  const totalMonths = Math.round(years * MONTHS_IN_YEAR);

  // Future value of SIP of ₹1/month: FV = [((1+i)^n - 1) / i] * (1 + i)
  const fvFactorOfOne =
    i === 0 ? totalMonths : ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);

  const requiredMonthlyInvestment = targetAmount / fvFactorOfOne;

  const { investedAmount, estimatedGains, yearlyBreakdown, maturityValue } = calculateSIP(
    requiredMonthlyInvestment,
    annualRatePercent,
    years
  );

  return {
    requiredMonthlyInvestment: round2(requiredMonthlyInvestment),
    maturityValue,
    investedAmount,
    estimatedGains,
    yearlyBreakdown,
  };
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
