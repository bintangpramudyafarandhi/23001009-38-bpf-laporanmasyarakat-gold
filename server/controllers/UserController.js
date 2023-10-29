const db = require('../db/db')

class UserController {
    static homePage (req, res) {
        res.send('user')
    }

    static async laporan (req,res) {
        try {
            const {isiLaporan} = req.body

            const newLaporan = await db('laporan').insert({
                tgl_laporan: new Date(),
                isi_laporan: isiLaporan,
                status: false,
                id_masyarakat: req.params.id
            })

            if (newLaporan) {
                res.status(201).json({'Message': 'Laporan Berhasil Dibuat! Silahkan Tunggu Balasan Dari Petugas Kami'})
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profile (req, res) {
        try {
            const prfl = await db('masyarakat').where({
                id: req.params.id
            }).select('*')

            res.status(200).json(prfl)
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async edit (req, res) {
        try {
            const {nama, notelp, alamat} = req.body

            const edt = await db('masyarakat').where({
                id: req.params.id
            }).update({
                nama,
                no_telp: notelp,
                alamat,
                updated_at: new Date()
            }).returning('*')

            const newData = await db('masyarakat').where({
                id: req.params.id
            }).select('*')

            if (edt) {
                res.status(200).json(edt)
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }
}

module.exports = UserController