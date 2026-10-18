/** Pads a number to two digits: 1 -> '01'. Used for section and project numbers. */
export function twoDigits(n: number): string {
  return String(n).padStart(2, '0');
}
