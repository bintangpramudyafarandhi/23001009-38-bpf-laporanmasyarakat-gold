const db = require('../db/db')

class Controller {
    static homePage (req, res) {
        res.send('home')
    }

    static async register (req,res) {
        try {
            const {nik, nama, password, notelp, alamat} = req.body

            const insert = await db('masyarakat').insert({
                nik,
                nama,
                password,
                no_telp: notelp,
                alamat,
                created_at: new Date(),
                updated_at: new Date()
            })

            if (insert) {
                res.status(201).json({'Message': 'Registrasi Berhasil!'})
            }
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }
}

module.exports = Controller