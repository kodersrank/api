const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
