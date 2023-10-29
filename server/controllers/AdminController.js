const db = require("../db/db")

class AdminController {
    static homePage (req, res) {
        res.send('admin')
    }

    static async balas (req, res) {
        try {
            const {isiBalasan} = req.body

            const balasan = await db('balasan').insert({
                isi_balasan: isiBalasan,
                tgl_balasan: new Date(),
                id_laporan: req.params.idLap,
                id_petugas: req.params.id
            })

            if (balasan) {
                await db('laporan').where({
                    id: req.params.idLap
                }).update({
                    status: true
                })

                res.status(201).json({'Message': 'Laporan Berhasil Dibalas'})
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }
}

module.exports = AdminController