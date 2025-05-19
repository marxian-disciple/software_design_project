/**
 * @jest-environment jsdom
 */

const { groupData, drawCharts } = require('../local_artisan/scripts/analytics');

// Mock Chart globally
global.Chart = jest.fn().mockImplementation(() => ({}));

// Set up basic DOM elements before tests
beforeAll(() => {
  document.body.innerHTML = `
    <canvas id="revenueDonut"></canvas>
    <canvas id="performanceLine"></canvas>
    <canvas id="topProductsBar"></canvas>
  `;
});

describe('groupData', () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 5);

  const mockData = [
    {
      product_name: "Widget",
      price: 20,
      date: { toDate: () => new Date(sevenDaysAgo) },
      userId: "user1"
    },
    {
      product_name: "Widget",
      price: 30,
      date: { toDate: () => new Date(sevenDaysAgo) },
      userId: "user1"
    },
    {
      product_name: "Gadget",
      price: 50,
      date: { toDate: () => new Date(sevenDaysAgo) },
      userId: "user2"
    }
  ];

  test('computes revenue and product stats', () => {
    const result = groupData(mockData);
    expect(result.totalRevenue).toBe(100);
    expect(result.productCount).toEqual({ Widget: 2, Gadget: 1 });
    expect(result.productRevenue).toEqual({ Widget: 50, Gadget: 50 });
    const dateKey = sevenDaysAgo.toISOString().split("T")[0];
    expect(result.revenueByDate[dateKey]).toBe(100);
    expect(result.weekRevenue).toEqual({ user1: 50, user2: 50 });
  });
});

describe('drawCharts', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    Chart.mockClear();
  });

  test('creates all three charts with correct configuration', () => {
    const mockData = {
      totalRevenue: 100,
      productCount: { Widget: 2, Gadget: 1 },
      productRevenue: { Widget: 50, Gadget: 50 },
      revenueByDate: { '2023-01-01': 100 }
    };

    drawCharts(mockData);

    expect(Chart).toHaveBeenCalledTimes(3);
    const chartCalls = Chart.mock.calls;

    // Test donut chart
    expect(chartCalls[0][1].type).toBe('doughnut');
    expect(chartCalls[0][1].data.datasets[0].data).toEqual([100]);

    // Test line chart
    expect(chartCalls[1][1].type).toBe('line');
    expect(chartCalls[1][1].data.labels).toEqual(['2023-01-01']);

    // Test bar chart
    expect(chartCalls[2][1].type).toBe('bar');
    expect(chartCalls[2][1].data.labels).toEqual(['Widget', 'Gadget']);
  });

  test('handles empty data gracefully', () => {
    const emptyData = {
      totalRevenue: 0,
      productCount: {},
      productRevenue: {},
      revenueByDate: {}
    };

    drawCharts(emptyData);

    expect(Chart).toHaveBeenCalledTimes(3);
    const chartCalls = Chart.mock.calls;
    
    expect(chartCalls[0][1].data.datasets[0].data).toEqual([0]);
    expect(chartCalls[1][1].data.labels).toEqual([]);
    expect(chartCalls[2][1].data.labels).toEqual([]);
  });
});
