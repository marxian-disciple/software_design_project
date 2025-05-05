describe('UAT 1: View Cart with Items', () => {
  let dom, document;

  beforeEach((done) => {
    // Mock localStorage before DOM loads
    global.localStorage = {
      getItem: jest.fn(() =>
        JSON.stringify([
          {
            id: '1',
            name: 'Handmade Mug',
            price: 100,
            quantity: 2,
            image: 'mug.jpg',
          },
        ])
      ),
      setItem: jest.fn(),
    };

    // Load HTML
    dom = loadHTML('html/view_cart.html'); // Ensure path is correct
    dom.window.addEventListener('DOMContentLoaded', () => {
      document = dom.window.document;

      // Wait a bit to let scripts (like view_cart.js) manipulate the DOM
      setTimeout(() => {
        done();
      }, 500);  // Increased timeout
    });
  });

  it('renders product details and total correctly', () => {
    // Log the inner HTML of #cart-items for debugging
    console.log(document.querySelector('#cart-items').innerHTML);

    const name = document.querySelector('.cart-item-details h3')?.textContent;
    const price = document.querySelector('.cart-item-details p:nth-of-type(1)')?.textContent;
    const quantity = document.querySelector('.cart-item-details p:nth-of-type(2)')?.textContent;
    const total = document.querySelector('#cart-total')?.textContent;

    // Check if the elements exist and the text content matches
    expect(name).not.toBeUndefined();  // Check if the element exists
    expect(price).not.toBeUndefined();
    expect(quantity).not.toBeUndefined();
    expect(total).not.toBeUndefined();

    // Check if the text content matches
    expect(name).toContain('Handmade Mug');
    expect(price).toContain('100');
    expect(quantity).toContain('2');
    expect(total).toContain('200');
  });
});
