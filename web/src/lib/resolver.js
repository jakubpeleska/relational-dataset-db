import React from 'react';
const toResolve = [];

export default {
  resolve(promise) {
    if (process.env.IS_BROWSER) {
      return new Promise(promise);
    } else {
      toResolve.push(promise);
    }
  },
  mapPromises() {
    return toResolve.map((promise) => new Promise(promise));
  },
  cleanPromises() {
    toResolve.length = 0;
  },
  render(Handler) {
    return new Promise((resolve, reject) => {
      if (process.env.IS_BROWSER) {
        resolve(null);
      } else {
        React.renderToString(<Handler />);
        Promise.all(this.mapPromises())
          .then(() => {
            const html = React.renderToString(<Handler />);
            this.cleanPromises();
            resolve(html);
          })
          .catch(error => reject(error));
      }
    });
  }
};
