/**
 * @jest-environment jsdom
 */
const { isEmailValid, isPhoneValid, areRequiredFieldsFilled } = require('..local_artisan/scripts/seller_registration');

describe('Validation Functions', () => {
  describe('Email Validation', () => {
    test('Valid email passes', () => {
      expect(isEmailValid('seller@example.com')).toBe(true);
      expect(isEmailValid('user.name+tag@sub.domain.co.za')).toBe(true);
    });

    test('Invalid email fails', () => {
      expect(isEmailValid('seller@com')).toBe(false);
      expect(isEmailValid('seller@.com')).toBe(false);
      expect(isEmailValid('@example.com')).toBe(false);
      expect(isEmailValid('')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    test('Valid SA phone numbers pass', () => {
      expect(isPhoneValid('0812345678')).toBe(true);        // 10 digits starting with 0
      expect(isPhoneValid('+27812345678')).toBe(true);      // 12 digits starting with +27
      expect(isPhoneValid('0712345678')).toBe(true);       // Other valid prefix
    });

    test('Invalid phone numbers fail', () => {
      expect(isPhoneValid('12345')).toBe(false);            // Too short
      expect(isPhoneValid('081234567')).toBe(false);       // 9 digits
      expect(isPhoneValid('+29123456789')).toBe(false);     // Wrong country code
      expect(isPhoneValid('abcdefghij')).toBe(false);      // Non-numeric
    });
  });

  describe('Required Fields Validation', () => {
    let formMock;

    beforeEach(() => {
      formMock = {
        businessName: { value: 'Artisan Crafts' },
        fullName: { value: 'John Doe' },
        email: { value: 'john@example.com' },
        phone: { value: '0831234567' },
        // Optional fields
        registrationNumber: { value: '' },
        vatNumber: { value: '' },
        website: { value: '' }
      };
    });

    test('All required fields filled returns true', () => {
      expect(areRequiredFieldsFilled(formMock)).toBe(true);
    });

    test('Missing any required field returns false', () => {
      const requiredFields = ['businessName', 'fullName', 'email', 'phone'];
      
      requiredFields.forEach(field => {
        const originalValue = formMock[field].value;
        formMock[field].value = '';
        expect(areRequiredFieldsFilled(formMock)).toBe(false);
        formMock[field].value = originalValue;
      });
    });

    test('Whitespace-only fields return false', () => {
      formMock.businessName.value = '   ';
      expect(areRequiredFieldsFilled(formMock)).toBe(false);
    });

    test('Optional fields can be empty', () => {
      formMock.registrationNumber.value = '';
      formMock.vatNumber.value = '';
      formMock.website.value = '';
      expect(areRequiredFieldsFilled(formMock)).toBe(true);
    });
  });
});
