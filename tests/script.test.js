/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file if your code is in a separate HTML file
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Form Interaction Tests', () => {
  let form;
  let productTypes;
  let categories;
  let charCounter;

  beforeAll(() => {
    document.documentElement.innerHTML = html;
    
    // Initialize the DOM elements and event listeners
    require('./your-script-file.js'); // Replace with your actual script file name
    
    // Get references to the elements
    form = document.querySelector("form");
    productTypes = document.getElementById("productTypes");
    categories = document.getElementById("categories");
    charCounter = productTypes.parentNode.querySelector("small");
  });

  beforeEach(() => {
    // Reset form before each test
    form.reset();
    charCounter.textContent = "";
  });

  describe('Character Counter', () => {
    test('should display character count when typing in productTypes', () => {
      const testText = "Test product";
      productTypes.value = testText;
      
      // Trigger input event
      const event = new Event('input');
      productTypes.dispatchEvent(event);
      
      expect(charCounter.textContent).toBe(`${testText.length} characters`);
    });

    test('should update character count when text changes', () => {
      productTypes.value = "Initial";
      productTypes.dispatchEvent(new Event('input'));
      expect(charCounter.textContent).toBe("6 characters");
      
      productTypes.value = "Updated text";
      productTypes.dispatchEvent(new Event('input'));
      expect(charCounter.textContent).toBe("11 characters");
    });
  });

  describe('Category Selection Limit', () => {
    test('should allow selecting up to 3 categories', () => {
      // Select 3 categories
      for (let i = 0; i < 3; i++) {
        categories.options[i].selected = true;
      }
      
      const event = new Event('change');
      categories.dispatchEvent(event);
      
      const selected = [...categories.options].filter(option => option.selected);
      expect(selected.length).toBe(3);
    });

    test('should prevent selecting more than 3 categories', () => {
      // Mock alert
      window.alert = jest.fn();
      
      // Try to select 4 categories
      for (let i = 0; i < 4; i++) {
        categories.options[i].selected = true;
      }
      
      const event = new Event('change');
      categories.dispatchEvent(event);
      
      const selected = [...categories.options].filter(option => option.selected);
      expect(selected.length).toBe(3);
      expect(window.alert).toHaveBeenCalledWith("You can only select up to 3 categories.");
    });
  });

  describe('Form Submission', () => {
    test('should show confirmation alert and reset form on submission', () => {
      // Mock alert
      window.alert = jest.fn();
      
      // Set some values
      productTypes.value = "Test product";
      categories.options[0].selected = true;
      
      // Trigger form submission
      const event = new Event('Submit Application');
      form.dispatchEvent(event);
      
      // Check if default behavior was prevented
      expect(event.defaultPrevented).toBe(true);
      
      // Check if alert was shown
      expect(window.alert).toHaveBeenCalledWith("Thank you! Your application has been submitted.");
      
      // Check if form was reset
      expect(productTypes.value).toBe("");
      expect([...categories.options].filter(opt => opt.selected).length).toBe(0);
      
      // Check if character counter was cleared
      expect(charCounter.textContent).toBe("");
    });
  });
});