/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // await knex('petugas').del()
  await knex('petugas').insert([
    // {username: 'bintang', nama: 'Bintang', password:'bintang', no_telp: 346329, alamat: 'depok', created_at: new Date(), updated_at: new Date()},
    {username: 'cristiano', nama: 'Cristiano Ronaldo', password:'cristiano', no_telp: 73624875, alamat: 'Madeira', created_at: new Date(), updated_at: new Date()}
  ]);
};
