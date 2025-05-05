module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', // Handle JavaScript files with babel-jest
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    "local_artisan/scripts/*.js", // adjust path as needed
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
