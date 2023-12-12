import request from 'superagent';
import config from '../config/config.server';

const isBrowser = process.env.IS_BROWSER;

export const API = {
  get: (fetcher, mapping, fn, params = {}) => {
    if (isBrowser) {
      return new Promise(function(resolve, reject) {
        var URL = config.api.url + '/' + fetcher + '/' + fn;

        request
          .get(URL)
          .query(getAsUriParameters(params))
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err || !res.ok || !res.body) { return reject(); }
            resolve(res.body);
          });
      });
    } else {
      return mapping[fn].call(null, params);
    }
  },
  post: (fetcher, mapping, fn, params = {}) => {
    if (isBrowser) {
      return new Promise(function(resolve, reject) {
        var URL = config.api.url + '/' + fetcher + '/' + fn;

        request
          .post(URL)
          .timeout(5 * 60 * 1000)
          .send(getAsUriParameters(params))
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err || !res.ok || !res.body) { return reject(); }
            resolve(res.body);
          });
      });
    } else {
      return mapping[fn].call(null, params);
    }
  }
};

export function getAPI(fetcher, mapping) {
  let localAPI = {};

  Object.keys(API).forEach((key) => {
    localAPI[key] = (...params) => {
      params.unshift(mapping);
      params.unshift(fetcher);
      return API[key].apply(API, params);
    };
  });

  return localAPI;
}

function getAsUriParameters(data) {
  return Object.keys(data).map(function(k) {
    if (Array.isArray(data[k])) {
      var keyE = encodeURIComponent(k + '[]');

      if (data[k].length === 0) {
        return keyE + '=';
      }

      return data[k].map(function(subData) {
        return keyE + '=' + encodeURIComponent(subData);
      }).join('&');
    } else {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }
  }).filter((n) => { return n !== ''; }).join('&');
}
