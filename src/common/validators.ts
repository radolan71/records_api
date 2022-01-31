/**
 * Validates a Date String is a valid date '2014-05-30'
 * @param {string} date
 * @returns {boolean}
 */
export function validateDate(date: string): boolean {
  return /\d{4}-[01]\d-[0-3]\d/.test(date);
}
