// local_artisan/scripts/seller_registration.js

function isEmailValid(email) {
  // Simple email regex that checks for basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPhoneValid(phone) {
  // South African phone number regex:
  // - Optional +27 or 0 followed by 2 digits and 7 more digits
  // - Or 27 followed by 2 digits and 7 more digits
  const phoneRegex = /^(\+27\d{9}|0\d{9}|27\d{9})$/;
  return phoneRegex.test(phone);
}

function areRequiredFieldsFilled(form) {
  // Check if all required fields have non-empty values
  return (
    form.businessName.value.trim() !== '' &&
    form.fullName.value.trim() !== '' &&
    form.email.value.trim() !== '' &&
    form.phone.value.trim() !== ''
  );
}

function validateAndAlert(form) {
  if (!form.businessName.value || !form.fullName.value || 
      !form.email.value || !form.phone.value) {
    alert("Please fill in all required fields: Business Name, Full Name, Email, and Phone Number.");
    return false;
  }
  return true;
}

module.exports = {
  isEmailValid,
  isPhoneValid,
  areRequiredFieldsFilled,
  validateAndAlert
};
