if (!process.env.IS_BROWSER) {
  var db = require('../../server/db');
}

const table = 'information';

export default {
  getContributors: () => {
    return new Promise((resolve, reject) => {
      db
        .column('uploader_name')
        .column('uploader_url')
        .count('* as count')
        .from(table)
        .where('is_hidden', 0)
        .whereNotNull('dataset_name')
        .whereNotNull('uploader_name')
        .groupBy('uploader_name', 'uploader_url')
        .orderBy('count', 'DESC')
        .catch((err) => reject(err))
        .then((rows) => resolve(rows));
    });
  }
};
