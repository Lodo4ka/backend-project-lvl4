exports.up = function (knex) {
  return knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('labels');
};
