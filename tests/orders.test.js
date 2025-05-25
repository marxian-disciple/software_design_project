/**
 * @jest-environment jsdom
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const { getAuth, onAuthStateChanged } = require("firebase/auth");

// Mock Firebase dependencies
jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/auth");

describe('Order Listing', () => {
  let mockAuth, mockFirestore, ordersSection;
  const mockUser = { uid: 'test-uid' };
  const mockOrderData = [
    {
      buyerId: 'test-uid',
      createdAt: { toDate: () => new Date('2024-01-01') },
      total: 100,
      status: 'completed',
      items: [
        { name: 'Item 1', image: 'image1.jpg', price: 50, quantity: 2 }
      ]
    }
  ];

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <section id="orders-list">Loading...</section>
    `;
    ordersSection = document.getElementById("orders-list");

    // Mock Firebase implementations
    initializeApp.mockReturnValue({});
    mockAuth = { onAuthStateChanged: jest.fn() };
    getAuth.mockReturnValue(mockAuth);
    
    mockFirestore = {};
    getFirestore.mockReturnValue(mockFirestore);
    
    // Mock Firestore collection
    collection.mockImplementation((db, path) => ({ path }));
    getDocs.mockResolvedValue({
      forEach: (callback) => mockOrderData.forEach(callback)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const triggerAuthState = (user) => {
    mockAuth.onAuthStateChanged.mock.calls[0][0](user);
  };

  test('should show login message for unauthenticated users', async () => {
    require('../local_artisan/scripts/orders.js');
    triggerAuthState(null);
    
    await new Promise(process.nextTick);
    expect(ordersSection.innerHTML).toContain('logged in');
  });

  test('should display orders for authenticated users', async () => {
    require('../local_artisan/scripts/orders.js');
    triggerAuthState(mockUser);
    
    await new Promise(process.nextTick);
    expect(ordersSection.innerHTML).toContain('Order on');
    expect(ordersSection.querySelectorAll('.order').length).toBe(1);
    expect(ordersSection.innerHTML).toContain('Item 1');
    expect(ordersSection.innerHTML).toContain('R100');
  });

  test('should handle empty orders list', async () => {
    getDocs.mockResolvedValue({ forEach: (callback) => [] });
    require('../local_artisan/scripts/orders.js');
    triggerAuthState(mockUser);
    
    await new Promise(process.nextTick);
    expect(ordersSection.innerHTML).toContain('no past orders');
  });

  test('should handle Firestore errors', async () => {
    getDocs.mockRejectedValue(new Error('DB error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    require('../local_artisan/scripts/orders.js');
    triggerAuthState(mockUser);
    
    await new Promise(process.nextTick);
    expect(ordersSection.innerHTML).toContain('Error loading');
    expect(console.error).toHaveBeenCalledWith('Failed to fetch orders:', expect.any(Error));
  });

  test('should handle missing order data', async () => {
    getDocs.mockResolvedValue({
      forEach: (callback) => [{
        data: () => ({ buyerId: 'test-uid' }) // Minimal valid order
      }].forEach(callback)
    });

    require('../local_artisan/scripts/orders.js');
    triggerAuthState(mockUser);
    
    await new Promise(process.nextTick);
    expect(ordersSection.innerHTML).toContain('Unknown');
    expect(ordersSection.innerHTML).toContain('Paid'); // Default status
  });
});