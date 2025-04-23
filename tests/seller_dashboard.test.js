/**
 * @jest-environment jsdom
 */

describe("seller_dashboard.js", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <span id="user-name"></span>
        <img id="user-photo" />
      `;
    });
  
    test("displays user info from localStorage", () => {
      localStorage.setItem("userName", "Test User");
      localStorage.setItem("userPhoto", "photo.jpg");
  
      require('../local_artisan/scripts/seller_dashboard');
      window.dispatchEvent(new Event("DOMContentLoaded"));
  
      const nameEl = document.getElementById("user-name");
      const photoEl = document.getElementById("user-photo");
  
      expect(nameEl.textContent).toBe("Test User");
      expect(photoEl.src).toContain("photo.jpg");
    });
  
    test("uses default values when localStorage is empty", () => {
      localStorage.clear(); // remove values
  
      require('../local_artisan/scripts/seller_dashboard');
      window.dispatchEvent(new Event("DOMContentLoaded"));
  
      const nameEl = document.getElementById("user-name");
      const photoEl = document.getElementById("user-photo");
  
      expect(nameEl.textContent).toBe("User");
      expect(photoEl.src).toContain("default.jpg");
    });
  });
  