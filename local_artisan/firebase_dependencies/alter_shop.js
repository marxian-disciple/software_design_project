import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, addDoc, query, where, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db, storage } from '../lib/firebaseConfig.js';
import { isEmailValid, isPhoneValid, validateAndAlert } from '../scripts/alter_shop.js';

import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton
} from "./../scripts/alter_shop.js";

const body = document.querySelector("body");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    renderNotLoggedIn(body);
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "sellers"));
    renderProfiles(body, snapshot.docs, user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    renderError(body);
  }
});

initCloseButton(() => {
  window.location.href = "./shop_info.html";
});

function initializeShopUpdate(form, validationFunctions) {
    let formInitialized = false;

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert('Please log in first!');
            window.location.href = './../html/signup.html';
            return;
        }

        if (!formInitialized) {
            formInitialized = true;

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Validate form
                if (!validateAndAlert(form)) return;

                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                const owner = form.owner.value.trim();
                const businessName = form.businessName.value.trim();
                const vat = form.vat.value.trim();
                const website = form.website.value.trim();

                // Check for valid email
                if (!isEmailValid(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                // Check for valid phone number
                if (!isPhoneValid(phone)) {
                    alert("Please enter a valid South African phone number.");
                    return;
                }

                // Submit changes to Firestore
                const sellerQuery = query(collection(db, 'sellers'), where('userId', '==', user.uid));
                const snapshot = await getDocs(sellerQuery);

                if (!snapshot.empty) {
                    const sellerDoc = snapshot.docs[0]; // assuming there’s only one document per user
                    const sellerRef = doc(db, 'sellers', sellerDoc.id);

                    await updateDoc(sellerRef, {
                        businessName: businessName,
                        vatNumber: vat,
                        fullName: owner,
                        email: email,
                        phone: phone,
                        website: website
                    });

                    alert('Your information has been successfully updated!');
                    window.location.href = '../html/seller_dashboard.html';
                } else {
                    alert('No seller information found for this user.');
                }
            });
        }
    });
}

// Make available globally
if (typeof window !== 'undefined') {
    window.initializeShopUpdate = initializeShopUpdate;
}

// Node.js/test environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeShopUpdate
    };
}