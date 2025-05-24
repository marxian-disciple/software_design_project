/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();

//
// 1) First mock out your local firebaseConfig.js so that `db` is a plain object
//
jest.mock(
  '../local_artisan/lib/firebaseConfig.js',
  () => ({ db: {} })
);

//
// 2) Now require the script under test.  Because of moduleNameMapper,
//    Jest will swap out the CDN import for your __mocks__/firebase‑firestore.js.
//
require('../local_artisan/scripts/index_filters.js');

describe('Product Functionality (single-file)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="middle-content"></div>
      <input class="search-bar" />
      <a data-filter-category="all" class="active"></a>
      <a data-filter-category="electronics"></a>
    `;

    // clear any previous mock calls
    const fs = require('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    fs.collection.mockClear();
    fs.getDocs.mockClear();
    fs.query.mockClear();
    fs.where.mockClear();

    // fire DOMContentLoaded so your script initializes
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

  // give the event‐handler’s async function a chance to run its awaits
  await new Promise(resolve => setTimeout(resolve, 0));

  const fs = require('https://www.gstatic.com/firebasejs/10.12.0/firebase‑firestore.js');
  expect(fs.where).toHaveBeenCalledWith('category', '==', 'electronics');
});
  test('category click updates active class', () => {
    const allLink = document.querySelector('[data-filter-category="all"]');
    const electronicsLink = document.querySelector('[data-filter-category="electronics"]');

    electronicsLink.click();

    expect(allLink.classList.contains('active')).toBe(false);
    expect(electronicsLink.classList.contains('active')).toBe(true);
  });


  test('search filters cached products', () => {
    // prime the cache
    window.testing.allProductsCache = [
      { id: '1', name: 'iPhone', category: 'electronics' }
    ];

    window.testing.handleSearch('iphone');
    jest.runAllTimers(); // assume you used fake timers for debounce
    const cards = document.querySelectorAll('.product-card');
    expect(cards.length).toBe(1);
  });
});
