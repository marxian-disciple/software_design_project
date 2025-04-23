module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', // Handle JavaScript files with babel-jest
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    "local_artisan/scripts/**/*.js", // adjust path as needed
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
