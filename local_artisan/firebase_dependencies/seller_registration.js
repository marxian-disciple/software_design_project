import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db, storage } from '../lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {isEmailValid, isPhoneValid, validateAndAlert } from '../scripts/seller_registration.js'

function initializeSellerRegistration(form, validationFunctions) {
    validationFunctions = { isEmailValid: isEmailValid, isPhoneValid: isPhoneValid, validateAndAlert: validateAndAlert};
    let formInitialized = false;

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert('Please log in first!');
            window.location.href = '../html/login.html';
            return;
        }

        if (!formInitialized) {
            formInitialized = true;
            
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Validate form
                if (!validationFunctions.validateAndAlert(form)) return;
                
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                
                // Check for valid email
                if (!validationFunctions.isEmailValid(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                // Check for valid phone number
                if (!validationFunctions.isPhoneValid(phone)) {
                    alert("Please enter a valid South African phone number.");
                    return;
                }

                // Submit to Firestore
                try {
                    await addDoc(collection(db, 'seller_applications'), {
                        userId: user.uid,
                        businessName: form.businessName.value.trim(),
                        registrationNumber: form.registrationNumber.value.trim(),
                        vatNumber: form.vatNumber.value.trim(),
                        fullName: form.fullName.value.trim(),
                        email: email,
                        phone: phone,
                        website: form.website.value.trim(),
                        createdAt: new Date(),
                        status: "pending"
                    });

                     alert('Your request to become a seller has been successfully sent to an admin! Please wait for 2-3 working days for the approval of your request. In the meantime, please visit our page "Sell on Artify" for more information. Thank you for your patience.');
                    window.location.href = '../html/seller_dashboard.html';
                } catch (error) {
                    console.error("Error submitting:", error);
                    alert('Submission failed. Please try again.');
                }
            });
        }
    });
}

// Make available globally
if (typeof window !== 'undefined') {
    window.initializeSellerRegistration = initializeSellerRegistration;
}

// Node.js/test environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSellerRegistration
    };
}
