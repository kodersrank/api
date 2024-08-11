/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('secrets', (table) => {
    table.increments('id').primary();
    table.string('secret').notNullable();
    table.integer('expire_after_views').notNullable();
    table.integer('expire_after').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('secrets');
};
