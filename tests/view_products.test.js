/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  // Mock the URL to include a product ID
  const mockUrl = 'http://localhost/product.html?id=abc123';
  delete window.location;
  window.location = new URL(mockUrl);

  // Set up the mock DOM structure
  document.body.innerHTML = `
    <img id="product-image" />
    <h1 id="product-title"></h1>
    <p id="product-description"></p>
    <span id="product-price"></span>
    <button id="add-to-cart"></button>
  `;

  jest.resetModules(); // Ensure a clean import with new DOM and window
});

test('product.js should export URL params, DOM elements, and Firebase config', async () => {
  const {
    urlParams,
    product_image,
    product_title,
    product_description,
    product_price,
    add_to_cart,
    firebaseConfig
  } = await import('./../local_artisan/scripts/view_product.js');

  // URL param
  expect(urlParams).toBeInstanceOf(URLSearchParams);
  expect(urlParams.get('id')).toBe('abc123');

  // DOM elements
  expect(product_image).toBeInstanceOf(HTMLElement);
  expect(product_title).toBeInstanceOf(HTMLElement);
  expect(product_description).toBeInstanceOf(HTMLElement);
  expect(product_price).toBeInstanceOf(HTMLElement);
  expect(add_to_cart).toBeInstanceOf(HTMLElement);

  // Firebase config
  expect(firebaseConfig).toEqual({
    apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
    authDomain: "software-design-project-574a6.firebaseapp.com",
    projectId: "software-design-project-574a6",
  });
});
