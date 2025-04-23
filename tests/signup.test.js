import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => {}),
  getAuth: jest.fn().mockReturnValue({}),
  signInWithPopup: jest.fn().mockResolvedValue({
    user: { displayName: 'Test User', email: 'test@example.com' }
  }),
}));

// Global mocks
global.alert = jest.fn();
jest.spyOn(console, 'error').mockImplementation(() => {}); // <-- moved here!

describe('Google Sign-In', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  it('should trigger Google sign-in when the button is clicked', async () => {
    document.body.innerHTML = `<button class="google-btn">Sign in with Google</button>`;
    require('../local_artisan/scripts/signup');

    const googleBtn = document.querySelector('.google-btn');
    googleBtn.click();

    await new Promise(resolve => setTimeout(resolve, 0)); // To ensure async operations complete

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith('Welcome, Test User!');
    expect(window.location.href).toBe('../html/seller_dashboard.html');
  });

  it('should handle Google sign-in errors', async () => {
    // Make sign-in fail (simulating error)
    signInWithPopup.mockRejectedValueOnce(new Error('Popup failed'));

    document.body.innerHTML = `<button class="google-btn">Sign in with Google</button>`;
    require('../local_artisan/scripts/signup'); // Ensure script reload after mock setup

    const googleBtn = document.querySelector('.google-btn');
    googleBtn.click();

    // Wait for async code to finish
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(signInWithPopup).toHaveBeenCalled(); // Ensure function was called
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Google Sign-In Error:"),  // Check if the error message contains this string
      expect.any(Error)  // Verify it's an Error instance
    );
    expect(alert).toHaveBeenCalledWith("Failed to sign in with Google.");
  });
});