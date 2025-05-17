import { db, auth } from '../lib/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let formInitialized = false;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert('User not logged in!');
    } else if (user && !formInitialized) {
        formInitialized = true; // ensure listener is only attached once
        const form = document.querySelector('.seller-info');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const businessName = document.getElementById('businessName').value.trim();
            const registrationNumber = document.getElementById('registrationNumber').value.trim();
            const vatNumber = document.getElementById('vatNumber').value.trim();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const website = document.getElementById('website').value.trim();

            // ✅ Required Fields Validation
            if (!businessName || !fullName || !email || !phone) {
                alert("Please fill in all required fields: Business Name, Full Name, Email, and Phone Number.");
                return;
            }

            // ✅ Email Format Validation
            function isEmailValid(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            // ✅ South African Phone Number Format Validation
            const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
            if (!phoneRegex.test(phone)) {
                alert("Please enter a valid South African phone number (e.g. 0812345678 or +27812345678).");
                return;
            }

            // Submit to Firestore
            try {
                await addDoc(collection(db, 'sellers'), {
                    userId: user.uid,
                    businessName,
                    registrationNumber,
                    vatNumber,
                    fullName,
                    email,
                    phone,
                    website,
                    createdAt: new Date()
                });

                alert('Seller added successfully!');
                window.location.href = '../html/seller_dashboard.html';
            } catch (err) {
                console.error(`Error adding seller to database: ${err}`);
                alert('Something went wrong while submitting the form. Please try again.');
            }
        });
    }
});
