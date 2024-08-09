import knex from 'knex';
import knexConfig from '../knexfile';

const config = knexConfig[process.env.NODE_ENV ?? 'production'];

export const db = knex(config);
