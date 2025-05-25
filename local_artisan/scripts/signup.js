export function initSignupForm(onSubmit) {
    const signupForm = document.querySelector('.login-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPass = document.getElementById('confirm_pass').value;

        if (password !== confirmPass) {
            alert("Passwords do not match!");
            const passField = document.getElementById('password');
            const confirmField = document.getElementById('confirm_pass');
            passField.value = '';
            confirmField.value = '';
            passField.style.border = '2px solid red';
            confirmField.style.border = '2px solid red';

            setTimeout(() => {
                passField.style.border = '';
                confirmField.style.border = '';
            }, 2000);
            return;
        }

        // Password strength check
        const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{7,}$/;
        if (!strongPasswordRegex.test(password)) {
            alert("Password must be more than 6 characters long and contain at least one letter and one number.");
            return;
        }

        onSubmit(email, password);
    });
}

export function initGoogleButton(onGoogleClick) {
    const googleBtn = document.querySelector('.google-btn');
    if (!googleBtn) {
        console.warn('Google button not found in the DOM.');
        return;
    }

    googleBtn.addEventListener('click', onGoogleClick);
}

export function showUserProfile(user) {
    const loginIcon = document.querySelector(".login-icon");
    if (loginIcon && user.photoURL) {
        loginIcon.innerHTML = `
            <img src="${user.photoURL}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
        `;
    }
}

export function initForgotPasswordLink() {
    const forgotLink = document.querySelector(".forgot-password a");
    if (!forgotLink) return;

    forgotLink.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Please use Google to reset your password!.");
    });
}
