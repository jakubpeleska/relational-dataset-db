import config from '../config/config.server';

const db = require('knex')({
  client: config.database.client,
  connection: {
    host:     config.database.host,
    user:     config.database.user,
    password: config.database.password,
    database: config.database.database
  },
  pool: {
    min: 0,
    max: 100
  }
});

export default db;
