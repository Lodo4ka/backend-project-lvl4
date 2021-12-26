exports.up = function (knex) {
  return knex.schema.createTable('tasks_labels', (table) => {
    table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.integer('label_id').references('id').inTable('labels').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks_labels');
};
