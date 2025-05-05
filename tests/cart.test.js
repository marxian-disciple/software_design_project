// cart.test.js
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// Utility to load HTML
function loadHTML(file) {
  const html = fs.readFileSync(path.resolve(__dirname, `../${file}`), 'utf8');
  return new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
}

describe('UAT 1: View Cart with Items', () => {
  let dom, document;

  beforeEach(() => {
    // Mock localStorage
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

    dom = loadHTML('view_cart.html');
    document = dom.window.document;
  });

  it('renders product details and total correctly', (done) => {
    setTimeout(() => {
      const name = document.querySelector('.product-name').textContent;
      const price = document.querySelector('.product-price').textContent;
      const quantity = document.querySelector('.product-quantity').textContent;
      const total = document.querySelector('#cart-total').textContent;

      expect(name).toContain('Handmade Mug');
      expect(price).toContain('100');
      expect(quantity).toContain('2');
      expect(total).toContain('200');

      done();
    }, 500); // wait for DOM to populate
  });
});
