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
        <section class="info">
          <!-- logo + header omitted for brevity -->
          <strong>My Full Name: ${data.fullName || user.displayName || user.email}</strong><br>
          <p class="business-name"><strong>My Business Name:</strong> ${data.businessName || 'N/A'}</p><br>
          <p class="created-at"><strong>Created At:</strong> ${data.createdAt?.toDate().toLocaleString() || 'N/A'}</p><br>
          <p class="email"><strong>My Email:</strong> ${data.email || user.email}</p><br>
          <p class="reg-number"><strong>My Registration Number:</strong> ${data.registrationNumber || 'N/A'}</p><br>
          <p class="phone"><strong>My Phone:</strong> ${data.phone || 'N/A'}</p><br>
          <p class="user-id"><strong>My UserID:</strong> ${data.userId}</p><br>
          <p class="vat-number"><strong>My VAT Number:</strong> ${data.vatNumber || 'N/A'}</p><br>
          <p class="website"><strong>My Business Website:</strong> ${data.website || 'N/A'}</p><br>
        </section>
      `;
      container.appendChild(
        document.createRange().createContextualFragment(html)
      );
      found = true;
    }
  });

  if (!found) {
    const fallback = `
      <section class="info">
        <strong>User Name: ${user.displayName || 'No display name'}</strong><br>
        <p><strong>Email:</strong> ${user.email}</p>
      </section>
    `;
    container.appendChild(
      document.createRange().createContextualFragment(fallback)
    );
  }
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
  container.innerHTML = `<p>Failed to load user profile.</p>`;
}

/**
 * Wire up a close button that calls your callback.
 */
export function initCloseButton(onClose) {
  const btn = document.getElementById("closeBtn");
  if (btn) btn.addEventListener("click", onClose);
}
