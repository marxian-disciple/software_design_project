/**
 * @jest-environment jsdom
 */
import { initSignupForm, initGoogleButton, showUserProfile } from './../local_artisan/scripts/signup.js';

describe('signupHandlers', () => {
    beforeEach(() => {
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

    test('calls onSubmit when passwords match', () => {
        const mockSubmit = jest.fn();
        initSignupForm(mockSubmit);

        document.getElementById('username').value = 'test@example.com';
        document.getElementById('password').value = 'password123';
        document.getElementById('confirm_pass').value = 'password123';

        document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));

        expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    test('does not call onSubmit when passwords do not match', () => {
        const mockSubmit = jest.fn();
        initSignupForm(mockSubmit);

        document.getElementById('username').value = 'test@example.com';
        document.getElementById('password').value = 'pass1';
        document.getElementById('confirm_pass').value = 'pass2';

        document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));

        expect(mockSubmit).not.toHaveBeenCalled();
        expect(document.getElementById('password').value).toBe('');
        expect(document.getElementById('confirm_pass').value).toBe('');
    });

    test('calls onGoogleClick when Google button is clicked', () => {
        const mockGoogleClick = jest.fn();
        initGoogleButton(mockGoogleClick);

        document.querySelector('.google-btn').click();

        expect(mockGoogleClick).toHaveBeenCalled();
    });

    test('updates login icon with profile picture', () => {
        const user = {
            photoURL: 'http://example.com/avatar.jpg'
        };

        showUserProfile(user);

        const img = document.querySelector('.login-icon img');
        expect(img).not.toBeNull();
        expect(img.src).toBe(user.photoURL);
        expect(img.alt).toBe('Profile');
    });
});
