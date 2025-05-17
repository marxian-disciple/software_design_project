/**
 * @jest-environment jsdom
 */
const { isEmailValid, isPhoneValid, areRequiredFieldsFilled } = require('../local_artisan/scripts/seller_registration');

describe('Email Validation', () => {
  test('Valid email passes', () => {
    expect(isEmailValid('seller@example.com')).toBe(true);
    expect(isEmailValid('user.name+tag@sub.domain.co.uk')).toBe(true);
  });

  test('Invalid email fails', () => {
    expect(isEmailValid('seller@com')).toBe(false);              // Missing TLD
    expect(isEmailValid('seller.example.com')).toBe(false);      // Missing @
    expect(isEmailValid('seller@.com')).toBe(false);            // Empty domain
    expect(isEmailValid('@example.com')).toBe(false);           // Missing local part
    expect(isEmailValid('')).toBe(false);                       // Empty string
  });
});

describe('South African Phone Number Validation', () => {
  test('Valid SA phone numbers pass', () => {
    expect(isPhoneValid('0821234567')).toBe(true);              // 10 digits starting with 0
    expect(isPhoneValid('+27821234567')).toBe(true);            // 12 digits starting with +27
    expect(isPhoneValid('27821234567')).toBe(true);            // 11 digits starting with 27
    expect(isPhoneValid('0721234567')).toBe(true);             // Another valid 10-digit format
  });

  test('Invalid phone numbers fail', () => {
    expect(isPhoneValid('12345')).toBe(false);                 // Too short
    expect(isPhoneValid('082123456')).toBe(false);             // 9 digits (too short)
    expect(isPhoneValid('08212345678')).toBe(false);           // 11 digits (too long for 0-prefix)
    expect(isPhoneValid('+29123456789')).toBe(false);          // Wrong country code
    expect(isPhoneValid('abc0821234567')).toBe(false);         // Contains letters
    expect(isPhoneValid('')).toBe(false);                      // Empty string
  });
});

describe('Required Fields Validation', () => {
  let formMock;

  beforeEach(() => {
    formMock = {
      businessName: { value: 'My Artisan Shop' },
      fullName: { value: 'John Doe' },
      email: { value: 'john@example.com' },
      phone: { value: '0831234567' }
    };
  });

  test('All required fields filled returns true', () => {
    expect(areRequiredFieldsFilled(formMock)).toBe(true);
  });

  test('Empty field returns false', () => {
    const fields = ['businessName', 'fullName', 'email', 'phone'];
    
    fields.forEach(field => {
      const originalValue = formMock[field].value;
      formMock[field].value = '';                             // Empty the field
      expect(areRequiredFieldsFilled(formMock)).toBe(false);
      formMock[field].value = originalValue;                  // Restore original value
    });
  });

  test('Whitespace-only fields return false', () => {
    formMock.fullName.value = '   ';
    expect(areRequiredFieldsFilled(formMock)).toBe(false);
  });
});
