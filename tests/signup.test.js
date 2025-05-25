/**
 * @jest-environment jsdom
 */

const {
    initSignupForm,
    initGoogleButton,
    showUserProfile,
    initForgotPasswordLink
} = require('../local_artisan/scripts/signup.js');

describe('Auth Form Functions', () => {
    let mockSubmitHandler, mockGoogleClickHandler;
    
    beforeEach(() => {
        document.body.innerHTML = `
            <form class="login-form">
                <input id="email" value="test@example.com">
                <input id="password" type="password" value="password123">
                <input id="confirm_pass" type="password" value="password123">
            </form>
            <button class="google-btn">Google</button>
            <div class="login-icon"></div>
            <div class="forgot-password"><a href="/reset">Forgot?</a></div>
        `;

        mockSubmitHandler = jest.fn();
        mockGoogleClickHandler = jest.fn();
        
        // Mock timers and alerts
        jest.useFakeTimers();
        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('initSignupForm', () => {
        test('should handle form submission with matching passwords', async () => {
            initSignupForm(mockSubmitHandler);
            document.querySelector('.login-form').dispatchEvent(new Event('submit'));
            
            expect(mockSubmitHandler).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        test('should handle password mismatch', async () => {
            document.getElementById('confirm_pass').value = 'wrongpassword';
            
            initSignupForm(mockSubmitHandler);
            document.querySelector('.login-form').dispatchEvent(new Event('submit'));
            
            expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
            expect(document.getElementById('password').style.border).toBe('2px solid red');
            expect(document.getElementById('confirm_pass').style.border).toBe('2px solid red');
            
            // Test timeout clearance
            jest.advanceTimersByTime(2000);
            expect(document.getElementById('password').style.border).toBe('');
            expect(document.getElementById('confirm_pass').style.border).toBe('');
        });
    });

    describe('initGoogleButton', () => {
        test('should attach click handler to google button', () => {
            initGoogleButton(mockGoogleClickHandler);
            document.querySelector('.google-btn').click();
            expect(mockGoogleClickHandler).toHaveBeenCalled();
        });

        test('should warn if google button is missing', () => {
            document.querySelector('.google-btn').remove();
            jest.spyOn(console, 'warn');
            initGoogleButton(mockGoogleClickHandler);
            expect(console.warn).toHaveBeenCalledWith('Google button not found in the DOM.');
        });
    });

    describe('showUserProfile', () => {
        test('should update login icon with user photo', () => {
            const user = { photoURL: 'https://example.com/avatar.jpg' };
            showUserProfile(user);
            
            const img = document.querySelector('.login-icon img');
            expect(img.src).toBe(user.photoURL);
            expect(img.alt).toBe('Profile');
        });

        test('should handle missing photoURL', () => {
            const initialHTML = document.querySelector('.login-icon').innerHTML;
            showUserProfile({});
            expect(document.querySelector('.login-icon').innerHTML).toBe(initialHTML);
        });
    });

});