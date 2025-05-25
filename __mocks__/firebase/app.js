const firestoreMock = {
  collection: jest.fn(),
};

const authMock = {
  onAuthStateChanged: jest.fn(),
};

module.exports = {
  firestore: jest.fn(() => firestoreMock),
  auth: jest.fn(() => authMock),
  initializeApp: jest.fn(),
  __esModule: true,
  default: {
    firestore: jest.fn(() => firestoreMock),
    auth: jest.fn(() => authMock),
    initializeApp: jest.fn(),
  },
};
