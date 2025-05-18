// ✅ Mock all Firebase dependencies
jest.mock('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => callback(null)), // Simulate user not logged in
}));

jest.mock('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js', () => ({
  ref: () => {},
  uploadBytes: () => Promise.resolve(),
  getDownloadURL: () => Promise.resolve('mock-url'),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', () => ({
  collection: () => {},
  addDoc: () => Promise.resolve(),
}));

jest.mock('./../local_artisan/lib/firebaseConfig.js', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// ✅ Import the real initializeForm
import { initializeForm } from './../local_artisan/fb_scripts/add_product.js';

describe('initializeForm basic', () => {
  beforeEach(() => {
    // Minimal DOM setup (only needed if your code uses querySelector)
    document.body.innerHTML = `
      <form class="add-product">
        <button class="add-btn">Add</button>
        <input id="product_name" />
        <input id="price" />
        <input id="weight" />
        <input id="quantity" />
        <select id="categories"><option selected>Test</option></select>
        <textarea id="description"></textarea>
        <input type="file" id="image" />
      </form>
    `;
  });

  it('should run without throwing errors', () => {
    expect(() => initializeForm()).not.toThrow();
  });
});
