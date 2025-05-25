import { filterByPriceRange, PRICE_RANGES } from './../scripts/priceFilters.js';

class PriceFilter {
    constructor() {
        this.currentRange = 'all';
        this.products = [];
        this.onFilterChange = () => {};
        
        this.initDOM();
        this.bindEvents();
    }
    
    initDOM() {
        this.container = document.createElement('section');
        this.container.className = 'price-filters';
        
        PRICE_RANGES.forEach(range => {
            const wrapper = document.createElement('section');
            wrapper.className = 'price-filter-option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'price-filter';
            input.id = range.id;
            input.value = range.value;
            input.dataset.priceRange = range.value;
            if (range.default) input.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = range.id;
            label.textContent = range.label;
            
            wrapper.append(input, label);
            this.container.append(wrapper);
        });
        
        // Insert before product container or at a specific location
        const target = document.querySelector('.ranges') || document.body;
        target.parentNode.insertBefore(this.container, target);
    }
    
    bindEvents() {
        this.container.addEventListener('change', (e) => {
            if (e.target.dataset.priceRange) {
                this.currentRange = e.target.dataset.priceRange;
                this.applyFilter();
            }
        });
    }
    
    applyFilter() {
        const filtered = filterByPriceRange(this.products, this.currentRange);
        this.onFilterChange(filtered);
    }
    
    setProducts(products) {
        this.products = products;
        this.applyFilter();
    }
}

// Auto-initialize when added via script tag
document.addEventListener('DOMContentLoaded', () => {
    window.priceFilter = new PriceFilter();
});