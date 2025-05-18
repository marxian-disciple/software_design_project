jest.mock('firebase/app', () => {
  const firestoreMock = {
    collection: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [{ data: () => ({ name: 'Test Item' }) }]
    })
  };

  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestoreMock),
  };
});
require('firebase/firestore');

const { fetchData } = require('./firebaseService');

describe('fetchData', () => {
  test('returns mocked data', async () => {
    const data = await fetchData();
    expect(data).toEqual([{ name: 'Test Item' }]);
  });
});
