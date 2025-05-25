// Exportable price filtering functions
export const filterByPriceRange = (products, priceRange) => {
    if (!products) return [];
    if (priceRange === 'all') return products;
    
    const [min, max] = priceRange.split('-').map(Number);
    return products.filter(product => {
        const price = parseFloat(product.price);
        return price >= min && price <= max;
    });
};

export const PRICE_RANGES = [
    { id: 'price-all', value: 'all', label: 'All Prices', default: true },
    { id: 'price-0-99', value: '0-99', label: 'R0 - R99' },
    { id: 'price-100-499', value: '100-499', label: 'R100 - R499' },
    { id: 'price-500-999', value: '500-999', label: 'R500 - R999' },
    { id: 'price-1000', value: '1000-999999', label: 'R1000+' }
];