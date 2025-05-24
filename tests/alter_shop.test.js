/**
 * @jest-environment jsdom
 */

import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton
} from '../local_artisan/scripts/alter_shop.js';

describe('profileHandlers', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `<div id="root"></div>`;
    container = document.getElementById('root');
    global.initializeShopUpdate = jest.fn(); // mock dependency
  });

  test('renderProfiles appends profile form for matching user', () => {
    const user = { uid: 'abc123', email: 'user@example.com' };
    const docs = [{
      data: () => ({
        userId: 'abc123',
        businessName: 'My Biz',
        fullName: 'Jane Doe',
        email: 'biz@example.com',
        phone: '0123456789',
        vatNumber: 'VAT123',
        website: 'www.biz.com'
      })
    }];

    renderProfiles(container, docs, user);

    const form = container.querySelector('.shop-info');
    expect(form).not.toBeNull();
    expect(form.querySelector('#businessName').placeholder).toBe('My Biz');
    expect(form.querySelector('#owner').placeholder).toBe('Jane Doe');
    expect(form.querySelector('#email').placeholder).toBe('biz@example.com');
    expect(global.initializeShopUpdate).toHaveBeenCalled();
  });

  test('renderProfiles does not render form for non-matching user', () => {
    const user = { uid: 'not-matching' };
    const docs = [{
      data: () => ({
        userId: 'other-id',
        businessName: 'Their Biz'
      })
    }];

    renderProfiles(container, docs, user);
    expect(container.querySelector('.shop-info')).toBeNull();
  });

  test('renderNotLoggedIn renders correct message', () => {
    renderNotLoggedIn(container);
    expect(container.innerHTML).toContain('You must be logged in');
  });

  test('renderError renders correct message', () => {
    renderError(container);
    expect(container.innerHTML).toContain('Failed to load shop profile');
  });

  test('initCloseButton adds event listener and triggers callback', () => {
    const callback = jest.fn();
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeBtn';
    document.body.appendChild(closeBtn);

    initCloseButton(callback);
    closeBtn.click();
    expect(callback).toHaveBeenCalled();
  });

  test('initCloseButton does not fail if button is missing', () => {
    expect(() => initCloseButton(() => {})).not.toThrow();
  });
});
const { isEmailValid, isPhoneValid, areRequiredFieldsFilled, validateAndAlert } = require('../local_artisan/scripts/seller_registration');

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

  describe('validateAndAlert', () => {
    let formMock;

    beforeEach(() => {
      formMock = {
        businessName: { value: 'Artisan Crafts' },
        fullName: { value: 'John Doe' },
        email: { value: 'john@example.com' },
        phone: { value: '0831234567' }
      };

      // Mock the global alert function
      global.alert = jest.fn();
    });

    test('returns true and shows no alert when all fields are present', () => {
      const result = validateAndAlert(formMock);
      expect(result).toBe(true);
      expect(alert).not.toHaveBeenCalled();
    });

    test('returns false and shows alert when any field is missing', () => {
      const requiredFields = ['businessName', 'fullName', 'email', 'phone'];

      requiredFields.forEach(field => {
        const originalValue = formMock[field].value;
        formMock[field].value = ''; // Simulate missing field
        const result = validateAndAlert(formMock);
        expect(result).toBe(false);
        expect(alert).toHaveBeenCalledWith(
          "Please fill in all required fields: Business Name, Full Name, Email, and Phone Number."
        );
        formMock[field].value = originalValue; // Restore original value
      });
    });
  });
});

