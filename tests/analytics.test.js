/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <button id="download">Download</button>
    <main></main>
    <header></header>
    <button id="menuButton"></button>
    <div id="menuDropdown"></div>
    <button id="modeToggle"></button>
  `;
});


jest.mock('./__mocks__/firebase/app'); // Uses __mocks__/firebase/app.js

import { groupData } from '../local_artisan/scripts/analytics';



describe('groupData', () => {
  it('should calculate revenue, product count, and recommendations correctly', () => {
    const orders = [
      {
        data: () => ({
          items: [
            { sellerId: 'seller123', productName: 'Product A', price: 10, quantity: 2 },
            { sellerId: 'otherSeller', productName: 'Product B', price: 5, quantity: 1 },
          ],
          status: 'paid',
          createdAt: {
            toDate: () => new Date('2024-01-15'),
          },
        }),
      },
      {
        data: () => ({
          items: [
            { sellerId: 'seller123', productName: 'Product A', price: 10, quantity: 1 },
            { sellerId: 'seller123', productName: 'Product C', price: 20, quantity: 3 },
          ],
          status: 'paid',
          createdAt: {
            toDate: () => new Date('2024-01-22'),
          },
        }),
      },
      {
        data: () => ({
          items: [
            { sellerId: 'seller123', productName: 'Product A', price: 10, quantity: 1 },
          ],
          status: 'in_cart',
          createdAt: {
            toDate: () => new Date('2024-01-29'),
          },
        }),
      },
    ];

    const userId = 'seller123';
    const result = groupData(orders, userId);

    expect(result.totalRevenue).toBe(10 * 2 + 10 * 1 + 20 * 3); // 20 + 10 + 60 = 90
    expect(result.productCount).toEqual({
      'Product A': 3,
      'Product C': 3,
    });
    expect(result.revenuePerProduct).toEqual({
      'Product A': 30,
      'Product C': 60,
    });

    const expectedWeeks = [
      '2024-W3', // Jan 15
      '2024-W4', // Jan 22
    ];
    for (const week of expectedWeeks) {
      expect(result.revenuePerWeek[week]).toBeGreaterThan(0);
    }

    expect(result.recommendations).toEqual([
      { sellerId: 'otherSeller', productName: 'Product B', price: 5, quantity: 1 },
    ]);
  });
});
