// profileHandlers.js

/**
 * Renders the “seller” profile sections for every matching doc.
 * @param {HTMLElement} container  where to append 
 * @param {Object[]} docs         array of { data: () => {...} } from Firestore
 * @param {Object} user           firebase User object
 */
export function renderProfiles(container, docs, user) {
  let found = false;

  docs.forEach(doc => {
    const data = doc.data();
    if (data.userId === user.uid) {
      const html = `
        <form action="#" class="shop-info">
            <section class="info">
                <!-- logo + header omitted for brevity -->
                <section class="input-group">
                    <label for="businessName" style="color: #231942;">My Business Name</label><br>
                    <input id="businessName" name="businessName" type="text" placeholder="${data.businessName || 'N/A'}" required><br><br>
                </section>

                <section class="input-group">
                    <label for="owner" style="color: #231942;">Owner</label><br>
                    <input id="owner" name="owner" type="text" placeholder="${data.fullName || 'N/A'}" required><br><br>
                </section>

                <section class="input-group">
                    <label for="email" style="color: #231942;">My Email</label><br>
                    <input id="email" name="email" type="text" placeholder="${data.email || user.email}" required style="width: 200%;"><br><br>
                </section>

                <section class="input-group">
                    <label for="phone" style="color: #231942;">My Phone Number</label><br>
                    <input id="phone" name="phone" type="text" placeholder="${data.phone || 'N/A'}" required style="width: 200%;"><br><br>
                </section>

                <section class="input-group">
                    <label for="vat" style="color: #231942;">My VAT Number</label><br>
                    <input id="vat" name="vat" type="text" placeholder="${data.vatNumber || 'N/A'}" style="width: 200%;"><br><br>
                </section>

                <section class="input-group">
                    <label for="website" style="color: #231942;">My Business Website</label><br>
                    <input id="website" name="website" type="text" placeholder="${data.website || 'N/A'}" style="width: 200%;"><br><br>
                </section>

                <button type="submit" class="btn">Submit Changes</button>
                </section>
        </form>
      `;
      container.appendChild(
        document.createRange().createContextualFragment(html)
      );
      found = true;

      const form = document.querySelector('.shop-info');
      let validationFunctions;
      initializeShopUpdate(form, validationFunctions);

    }
  });
}

/**
 * Renders a “must be logged in” message.
 */
export function renderNotLoggedIn(container) {
  container.innerHTML = `<p>You must be logged in to view this page.</p>`;
}

/**
 * Renders a “load failed” message.
 */
export function renderError(container) {
  container.innerHTML = `<p>Failed to load shop profile.</p>`;
}

/**
 * Wire up a close button that calls your callback.
 */
export function initCloseButton(onClose) {
  const btn = document.getElementById("closeBtn");
  if (btn) btn.addEventListener("click", onClose);
}

// local_artisan/scripts/seller_registration.js

export function isEmailValid(email) {
  // Simple email regex that checks for basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isPhoneValid(phone) {
  // South African phone number regex:
  // - Optional +27 or 0 followed by 2 digits and 7 more digits
  // - Or 27 followed by 2 digits and 7 more digits
  const phoneRegex = /^(\+27\d{9}|0\d{9}|27\d{9})$/;
  return phoneRegex.test(phone);
}

export function areRequiredFieldsFilled(form) {
  // Check if all required fields have non-empty values
  return (
    form.businessName.value.trim() !== '' &&
    form.owner.value.trim() !== '' &&
    form.email.value.trim() !== '' &&
    form.phone.value.trim() !== ''
  );
}

export function validateAndAlert(form) {
  if (!form.businessName.value || !form.owner.value || 
      !form.email.value || !form.phone.value) {
    alert("Please fill in all required fields: Business Name, Full Name, Email, and Phone Number.");
    return false;
  }
  return true;
}