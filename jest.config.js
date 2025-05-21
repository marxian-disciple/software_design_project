module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', // Handle JavaScript files with babel-jest
  },
  testEnvironment: 'jsdom',

  setupFiles: ['<rootDir>/jest.setup.js'], // ✅ Add this line

  collectCoverageFrom: [
    "local_artisan/scripts/**/*.js", // adjust path as needed
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^https://www\\.gstatic\\.com/firebasejs/10\\.12\\.0/firebase-firestore\\.js$':
      '<rootDir>/__mocks__/firebase‑firestore.js'
  }
};
