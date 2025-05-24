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
    { id: 'price-0-100', value: '0-100', label: 'R0 - R100' },
    { id: 'price-100-500', value: '100-500', label: 'R100 - R500' },
    { id: 'price-500-1000', value: '500-1000', label: 'R500 - R1000' },
    { id: 'price-1000', value: '1000-999999', label: 'R1000+' }
];