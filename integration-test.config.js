const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  verbose: true,
  testMatch: ['**/?(*.)+(int).[jt]s?(x)'],
};
