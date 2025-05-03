// index_filter.test.js
const fs = require('fs');
const path = require('path');

describe('Product Filter', () => {
  let document;
  let filterLinks;
  let productCards;
  
  beforeEach(() => {
    // Set up DOM
    const html = fs.readFileSync(path.resolve(__dirname, '../local_artisan/html/index.html'), 'utf8');
    document = new (require('jsdom').JSDOM)(html).window.document;
    
    // Load implementation
    require('./index_filter.js');
    
    // Get elements
    filterLinks = document.querySelectorAll('[data-filter-category]');
    productCards = document.querySelectorAll('.product-card');
  });

  test('should initialize with "All Products" active', () => {
    const allProductsLink = document.querySelector('[data-filter-category="all"]');
    expect(allProductsLink.classList.contains('active')).toBe(true);
  });

  test('should update active state on click', () => {
    const ceramicsLink = document.querySelector('[data-filter-category="Ceramics"]');
    ceramicsLink.click();
    
    expect(ceramicsLink.classList.contains('active')).toBe(true);
    expect(filterLinks[0].classList.contains('active')).toBe(false);
  });

  test('should filter products when category selected', () => {
    const ceramicsLink = document.querySelector('[data-filter-category="Ceramics"]');
    ceramicsLink.click();
    
    const visibleProducts = Array.from(productCards).filter(card => 
      card.style.display !== 'none'
    );
    
    expect(visibleProducts.length).toBe(1);
    expect(visibleProducts[0].dataset.productType).toBe('Ceramics');
  });

  test('should show all products when "All" clicked', () => {
    const allLink = document.querySelector('[data-filter-category="all"]');
    const ceramicsLink = document.querySelector('[data-filter-category="Ceramics"]');
    
    ceramicsLink.click();
    allLink.click();
    
    const hiddenProducts = Array.from(productCards).filter(card => 
      card.style.display === 'none'
    );
    
    expect(hiddenProducts.length).toBe(0);
  });

  test('should handle case-sensitive category names', () => {
    const ceramicsLink = document.querySelector('[data-filter-category="ceramics"]');
    ceramicsLink.click();
    
    const visibleProducts = Array.from(productCards).filter(card => 
      card.style.display !== 'none'
    );
    
    // Shouldn't match "Ceramics" with "ceramics"
    expect(visibleProducts.length).toBe(0);
  });
});