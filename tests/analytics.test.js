
const { groupData } = require('../local_artisan/scripts/analytics');

describe('groupData', () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 5); // within week

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
   
