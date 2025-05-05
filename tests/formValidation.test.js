/**
 * @jest-environment jsdom
 */
const { isEmailValid, isPhoneValid, areRequiredFieldsFilled } = require('../local_artisan/scripts/formValidation');

describe('Validation Functions', () => {
  test('Valid email passes', () => {
    expect(isEmailValid('seller@example.com')).toBe(true);
  });

  test('Invalid email fails', () => {
    expect(isEmailValid('seller@com')).toBe(false);
  });

  test('Valid South African phone number passes', () => {
    expect(isPhoneValid('0821234567')).toBe(true);
    expect(isPhoneValid('+27821234567')).toBe(true);
  });

  test('Invalid phone number fails', () => {
    expect(isPhoneValid('12345')).toBe(false);
  });
});

describe('Required Fields Check', () => {
  let formMock;

  beforeEach(() => {
    formMock = {
      businessName: { value: 'My Biz' },
      fullName: { value: 'Jane Doe' },
      email: { value: 'jane@example.com' },
      phone: { value: '0812345678' }
    };
  });

  test('All required fields filled returns true', () => {
    expect(areRequiredFieldsFilled(formMock)).toBe(true);
  });

  test('Missing field returns false', () => {
    formMock.fullName.value = '';
    expect(areRequiredFieldsFilled(formMock)).toBe(false);
  });
});
