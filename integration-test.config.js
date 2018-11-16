const defaultConfig = require("./jest.config");
module.exports = {
  ...defaultConfig,
  verbose: true,
  testMatch: [
    '<rootDir>/src/**/?(*.)(int).{js,jsx}',
  ],
};