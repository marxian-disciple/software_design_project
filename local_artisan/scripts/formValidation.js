function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPhoneValid(phone) {
  const phoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
  return phoneRegex.test(phone);
}

function areRequiredFieldsFilled(form) {
  const requiredFields = ['businessName', 'fullName', 'email', 'phone'];
  return requiredFields.every(field => form[field]?.value.trim() !== '');
}

module.exports = { isEmailValid, isPhoneValid, areRequiredFieldsFilled };
