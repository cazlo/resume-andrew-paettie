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
        // '^.+\\.[tj]sx?$': ['@swc/jest'],
        "^.+\\.(t|j)sx?$": [

            "@swc/jest",

            {

                "jsc": {

                    "parser": {

                        "syntax": "ecmascript",

                        "jsx": true,

                        "decorators": false,

                        "dynamicImport": false

                    }

                }

            },

        ],
        // '^.+\\.(js|jsx)$': './node_modules/react-scripts/config/jest/babelTransform.js',
        // '[/\\\\]node_modules/@mui[/\\\\].+\\.(js|jsx)$': './node_modules/react-scripts/config/jest/babelTransform.js',
        // '^.+\\.css$': './node_modules/react-scripts/config/jest/cssTransform.js',
        // '^(?!.*\\.(js|jsx|css|json)$)': './node_modules/react-scripts/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(mjs|cjs)$',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/styleMock.js",
        "\\.(css|less)$": "<rootDir>/styleMock.js",
    },
    moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node'],
    moduleDirectories: ["node_modules", "src"],
    setupFilesAfterEnv: ['./src/setupTests.js'],
};
