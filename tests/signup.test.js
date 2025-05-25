/**
 * @jest-environment jsdom
 */
import { initSignupForm, initGoogleButton, showUserProfile } from '../local_artisan/scripts/signup.js';

describe('signupHandlers (100% coverage)', () => {
  // Polyfill global alert and console.warn
  beforeAll(() => {
    global.alert = jest.fn();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <form class="login-form">
        <input id="username" />
        <input id="password" />
        <input id="confirm_pass" />
        <button type="submit">Sign Up</button>
      </form>
      <button class="google-btn">Google</button>
      <div class="login-icon"></div>
    `;
  });

  afterAll(() => {
    jest.useRealTimers();
    console.warn.mockRestore();
  });

  test('initSignupForm does nothing if form is missing', () => {
    document.body.innerHTML = '<div></div>';  // no .login-form
    const fn = jest.fn();
    expect(() => initSignupForm(fn)).not.toThrow();
    // simulate submit anyway
    document.body.dispatchEvent(new Event('submit'));
    expect(fn).not.toHaveBeenCalled();
  });

  test('calls onSubmit when passwords match', () => {
    const mockSubmit = jest.fn();
    initSignupForm(mockSubmit);

    document.getElementById('username').value = 'a@b.com';
    document.getElementById('password').value = 'pwd';
    document.getElementById('confirm_pass').value = 'pwd';

    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockSubmit).toHaveBeenCalledWith('a@b.com', 'pwd');
    expect(global.alert).not.toHaveBeenCalled();
  });

  test('shows alert + red borders + resets fields then clears styling on mismatch', () => {
    jest.useFakeTimers();
    const mockSubmit = jest.fn();
    initSignupForm(mockSubmit);

    // set initial values
    const pw = document.getElementById('password');
    const cpw = document.getElementById('confirm_pass');
    pw.value = 'one';
    cpw.value = 'two';

    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));

    // verify alert
    expect(global.alert).toHaveBeenCalledWith("Passwords do not match!");
    // verify submit not called
    expect(mockSubmit).not.toHaveBeenCalled();
    // values cleared
    expect(pw.value).toBe('');
    expect(cpw.value).toBe('');
    // red borders applied
    expect(pw.style.border).toBe('2px solid red');
    expect(cpw.style.border).toBe('2px solid red');

    // fast-forward 2 seconds
    jest.advanceTimersByTime(2000);
    expect(pw.style.border).toBe('');
    expect(cpw.style.border).toBe('');
  });

  test('initGoogleButton does nothing & warns if button missing', () => {
    document.body.innerHTML = '<div></div>';  // remove .google-btn
    const fn = jest.fn();
    initGoogleButton(fn);
    expect(console.warn).toHaveBeenCalledWith('Google button not found in the DOM.');
    // no click possible
  });

  test('calls onGoogleClick when Google button clicked', () => {
    const mockGoogle = jest.fn();
    initGoogleButton(mockGoogle);

    document.querySelector('.google-btn').click();
    expect(mockGoogle).toHaveBeenCalled();
  });

  test('showUserProfile inserts image when photoURL present', () => {
    const user = { photoURL: 'https://x/y.png' };
    showUserProfile(user);

    const img = document.querySelector('.login-icon img');
    expect(img).toBeTruthy();
    expect(img.src).toBe(user.photoURL);
    expect(img.alt).toBe('Profile');
  });

  test('showUserProfile does nothing if no photoURL', () => {
    document.querySelector('.login-icon').innerHTML = '<p>old</p>';
    showUserProfile({});  // user.photoURL undefined
    // innerHTML remains unchanged
    expect(document.querySelector('.login-icon').innerHTML).toBe('<p>old</p>');
  });
});
