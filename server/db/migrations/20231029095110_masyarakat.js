/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('masyarakat', table => {
        table.increments('id').primary()
        table.bigInteger('nik')
        table.string('nama')
        table.string('password')
        table.bigInteger('no_telp')
        table.string('alamat')
        table.timestamp('created_at')
        table.timestamp('updated_at')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('masyarakat')
};
