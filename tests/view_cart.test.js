/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  // Corrected mock DOM
  document.body.innerHTML = `
    <button class="decrement-button"></button>
    <button class="increment-button"></button>
    <section class="remove-button"></section>
    <section id="cart-items"></section>
    <section id="cart-total"></section>
  `;

  jest.resetModules();
});

test('cart.js should export valid DOM elements and Firebase config', async () => {
  const {
    decrement_button,
    increment_button,
    remove_button,
    cartItemsContainer,
    cartTotalContainer,
    firebaseConfig
  } = await import('./../local_artisan/scripts/view_cart.js');

  expect(decrement_button).toBeInstanceOf(NodeList);
  expect(decrement_button.length).toBe(1);

  expect(increment_button).toBeInstanceOf(NodeList);
  expect(increment_button.length).toBe(1);

  expect(remove_button).toBeInstanceOf(NodeList);
  expect(remove_button.length).toBe(1);

  expect(cartItemsContainer).toBeInstanceOf(HTMLElement);
  expect(cartTotalContainer).toBeInstanceOf(HTMLElement);

  expect(firebaseConfig).toEqual({
    apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
    authDomain: "software-design-project-574a6.firebaseapp.com",
    projectId: "software-design-project-574a6",
  });
});
