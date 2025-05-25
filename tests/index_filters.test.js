/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();

jest.mock(
  '../local_artisan/lib/firebaseConfig.js',
  () => ({ db: {} })
);

import '../local_artisan/scripts/index_filters.js';

describe('Product Functionality (single-file)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="middle-content"></div>
      <input class="search-bar" />
      <a data-filter-category="all" class="active"></a>
      <a data-filter-category="electronics"></a>
    `;

    const fs = require('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    fs.collection.mockClear();
    fs.getDocs.mockClear();
    fs.query.mockClear();
    fs.where.mockClear();

    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('displayProducts via window.testing', () => {
    window.testing.displayProducts([
      { id: '1', name: 'Test', price: '99.99', imageUrl: 't.jpg' }
    ]);

    const priceEl = document.querySelector('.product-price');
    expect(priceEl.textContent).toBe('R99.99');
  });

  test('category click calls firestore.where', async () => {
  document.querySelector('[data-filter-category="electronics"]').click();

  await new Promise(resolve => setTimeout(resolve, 100));

  const fs = require('../local_artisan/lib/firebaseConfig.js');
  expect(fs.where).toHaveBeenCalledWith('category', '==', 'electronics');
  }, 10000); // 10 seconds

  test('category click updates active class', () => {
    const allLink = document.querySelector('[data-filter-category="all"]');
    const electronicsLink = document.querySelector('[data-filter-category="electronics"]');

    electronicsLink.click();

    expect(allLink.classList.contains('active')).toBe(false);
    expect(electronicsLink.classList.contains('active')).toBe(true);
  });


  test('search filters cached products', () => {
    window.testing.allProductsCache = [
      { id: '1', name: 'iPhone', category: 'electronics' }
    ];

    window.testing.handleSearch('iphone');
    jest.runAllTimers(); 
    const cards = document.querySelectorAll('.product-card');
    expect(cards.length).toBe(1);
  });
});
