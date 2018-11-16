module.exports = function configOverrides(config) {
  config.verbose = process.env.NODE_ENV === 'production';
  return config;
};
