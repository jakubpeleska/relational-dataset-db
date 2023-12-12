const config = require('../config/config.server');

if (config.isProduction || require('piping')(config.piping)) {
  if (!process.env.NODE_ENV)
    throw new Error('Enviroment variable NODE_ENV must be set.');

  require('babel/register')({optional: ['es7']});

  config.webpackStylesExtensions.forEach(function(ext) {
    require.extensions['.' + ext] = function() {};
  });

  require('./main');
}
