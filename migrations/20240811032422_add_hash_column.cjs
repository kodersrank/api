const { createHash } = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // add the hash column with NULL constraint
  await knex.schema.table('secrets', (table) => {
    table.string('hash').nullable();
  });

  // generate and update hash for existing rows
  const secrets = await knex('secrets').select('id', 'secret');
  for (const secret of secrets) {
    const hash = createHash('sha256')
      .update(secret.secret + Date.now().toString())
      .digest('hex');
    await knex('secrets').where('id', secret.id).update({ hash });
  }

  // alter the column to set NOT NULL constraint
  await knex.schema.table('secrets', (table) => {
    table.string('hash').notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('secrets', (table) => {
    table.dropColumn('hash');
  });
};
