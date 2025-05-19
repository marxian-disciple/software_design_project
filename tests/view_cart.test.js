/**
 * @jest-environment jsdom
 */

test('cart.js should export valid DOM elements and Firebase config', async () => {
  const {
    firebaseConfig
  } = await import('./../local_artisan/scripts/view_cart.js');

  expect(firebaseConfig).toEqual({
    apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
    authDomain: "software-design-project-574a6.firebaseapp.com",
    projectId: "software-design-project-574a6",
  });
});
