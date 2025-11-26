module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
