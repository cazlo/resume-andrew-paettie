module.exports = {
  "projects": [
    {
      "displayName": "lambda",
      "runner": "jest-runner-eslint",
      "testMatch": ["<rootDir>/lambda/**/*.js"],
    },
    {
      "displayName": "scripts",
      "runner": "jest-runner-eslint",
      "testMatch": ["<rootDir>/scripts/*.js", "<rootDir>/*.js"],
    },
    {
      "displayName": "main",
      "runner": "jest-runner-eslint",
      "testMatch": ["<rootDir>/src/**/*.js", "<rootDir>/src/*.js"],
    }
  ],
  watchPlugins: ['jest-runner-eslint/watch-fix'],

};