module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', // Handle JavaScript files with babel-jest
  },
   moduleNameMapper: {
    "^https://www\\.gstatic\\.com/firebasejs/.+/.+$": "<rootDir>/tests/__mocks__/firebase_mocks.js"
  },
  testEnvironment: "jsdom",

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
};
