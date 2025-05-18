/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  // Set up the mock DOM elements expected in admin.js
  document.body.innerHTML = `
    <section class="seller_applications"></div>
    <section class="active_sellers"></div>
    <section class="product_requests"></div>
    <span id="closeBtn"></button>
  `;

  // Reset modules so the imported file sees the new DOM
  jest.resetModules();
});

test('admin.js should export valid DOM elements', async () => {
  const {
    seller_applications,
    active_sellers,
    product_requests,
    closeBtn
  } = await import('./../local_artisan/scripts/admin.js');

  expect(seller_applications).toBeInstanceOf(HTMLElement);
  expect(active_sellers).toBeInstanceOf(HTMLElement);
  expect(product_requests).toBeInstanceOf(HTMLElement);
  expect(closeBtn).toBeInstanceOf(HTMLElement);
});
