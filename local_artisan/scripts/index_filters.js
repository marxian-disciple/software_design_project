// index_filter.js
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const categoryLinks = document.querySelectorAll('[data-filter-category]');
    const productCards = document.querySelectorAll('.product-card');

    // Add click handlers to category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = e.target.dataset.filterCategory;
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                const matchesFilter = filterValue === 'all' || 
                    card.dataset.productType === filterValue;
                
                card.style.display = matchesFilter ? 'block' : 'none';
            });
        });
    });
});