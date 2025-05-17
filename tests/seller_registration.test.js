/**
 * @jest-environment jsdom
 */
const { 
  isEmailValid, 
  isPhoneValid, 
  areRequiredFieldsFilled, 
  validateAndAlert 
} = require('./seller_registration');

global.alert = jest.fn();

describe('Seller Registration Validation', () => {
  let formMock;

  beforeEach(() => {
    formMock = {
      businessName: { value: 'Artisan Crafts' },
      fullName: { value: 'John Doe' },
      email: { value: 'john@example.com' },
      phone: { value: '0831234567' },
      registrationNumber: { value: '' },
      vatNumber: { value: '' },
      website: { value: '' }
    };
    jest.clearAllMocks();
  });

  describe('Email Validation', () => {
    test('validates correct email formats', () => {
      expect(isEmailValid('test@example.com')).toBe(true);
      expect(isEmailValid('user.name@domain.co.za')).toBe(true);
      expect(isEmailValid('firstname+lastname@domain.com')).toBe(true);
    });

    test('rejects invalid email formats', () => {
      expect(isEmailValid('plainaddress')).toBe(false);
      expect(isEmailValid('@missingusername.com')).toBe(false);
      expect(isEmailValid('username@.com')).toBe(false);
      expect(isEmailValid('username@domain..com')).toBe(false);
      expect(isEmailValid('')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    test('validates South African phone numbers', () => {
      expect(isPhoneValid('0812345678')).toBe(true);
      expect(isPhoneValid('+27812345678')).toBe(true);
      expect(isPhoneValid('27812345678')).toBe(true);
      expect(isPhoneValid('0712345678')).toBe(true);
    });

    test('rejects invalid phone numbers', () => {
      expect(isPhoneValid('12345')).toBe(false);
      expect(isPhoneValid('081234567')).toBe(false);
      expect(isPhoneValid('+29123456789')).toBe(false);
      expect(isPhoneValid('abcdefghij')).toBe(false);
      expect(isPhoneValid('')).toBe(false);
    });
  });

  describe('Required Fields Validation', () => {
    test('returns true when all required fields are filled', () => {
      expect(areRequiredFieldsFilled(formMock)).toBe(true);
    });

    test('returns false when any required field is missing', () => {
      ['businessName', 'fullName', 'email', 'phone'].forEach(field => {
        formMock[field].value = '';
        expect(areRequiredFieldsFilled(formMock)).toBe(false);
        formMock[field].value = 'restored';
      });
    });

    test('returns false for whitespace-only fields', () => {
      formMock.businessName.value = '   ';
      expect(areRequiredFieldsFilled(formMock)).toBe(false);
    });

    test('ignores empty optional fields', () => {
      formMock.registrationNumber.value = '';
      formMock.vatNumber.value = '';
      formMock.website.value = '';
      expect(areRequiredFieldsFilled(formMock)).toBe(true);
    });
  });

  describe('Validation with Alert', () => {
    test('does not show alert when all fields are valid', () => {
      validateAndAlert(formMock);
      expect(alert).not.toHaveBeenCalled();
    });

    test('shows alert when any required field is missing', () => {
      ['businessName', 'fullName', 'email', 'phone'].forEach(field => {
        formMock[field].value = '';
        validateAndAlert(formMock);
        expect(alert).toHaveBeenCalledWith(
          "Please fill in all required fields: Business Name, Full Name, Email, and Phone Number."
        );
        formMock[field].value = 'restored';
        jest.clearAllMocks();
      });
    });

    test('returns false when validation fails', () => {
      formMock.email.value = '';
      expect(validateAndAlert(formMock)).toBe(false);
    });

    test('returns true when validation passes', () => {
      expect(validateAndAlert(formMock)).toBe(true);
    });
  });
});