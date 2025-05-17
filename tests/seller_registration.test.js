/**
 * @jest-environment jsdom
 */

import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebaseConfig';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn()
}));

jest.mock('../lib/firebaseConfig', () => ({
  db: {},
  auth: {}
}));

// Load the script manually
beforeEach(() => {
  document.body.innerHTML = `
    <form class="seller-info">
      <input id="businessName" value="Biz Inc" />
      <input id="registrationNumber" value="12345" />
      <input id="vatNumber" value="56789" />
      <input id="fullName" value="John Doe" />
      <input id="email" value="test@example.com" />
      <input id="phone" value="0812345678" />
      <input id="website" value="https://example.com" />
      <button type="submit">Submit</button>
    </form>
  `;
  jest.resetModules(); // Reset the module cache
});

test('should alert when user not logged in', () => {
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  onAuthStateChanged.mockImplementation((auth, callback) => callback(null));
  require('../local_artisan/scripts/seller_registration');
  expect(alertMock).toHaveBeenCalledWith('User not logged in!');
});

test('should set formInitialized and attach event listener once', () => {
  const user = { uid: 'user123' };
  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  form.dispatchEvent(event);

  expect(event.preventDefault).toHaveBeenCalled();
});

test('should validate required fields', () => {
  document.getElementById('businessName').value = '';
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const user = { uid: 'user123' };
  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  form.dispatchEvent(event);

  expect(alertMock).toHaveBeenCalledWith(
    'Please fill in all required fields: Business Name, Full Name, Email, and Phone Number.'
  );
});

test('should validate email format', () => {
  document.getElementById('email').value = 'invalid-email';
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const user = { uid: 'user123' };
  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  form.dispatchEvent(event);

  expect(alertMock).toHaveBeenCalledWith(
    'Please enter a valid email address.'
  );
});

test('should validate South African phone format', () => {
  document.getElementById('phone').value = '12345';
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const user = { uid: 'user123' };
  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  form.dispatchEvent(event);

  expect(alertMock).toHaveBeenCalledWith(
    'Please enter a valid South African phone number (e.g. 0812345678 or +27812345678).'
  );
});

test('should add seller to Firestore and redirect', async () => {
  const mockAddDoc = addDoc.mockResolvedValue({});
  const user = { uid: 'user123' };
  delete window.location;
  window.location = { href: '' };

  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  await form.dispatchEvent(event);

  expect(mockAddDoc).toHaveBeenCalled();
  expect(window.location.href).toContain('seller_dashboard.html');
});

test('should handle Firestore submission error', async () => {
  addDoc.mockRejectedValue(new Error('Firestore failed'));
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  const consoleMock = jest.spyOn(console, 'error').mockImplementation();

  const user = { uid: 'user123' };
  onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

  require('../local_artisan/scripts/seller_registration');

  const form = document.querySelector('.seller-info');
  const event = new Event('submit');
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });

  await form.dispatchEvent(event);

  expect(consoleMock).toHaveBeenCalledWith(
    expect.stringContaining('Error adding seller to database:')
  );
  expect(alertMock).toHaveBeenCalledWith(
    'Something went wrong while submitting the form. Please try again.'
  );
});
