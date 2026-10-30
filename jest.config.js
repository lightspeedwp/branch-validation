module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/scripts/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'scripts/**/*.js',
    '!scripts/__tests__/**',
    '!scripts/sync-canonical.sh',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/\\..*/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testTimeout: 120000,
  verbose: true,
};
