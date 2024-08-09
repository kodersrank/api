/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('secrets', (table) => {
    table.increments('id').primary();
    table.string('secret').notNullable();
    table.integer('expireAfterViews').notNullable();
    table.integer('expireAfter').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('expiresAt');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('secrets');
};
