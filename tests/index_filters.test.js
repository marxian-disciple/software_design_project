// __tests__/productFilter.test.js
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { fetchAndDisplayProducts, displayProducts } from '../scripts/index_filters';

jest.mock('firebase/firestore');
jest.mock('../lib/firebaseConfig.js');

describe('Product Filtering', () => {
  let mockContainer;
  let mockCategoryLinks;

  beforeEach(() => {
    // Mock DOM elements
    mockContainer = {
      innerHTML: '',
      appendChild: jest.fn()
    };
    
    mockCategoryLinks = [
      { dataset: { filterCategory: 'all' }, classList: { remove: jest.fn(), add: jest.fn() } },
      { dataset: { filterCategory: 'electronics' }, classList: { remove: jest.fn(), add: jest.fn() } }
    ];

    document.querySelectorAll = jest.fn().mockReturnValue(mockCategoryLinks);
    document.querySelector = jest.fn().mockReturnValue(mockContainer);
  });

  describe('fetchAndDisplayProducts', () => {
    it('should fetch all products when category is "all"', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 10, imageUrl: 'url1', category: 'electronics' },
        { id: '2', name: 'Product 2', price: 20, imageUrl: 'url2', category: 'clothing' }
      ];

      getDocs.mockResolvedValue({
        docs: mockProducts.map(p => ({
          id: p.id,
          data: () => ({ ...p })
        }))
      });

      await fetchAndDisplayProducts('all');

      expect(collection).toHaveBeenCalledWith(db, 'products');
      expect(query).toHaveBeenCalled();
      expect(displayProducts).toHaveBeenCalledWith(mockProducts);
    });

    it('should filter products by category', async () => {
      const mockElectronics = [
        { id: '1', name: 'Product 1', price: 10, imageUrl: 'url1', category: 'electronics' }
      ];

      getDocs.mockResolvedValue({
        docs: mockElectronics.map(p => ({
          id: p.id,
          data: () => ({ ...p })
        }))
      });

      await fetchAndDisplayProducts('electronics');

      expect(where).toHaveBeenCalledWith('category', '==', 'electronics');
      expect(displayProducts).toHaveBeenCalledWith(mockElectronics);
    });
  });

  describe('displayProducts', () => {
    it('should render products correctly', () => {
      const products = [
        { id: '1', name: 'Product 1', price: 10, imageUrl: 'url1' },
        { id: '2', name: 'Product 2', price: 20, imageUrl: 'url2' }
      ];

      displayProducts(products);

      expect(mockContainer.innerHTML).toBe('');
      expect(mockContainer.appendChild).toHaveBeenCalledTimes(2);
      expect(mockContainer.appendChild.mock.calls[0][0].innerHTML).toContain('Product 1');
      expect(mockContainer.appendChild.mock.calls[1][0].innerHTML).toContain('Product 2');
    });

    it('should handle empty state', () => {
      displayProducts([]);
      expect(mockContainer.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('should update active class on category click', async () => {
      const mockEvent = { 
        preventDefault: jest.fn(),
        target: mockCategoryLinks[1]
      };

      // Simulate click event
      const clickHandler = mockCategoryLinks[1].addEventListener.mock.calls[0][1];
      await clickHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockCategoryLinks[0].classList.remove).toHaveBeenCalled();
      expect(mockCategoryLinks[1].classList.add).toHaveBeenCalled();
      expect(fetchAndDisplayProducts).toHaveBeenCalledWith('electronics');
    });
  });
});