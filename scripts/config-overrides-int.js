const configOverride = require("../integration-test.config");

module.exports = function configOverrides(config) {
  config.testMatch = configOverride.testMatch;
  return config;
};
