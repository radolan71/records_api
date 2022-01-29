import { validateDate } from './validators';

describe('Unit - Tests Validators', () => {
  it('Unit - Test validateDate with valid date', () => {
    const testDate = '2014-05-30';
    expect(validateDate(testDate)).toBeTruthy;
  });

  it('Unit - Test validateDate with invalid date, day and month switch', () => {
    const testDate = '2014-30-05';
    expect(validateDate(testDate)).toBeFalsy;
  });

  it('Unit - Test validateDate with invalid date, year in different position', () => {
    const testDate = '30-05-2014';
    expect(validateDate(testDate)).toBeFalsy;
  });
});
