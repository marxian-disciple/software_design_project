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

  it('should calculate total revenue correctly', () => {
    const result = groupData(mockData);
    expect(result.totalRevenue).toBe(90); // 10+10+20+20+30
  });

  it('should group product counts correctly', () => {
    const result = groupData(mockData);
    expect(result.productCount['Product A']).toBe(2);
    expect(result.productCount['Product B']).toBe(2);
    expect(result.productCount['Product C']).toBe(1);
  });

  it('should group product revenue correctly', () => {
    const result = groupData(mockData);
    expect(result.productRevenue['Product A']).toBe(20);
    expect(result.productRevenue['Product B']).toBe(40);
    expect(result.productRevenue['Product C']).toBe(30);
  });

  it('should group revenue by date correctly', () => {
    const result = groupData(mockData);
    expect(result.revenueByDate['2023-01-01']).toBe(30); // 10 + 20
    expect(result.revenueByDate['2023-01-02']).toBe(10);
    expect(result.revenueByDate['2023-01-03']).toBe(20);
    expect(result.revenueByDate['2023-01-04']).toBe(30);
  });

  it('should calculate weekly revenue per user', () => {
    // Adjust the test data to include recent dates
    const recentData = [
      {
        product_name: 'Product A',
        price: 10,
        date: { toDate: () => new Date() }, // today
        userId: 'user1'
      },
      {
        product_name: 'Product B',
        price: 20,
        date: { toDate: () => {
          const d = new Date();
          d.setDate(d.getDate() - 3); // 3 days ago
          return d;
        }},
        userId: 'user2'
      }
    ];
    
    const result = groupData(recentData);
    expect(result.weekRevenue['user1']).toBe(10);
    expect(result.weekRevenue['user2']).toBe(20);
  });
});

describe('drawCharts', () => {
  beforeEach(() => {
    // Mock the Chart constructor
    global.Chart = jest.fn().mockImplementation(() => ({}));
    
    // Create mock canvas elements
    document.getElementById = jest.fn((id) => {
      return {
        id,
        getContext: () => ({})
      };
    });
  });

  it('should create three charts with correct configurations', () => {
    const testData = {
      totalRevenue: 100,
      productCount: { 'A': 5, 'B': 3 },
      productRevenue: { 'A': 50, 'B': 50 },
      revenueByDate: { '2023-01-01': 30, '2023-01-02': 70 }
    };
    
    drawCharts(testData);
    
    expect(Chart).toHaveBeenCalledTimes(3);
    expect(document.getElementById).toHaveBeenCalledWith('revenueDonut');
    expect(document.getElementById).toHaveBeenCalledWith('performanceLine');
    expect(document.getElementById).toHaveBeenCalledWith('topProductsBar');
    
    // Verify the doughnut chart config
    const doughnutConfig = Chart.mock.calls[0][1];
    expect(doughnutConfig.type).toBe('doughnut');
    expect(doughnutConfig.data.datasets[0].data[0]).toBe(100);
    
    // Verify the line chart config
    const lineConfig = Chart.mock.calls[1][1];
    expect(lineConfig.type).toBe('line');
    expect(lineConfig.data.labels).toEqual(['2023-01-01', '2023-01-02']);
    
    // Verify the bar chart config
    const barConfig = Chart.mock.calls[2][1];
    expect(barConfig.type).toBe('bar');
    expect(barConfig.data.labels).toEqual(['A', 'B']);
  });
});