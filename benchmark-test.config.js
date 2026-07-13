const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  collectCoverage: false,
  reporters: ['default'],
  testMatch: ['**/*.bench.js'],
};
