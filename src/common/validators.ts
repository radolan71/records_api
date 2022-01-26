/**
 * Validates a Date String is a valid UTC date '2014-05-30T13:32:39.622Z'
 * @param {string} date
 * @returns {boolean}
 */
export function validateIsoDate(date: string): boolean {
  return /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(date);
}
