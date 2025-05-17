import { db, auth } from '../lib/firebaseConfig.js';
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

let formInitialized = false;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert('User not logged in!');
    }
    else if (user && !formInitialized) {
        formInitialized = true; // to make sure event listener attatches only once so that even when onAuthStateChanged changes, we only add the listener once.
        const form = document.querySelector('.seller-info');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const businessName = document.getElementById('businessName').value;
            const registrationNumber = document.getElementById('registrationNumber').value;
            const vatNumber = document.getElementById('vatNumber').value;
            const  fullName = document.getElementById('fullName').value;
            const  email = document.getElementById('email').value;
            const  phone = document.getElementById('phone').value;
            const  website = document.getElementById('website').value;

            try {
                await addDoc(collection(db, 'seller_applications'), {
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
                window.location.href = '../html/seller_dashboard.html'
            } catch (err) {
                console.error(`Error adding product to database: ${err}`);
            }
        });
    }
});
