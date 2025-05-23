/**
 * @jest-environment jsdom
 */

beforeEach(async () => {
  // Set up a mock HTML structure
  document.body.innerHTML = `
    <button class="add-btn"></button>
    <form class="add-product"></form>
    <input id="product_name" />
    <input id="price" />
    <input id="weight" />
    <input id="quantity" />
    <select id="categories"></select>
    <textarea id="description"></textarea>
    <input id="image" type="file" />
    <span id="closeBtn"></button>
  `;

  // Reset modules so next import reflects new DOM
  jest.resetModules();
});
// Import all the exports from the module
import {
  addButton,
  form,
  name,
  price,
  weight,
  quantity,
  category,
  description,
  image,
  closeBtn,
  isNameValid,
  isPriceValid,
  isWeightValid,
  isQuantityValid,
  isImageValid,
  isCategoryValid
} from '../local_artisan/scripts/add_product.js'; 

// Test DOM elements
describe('DOM elements', () => {
  test('addButton should be defined', () => {
    expect(addButton).toBeDefined();
  });

  test('form should be defined', () => {
    expect(form).toBeDefined();
  });

  // Add similar tests for other DOM elements
  test('name should be defined', () => {
    expect(name).toBeDefined();
  });

  test('price should be defined', () => {
    expect(price).toBeDefined();
  });

  test('weight should be defined', () => {
    expect(weight).toBeDefined();
  });

  test('quantity should be defined', () => {
    expect(quantity).toBeDefined();
  });

  test('category should be defined', () => {
    expect(category).toBeDefined();
  });

  test('description should be defined', () => {
    expect(description).toBeDefined();
  });

  test('image should be defined', () => {
    expect(image).toBeDefined();
  });

  test('closeBtn should be defined', () => {
    expect(closeBtn).toBeDefined();
  });
});

// Test validation functions
describe('Validation functions', () => {
  describe('isNameValid', () => {
    test('should return true for non-empty strings', () => {
      expect(isNameValid('Valid Name')).toBe(true);
      expect(isNameValid(' A ')).toBe(true);
    });

    test('should return false for empty or non-string values', () => {
      expect(isNameValid('')).toBe(false);
      expect(isNameValid('    ')).toBe(false);
      expect(isNameValid(null)).toBe(false);
      expect(isNameValid(undefined)).toBe(false);
      expect(isNameValid(123)).toBe(false);
    });
  });

  describe('isPriceValid', () => {
    test('should return true for valid prices', () => {
      expect(isPriceValid('10')).toBe(true);
      expect(isPriceValid('10.50')).toBe(true);
      expect(isPriceValid('0.99')).toBe(true);
      expect(isPriceValid('+100')).toBe(true);
    });

    test('should return false for invalid prices', () => {
      expect(isPriceValid('-10')).toBe(false);
      expect(isPriceValid('abc')).toBe(false);
      expect(isPriceValid('10.')).toBe(false);
      expect(isPriceValid('.50')).toBe(false);
      expect(isPriceValid('')).toBe(false);
    });
  });

  describe('isWeightValid', () => {
    test('should return true for valid weights', () => {
      expect(isWeightValid('10')).toBe(true);
      expect(isWeightValid('10.50')).toBe(true);
      expect(isWeightValid('0.99')).toBe(true);
      expect(isWeightValid('+100')).toBe(true);
    });

    test('should return false for invalid weights', () => {
      expect(isWeightValid('-10')).toBe(false);
      expect(isWeightValid('abc')).toBe(false);
      expect(isWeightValid('10.')).toBe(false);
      expect(isWeightValid('.50')).toBe(false);
      expect(isWeightValid('')).toBe(false);
    });
  });

  describe('isQuantityValid', () => {
    test('should return true for valid quantities', () => {
      expect(isQuantityValid('10')).toBe(true);
      expect(isQuantityValid('0')).toBe(true);
      expect(isQuantityValid('+100')).toBe(true);
      expect(isQuantityValid('999')).toBe(true);
    });

    test('should return false for invalid quantities', () => {
      expect(isQuantityValid('-10')).toBe(false);
      expect(isQuantityValid('abc')).toBe(false);
      expect(isQuantityValid('10.5')).toBe(false);
      expect(isQuantityValid('')).toBe(false);
    });
  });

  describe('isImageValid', () => {
    test('should return undefined for invalid image types', () => {
      const invalidImage = { type: 'application/pdf' };
      expect(isImageValid(invalidImage)).toBeUndefined();
      expect(isImageValid(null)).toBeUndefined();
      expect(isImageValid(undefined)).toBeUndefined();
    });

    // Note: This test would need a mock File object with type property
    test('should return undefined for valid image types (implementation returns undefined)', () => {
      // This test shows the current behavior, though you might want to change the function
      const validImage = { type: 'image/jpeg' };
      expect(isImageValid(validImage)).toBeUndefined();
    });
  });

  describe('isCategoryValid', () => {
    test('should return true for valid categories', () => {
      expect(isCategoryValid('Electronics')).toBe(true);
      expect(isCategoryValid('Clothing')).toBe(true);
    });

    test('should return false for invalid categories', () => {
      expect(isCategoryValid('Select Option')).toBe(false);
      expect(isCategoryValid('')).toBe(false);
      expect(isCategoryValid(null)).toBe(false);
      expect(isCategoryValid(undefined)).toBe(false);
    });
  });
});
