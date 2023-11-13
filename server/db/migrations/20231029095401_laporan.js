/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('laporan', table => {
        table.increments('id_laporan').primary()
        table.timestamp('tgl_laporan')
        table.string('isi_laporan', 10000)
        table.boolean('status')
        table.string('foto')
        table.integer('id_masyarakat').references('id').inTable('masyarakat').onDelete('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('laporan')
};
