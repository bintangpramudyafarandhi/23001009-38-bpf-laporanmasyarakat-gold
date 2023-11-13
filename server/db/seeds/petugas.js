const bcrypt = require('bcrypt')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('petugas').del()
  await knex('petugas').insert([
    {username: 'bintang', nama: 'Bintang Pramudya', password: await bcrypt.hash('bintang', 10), no_telp: 87723804253, alamat: 'Depok', created_at: new Date(), updated_at: new Date()}
  ]);
};
