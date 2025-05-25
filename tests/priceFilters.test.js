import { filterByPriceRange, PRICE_RANGES } from '../local_artisan/scripts/priceFilters';

describe('filterByPriceRange', () => {
  const sampleProducts = [
    { name: 'Product A', price: '50' },
    { name: 'Product B', price: '150' },
    { name: 'Product C', price: '550' },
    { name: 'Product D', price: '1050' },
  ];

  test('returns all products if priceRange is "all"', () => {
    const result = filterByPriceRange(sampleProducts, 'all');
    expect(result).toEqual(sampleProducts);
  });

  test('returns empty array if products is null', () => {
    const result = filterByPriceRange(null, '0-100');
    expect(result).toEqual([]);
  });

  test('filters products in 0-100 range', () => {
    const result = filterByPriceRange(sampleProducts, '0-100');
    expect(result).toEqual([{ name: 'Product A', price: '50' }]);
  });

  test('filters products in 100-500 range', () => {
    const result = filterByPriceRange(sampleProducts, '100-500');
    expect(result).toEqual([{ name: 'Product B', price: '150' }]);
  });

  test('filters products in 500-1000 range', () => {
    const result = filterByPriceRange(sampleProducts, '500-1000');
    expect(result).toEqual([{ name: 'Product C', price: '550' }]);
  });

  test('filters products in 1000+ range (1000-999999)', () => {
    const result = filterByPriceRange(sampleProducts, '1000-999999');
    expect(result).toEqual([{ name: 'Product D', price: '1050' }]);
  });

  test('handles float string prices correctly', () => {
    const floatProducts = [
      { name: 'Product E', price: '99.99' },
      { name: 'Product F', price: '100.01' },
    ];
    expect(filterByPriceRange(floatProducts, '0-100')).toEqual([{ name: 'Product E', price: '99.99' }]);
    expect(filterByPriceRange(floatProducts, '100-500')).toEqual([{ name: 'Product F', price: '100.01' }]);
  });
});

describe('PRICE_RANGES', () => {
  test('includes an "all" option with default true', () => {
    const allOption = PRICE_RANGES.find(p => p.value === 'all');
    expect(allOption).toBeDefined();
    expect(allOption.default).toBe(true);
    expect(allOption.label).toBe('All Prices');
  });

  test('contains correct number of ranges', () => {
    expect(PRICE_RANGES).toHaveLength(5);
  });

  test('has unique ids and values', () => {
    const ids = PRICE_RANGES.map(p => p.id);
    const values = PRICE_RANGES.map(p => p.value);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(values).size).toBe(values.length);
  });
});
