exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    // TABLE COLUMN DEFINITIONS HERE
    table.increments()
    table.varchar('name').notNullable().defaultTo('')
    table.boolean('admin').notNullable().defaultTo(false)
    table.integer('oauthId')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}