function initializeSellerRegistration(form, validationFunctions) {
    let formInitialized = false;

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            alert('Please log in first!');
            window.location.href = '../html/login.html';
            return;
        }

        if (!formInitialized) {
            formInitialized = true;
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Validate form
                if (!validationFunctions.validateAndAlert(form)) return;
                
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                
                if (!validationFunctions.isEmailValid(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                if (!validationFunctions.isPhoneValid(phone)) {
                    alert("Please enter a valid South African phone number.");
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
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        status: "pending"
                    });

                    alert('Application submitted successfully!');
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
