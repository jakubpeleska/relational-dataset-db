var _ = require('underscore');
var localConfig = require('./config.client.local');
var basePath = '/assets/img/';

var config = {
  images: {
    basePath: basePath,
    datasetsPath: basePath + 'datasets/',
    datasetsGeneratedPath: basePath + 'datasets-generated/'
  }
};

module.exports = _.extend(config, localConfig);
