/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('balasan', table => {
        table.increments('id_balasan').primary()
        table.timestamp('tgl_balasan')
        table.string('isi_balasan', 10000)
        table.integer('id_laporan').references('id_laporan').inTable('laporan')
        table.integer('id_petugas').references('id').inTable('petugas').onDelete('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('balasan')
};
