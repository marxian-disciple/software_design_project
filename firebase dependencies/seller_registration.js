// seller_firebase.js
function initializeSellerRegistration(form, validationFunctions) {
    let formInitialized = false;

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            alert('User not logged in!');
        } else if (user && !formInitialized) {
            formInitialized = true;
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Get form values
                var formData = {
                    businessName: document.getElementById('businessName').value.trim(),
                    registrationNumber: document.getElementById('registrationNumber').value.trim(),
                    vatNumber: document.getElementById('vatNumber').value.trim(),
                    fullName: document.getElementById('fullName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    website: document.getElementById('website').value.trim()
                };

                // Validate form
                if (!validationFunctions.validateAndAlert(formData)) {
                    return;
                }

                if (!validationFunctions.isEmailValid(formData.email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                if (!validationFunctions.isPhoneValid(formData.phone)) {
                    alert("Please enter a valid South African phone number (e.g. 0812345678 or +27812345678).");
                    return;
                }

                // Submit to Firestore
                try {
                    await firebase.firestore().collection('seller_applications').add({
                        userId: user.uid,
                        businessName: formData.businessName,
                        registrationNumber: formData.registrationNumber,
                        vatNumber: formData.vatNumber,
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        website: formData.website,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    alert('Your request to become a seller has been successfully sent to an admin! Please wait for 2-3 working days for the approval of your request. In the meantime, please visit our page "Sell on Artify" for more information. Thank you for your patience.');
                    window.location.href = '../html/seller_dashboard.html';
                } catch (err) {
                    console.error('Error adding seller to database:', err);
                    alert('Something went wrong while submitting the form. Please try again.');
                }
            });
        }
    });
}
