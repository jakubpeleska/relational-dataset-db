if (!process.env.IS_BROWSER) {
  var knex = require('knex');
  var config = require('../../config/config.server');
  var fs = require('fs');
  var path = require('path');
  var async = require('async');

  var dataDbConfig = {
    client: config.database.client,
    connection: {
      host:     config.database.host,
      user:     config.database.featureFunction.data.user,
      password: config.database.featureFunction.data.password,
      database: config.database.featureFunction.data.database,
      multipleStatements: true
    }
  };
  var resultsDbConfig = {
    client: config.database.client,
    connection: {
      host:     config.database.host,
      user:     config.database.featureFunction.results.user,
      password: config.database.featureFunction.results.password,
      database: config.database.featureFunction.results.database,
      multipleStatements: true
    }
  };
  var tempDbConfig = {
    client: config.database.client,
    connection: {
      host:     config.database.host,
      user:     config.database.featureFunction.temp.user,
      password: config.database.featureFunction.temp.password,
      database: config.database.featureFunction.temp.database,
      multipleStatements: true
    }
  };
  var data = knex(dataDbConfig);
  var results = knex(resultsDbConfig);
  var temp = knex(tempDbConfig);
}

export default {
  getFeatureFunction: (values) => {
    return new Promise((resolve, reject) => {
      const featureId = values.featureId;

      const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'get_detail.sql'), 'utf8')
        .replace(/@feature_id/g, featureId);
      const resultsQuery = fs.readFileSync(path.join(__dirname, 'queries', 'get_results.sql'), 'utf8')
        .replace(/@feature_id/g, featureId);
      const summaryQuery = fs.readFileSync(path.join(__dirname, 'queries', 'get_summary.sql'), 'utf8')
        .replace(/@feature_id/g, featureId);

      results
        .raw(query1)
        .catch((err) => reject(err))
        .then((resp) => {
          if (resp[0].length < 1) return reject();
          let featureFunction = JSON.parse(JSON.stringify(resp[0][0]));          
          results
            .raw(resultsQuery)
            .catch((err) => reject(err))
            .then((resp2) => {
              featureFunction.results = resp2[0];
              results
                .raw(summaryQuery)
                .catch((err) => reject(err))
                .then((resp3) => {
                  featureFunction.summary = resp3[0];
                  resolve(featureFunction);
                });
            });
        });
    });
  },
  getPastResults: () => {
    return new Promise((resolve, reject) => {
      const query = fs.readFileSync(path.join(__dirname, 'queries', 'get_history.sql'), 'utf8');
      results
        .raw(query)
        .catch((err) => reject(err))
        .then((resp) => resolve(resp[0]));
    });
  },
  sendFeatureFunction: (values) => {
    return new Promise((resolve, reject) => {
      var queryId = 1;
      const useCol2 = (values.sql.indexOf('@col2') !== -1);

      getFeatureId().then((featureId) =>
        getTables().then((tables) =>
          async.eachSeries(tables, (table, next) =>
            getColumns(table, useCol2).then((columnPairs) =>
              async.eachSeries(columnPairs, (columns, next2) =>
                runSql(values.sql, table, columns, values.featureName).then((res) =>
                  runChi2(table, values.featureName).then((chi2Value) =>
                    writeResult(featureId, queryId++, values, res.query, table, columns, res.err, chi2Value, res.runTime).then(() => {
                      next2();
                    })
                  )
                ), 
                ((done) => next())
              )
            ).catch((err) => reject(err)),
            ((done) => resolve(featureId))
          )
        ).catch((err) => reject(err))
      ).catch((err) => reject(err));
    });
  }
};

// Subroutines
function getFeatureId() {
  return results
    .select(knex.raw('coalesce(max(feature_id)+1, 1) as feature_id'))
    .from('result_list')
    .then((res) => { return res[0].feature_id; });
}

function getTables() {
  return data
    .select('table_name')
    .from('information_schema.tables')
    .where('TABLE_SCHEMA', config.database.featureFunction.data.database)
    .whereNotIn('table_name', ['calculated_feature'])
    .map((row) => { return row.table_name; });
}

function getColumns(table, useCol2) {
  const query = fs.readFileSync(path.join(__dirname, 'queries', 'get_columns_' + (useCol2 ? 'pair' : 'single') + '.sql'), 'utf8')
    .replace(/@table_name/g, '\'' + table + '\'');
  return data
    .raw(query)
    .then((resp) => { return resp[0]; })
    .map((row) => {
      return {
        col1: {
          name: row.col1,
          dataType: row.col1_data_type
        },
        col2: {
          name: row.col2,
          dataType: row.col2_data_type
        }
      };
    });
}

function runSql(sql, table, columns, featureName) {
  const drop = 'drop table if exists calculated_feature; ';
  const prefix = 'create table calculated_feature as ';
  const query = prepareSql(sql, table, columns, featureName);
  const time = process.hrtime();
  let runTime;
  return temp
          .raw(drop + prefix + query)
          .on('end', () => {
            const diff = process.hrtime(time);
            runTime = Math.round((diff[0] * 1e9 + diff[1]) / 1e6) / 1e3;
          })
          .then(() => {
            return {
              query: query,
              runTime: runTime,
              err: null
            };
          })
          .catch((err) => {
            return {
              query: query,
              runTime: runTime,
              err: err.code
            };
          });
}

function prepareSql(sql, table, columns, featureName) {
  return sql
           .replace(/@table/g, config.database.featureFunction.data.database + '.' + table)
           .replace(/@col1/g, '`' + columns.col1.name + '`')
           .replace(/@col2/g, '`' + columns.col2.name + '`')
           .replace(/@id/g, '`id`')
           .replace(/@timestamp/g, '`timestamp`')
           .replace(/@target/g, '`target`')
           .replace(/@feature/g, '`' + featureName + '`');
}

function runChi2(table, featureName) {
  return temp
    .select('DATA_TYPE')
    .from('information_schema.columns')
    .where('TABLE_NAME', 'calculated_feature')
    .where('COLUMN_NAME', featureName)
    .then((rows) => {
      const dataType = rows[0].DATA_TYPE;
      const chi2 = fs.readFileSync(path.join(__dirname, 'queries', isContinuous(dataType)
        ? 'chi2_continuous.sql'
        : 'chi2_discrete.sql'
      ), 'utf8')
        .toString()
        .replace(/@table/g, config.database.featureFunction.temp.database + '.calculated_feature')
        .replace(/@column/g, '`' + featureName + '`')
        .replace(/@target/g, '`target`');

      return temp.raw(chi2).then((resp) => { return resp[0][0].chi2; });
    })
    .catch(() => {return null});
}

function writeResult(featureId, queryId, values, newSql, table, columns, err, chi2Value, runTime) {
  return results
    .table('result_list')
    .insert({
      'feature_id': featureId,
      'query_id': queryId,
      'timestamp': knex.raw('now()'),
      'author': values.author,
      'feature_name': values.featureName,
      'feature_description': values.featureDescription,
      'example_usage': values.featureApplication,
      'sql_original': values.sql,
      'table_name': table,
      'col1': columns.col1.name,
      'col2': columns.col2.name,
      'sql': newSql,
      'error_message': err,
      'chi2': chi2Value,
      'run_time': runTime
    });
}

const continuousDataTypes = ['FLOAT', 'DOUBLE', 'DECIMAL', 'INT', 'DATE', 'DATETIME', 'TIMESTAMP'];

function isContinuous(dataType) {
  return continuousDataTypes.indexOf(dataType) !== -1;
}
