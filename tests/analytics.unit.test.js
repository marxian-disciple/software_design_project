const { groupData, drawCharts } = require('./analytics.js');

describe('groupData', () => {
  const mockData = [
    {
      product_name: 'Product A',
      price: 10,
      date: { toDate: () => new Date('2023-01-01') },
      userId: 'user1'
    },
    {
      product_name: 'Product A',
      price: 10,
      date: { toDate: () => new Date('2023-01-02') },
      userId: 'user1'
    },
    {
      product_name: 'Product B',
      price: 20,
      date: { toDate: () => new Date('2023-01-01') },
      userId: 'user2'
    },
    {
      product_name: 'Product B',
      price: 20,
      date: { toDate: () => new Date('2023-01-03') },
      userId: 'user2'
    },
    {
      product_name: 'Product C',
      price: 30,
      date: { toDate: () => new Date('2023-01-04') },
      userId: 'user3'
    }
  ];
  it('should correctly handle first-time products', () => {
    const data = [{
      product_name: "New Product",
      price: 15,
      date: { toDate: () => new Date() },
      userId: "user1"
    }];
    
    const result = groupData(data);
    
    assert.strictEqual(result.productCount["New Product"], 1);
    assert.strictEqual(result.productRevenue["New Product"], 15);
  });

  it('should accumulate counts for repeated products', () => {
    const data = [
      { product_name: "Repeated", price: 10, date: { toDate: () => new Date() }, userId: "user1" },
      { product_name: "Repeated", price: 10, date: { toDate: () => new Date() }, userId: "user1" }
   ];
    
    const result = groupData(data);
    
    assert.strictEqual(result.productCount["Repeated"], 2);
    assert.strictEqual(result.productRevenue["Repeated"], 20);
  });

  it('should group revenue by date correctly', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-02');
    
    const data = [
      { product_name: "A", price: 10, date: { toDate: () => date1 }, userId: "user1" },
      { product_name: "B", price: 20, date: { toDate: () => date1 }, userId: "user2" },
      { product_name: "C", price: 30, date: { toDate: () => date2 }, userId: "user3" }
    ];
    
    const result = groupData(data);

    assert.strictEqual(result.revenueByDate["2023-01-01"], 30);
    assert.strictEqual(result.revenueByDate["2023-01-02"], 30);
  });

  it('should only include current week revenue in weekRevenue', () => {
    const currentDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 8);
    
    const data = [
      { product_name: "Current", price: 50, date: { toDate: () => currentDate }, userId: "user1" },
      { product_name: "Old", price: 100, date: { toDate: () => lastWeekDate }, userId: "user2" }
    ];
    
    const result = groupData(data);
    
    assert.strictEqual(result.weekRevenue["user1"], 50);
    assert.strictEqual(result.weekRevenue["user2"], undefined);
  });
  it('should handle empty input', () => {
    const result = groupData([]);
    
    assert.strictEqual(result.totalRevenue, 0);
    assert.deepStrictEqual(result.productCount, {});
    assert.deepStrictEqual(result.productRevenue, {});
    assert.deepStrictEqual(result.revenueByDate, {});
    assert.deepStrictEqual(result.weekRevenue, {});
  });
});
  
