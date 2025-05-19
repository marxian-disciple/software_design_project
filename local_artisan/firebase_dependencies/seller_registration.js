function initializeSellerRegistration(form, validationFunctions) {
    let formInitialized = false;

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            alert('User not logged in!');
        } else if (user && !formInitialized) {
            formInitialized = true;
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Validate form - pass the actual form element
                if (!validationFunctions.validateAndAlert(form)) {
                    return;
                }

                // Validate email and phone
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();

                if (!validationFunctions.isEmailValid(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                if (!validationFunctions.isPhoneValid(phone)) {
                    alert("Please enter a valid South African phone number (e.g. 0812345678 or +27812345678).");
                    return;
                }

                // Submit to Firestore
                try {
                    await firebase.firestore().collection('seller_applications').add({
                        userId: user.uid,
                        businessName: form.businessName.value.trim(),
                        registrationNumber: form.registrationNumber.value.trim(),
                        vatNumber: form.vatNumber.value.trim(),
                        fullName: form.fullName.value.trim(),
                        email: email,
                        phone: phone,
                        website: form.website.value.trim(),
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    alert('Your request has been successfully sent!');
                    window.location.href = '../html/seller_dashboard.html';
                } catch (err) {
                    console.error('Error:', err);
                    alert('Submission failed. Please try again.');
                }
            });
        }
    });
}

// Make available globally
window.initializeSellerRegistration = initializeSellerRegistration;
