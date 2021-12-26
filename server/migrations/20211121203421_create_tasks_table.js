exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('status_id').references('id').inTable('statuses');
    table.integer('creator_id').references('id').inTable('users');
    table.integer('executor_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks');
};
