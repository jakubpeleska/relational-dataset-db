if (!process.env.IS_BROWSER) {
  var db = require('../../server/db');
}

export default {
  getSummary: () => {
    return new Promise((resolve, reject) => {
      db
        .select('dataset_name', 'table_count', 'column_count', 'row_count', 'instance_count', 'database_size', 'is_artificial', 'domain', 'task', 'null_count', 'has_loop', 'composite_foreign_key_count')
        .from('information')
        .where('is_hidden', 0)
        .whereNotNull('dataset_name')
        .where('is_primary_version', 1)
        .catch((err) => reject(err))
        .then((rows) => resolve(rows));
    });
  },
  getClassifiers: () => {
    return new Promise((resolve, reject) => {
      db
        .select('algorithm', 'type', 'released', 'ranking', 'reference_count')
        .from('algorithm')
        .whereNotNull('algorithm')
        .whereNotNull('released')
        .whereNotNull('ranking')
        .catch((err) => reject(err))
        .then((rows) => resolve(rows));
    });
  }
};
