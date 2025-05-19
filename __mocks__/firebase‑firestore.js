export const collection = jest.fn();
export const getDocs     = jest.fn(() => Promise.resolve({ docs: [] }));
export const query       = jest.fn();
export const where       = jest.fn();
