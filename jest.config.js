// const {defaults} = require('jest-config');

module.exports = {
  // testMatch: defaults.testMatch,
  collectCoverage: true,
  coverageDirectory: './reports/coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'src/data/*'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: '{filename}',
        outputDirectory: './reports/junit/jest',
        outputName: './results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': './node_modules/react-scripts/config/jest/babelTransform.js',
    '^.+\\.css$': './node_modules/react-scripts/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': './node_modules/react-scripts/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node'],
};
