/**
 * Payroll pricing — single rule used by every calculator.
 * Set by Reckonwell on 22 Nov 2026: £4 per employee per month, with a
 * minimum monthly charge of £25. This replaces the conflicting £3 / £6 / £40
 * rates in the original site's calculators (docs/pricing-rules.md §8).
 */
export const PAYROLL_RATE = {
  perEmployee: 4,
  monthlyMinimum: 25,
} as const;

/** Monthly payroll fee for a number of employees (0 employees → no fee). */
export function payrollMonthlyFee(employees: number): number {
  if (employees <= 0) return 0;
  return Math.max(PAYROLL_RATE.monthlyMinimum, PAYROLL_RATE.perEmployee * employees);
}

/** Breakdown note, e.g. "£4 per employee, minimum £25". */
export function payrollNote(employees: number): string | undefined {
  if (employees <= 0) return undefined;
  return PAYROLL_RATE.perEmployee * employees < PAYROLL_RATE.monthlyMinimum
    ? `minimum £${PAYROLL_RATE.monthlyMinimum}`
    : `£${PAYROLL_RATE.perEmployee} per employee`;
}
