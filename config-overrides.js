module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  // webpack(config) {
  //   Add the svg loader
  // const loaderList = config.module.rules[1].oneOf;
  // loaderList.splice(loaderList.length - 1, 0, {
  //   test: /\.svg/,
  //   loader: 'svg-inline-loader?removeTags',
  // });
  // return config;
  // },
  // The Jest config to use when running your jest tests - note that the normal rewires do not
  // work here.
  jest(config) {
    // todo all of this was copy pasta.  will need to run int tests only if we have that set somehow
    // ...add your jest config customisation...
    // Example: enable/disable some tests based on environment variables in the .env file.
    // if (!config.testPathIgnorePatterns) {
    //   config.testPathIgnorePatterns = [];
    // }
    // if (!process.env.RUN_COMPONENT_TESTS) {
    //   config.testPathIgnorePatterns.push('<rootDir>/src/components/**/*.test.js');
    // }
    // if (!process.env.RUN_REDUCER_TESTS) {
    //   config.testPathIgnorePatterns.push('<rootDir>/src/reducers/**/*.test.js');
    // }
    return config;
  },
};
