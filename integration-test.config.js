const defaultConfig = require("./jest.config");
module.exports = {
  ...defaultConfig,
  testMatch: [
    '<rootDir>/src/**/?(*.)(int).{js,jsx}',
  ],
};