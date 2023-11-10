const db = require('../db/db')

class UserController {
    static async homePage (req, res) {
        try {
            const data = await db('masyarakat').where({id: req.params.id}).select('id','nama')
            res.render('user/index', {
                title: 'Laporan Masyarakat Depok',
                data
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profil (req, res) {
        try {
            const data = await db('masyarakat').where({id: req.params.id})

            res.render('user/profile' , {
                title: 'Profil Anda',
                data: data[0],
                id: data[0].id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profilEditGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.params.id})

            res.render('user/profile-edit', {
                title: 'Edit Profil',
                data: data[0]
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})   
        }
    }

    static async profilEditPost (req, res) {
        try {
            const {nik, nama, no_telp, alamat} = req.body
            const errors = []

            const nikDupe = await db('masyarakat').whereNot({id: req.params.id}).where({nik : nik.replace(/\s+/g,'')})
            const noTelpDupe = await db('masyarakat').whereNot({id: req.params.id}).where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

            if (nikDupe.length > 0) {
                errors.push({message: 'NIK Tidak Tersedia'})
            }

            if (nik.replace(/\s+/g,'').length != 16) {
                errors.push({message: 'NIK Tidak Valid'})
            }

            if (noTelpDupe.length > 0) {
                errors.push({message: 'Nomor Telepon Sudah Terdaftar'})
            }

            if (no_telp.replace(/\s+/g,'').length < 9 || no_telp.replace(/\s+/g,'').length > 12) {
                errors.push({message: 'Nomor Telepon Tidak Valid'})
            }

            if (errors.length == 0) {
                await db('masyarakat').where({id: req.params.id}).update({
                    nik: nik.replace(/\s+/g,''),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat
                })
                res.redirect(`/user/${req.params.id}/profil`)
            } else {
                const data = await db('masyarakat').where({id: req.params.id})
                res.render('user/profile-edit', {
                    title: 'Edit Profil',
                    data: data[0],
                    errors
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async laporGet (req,res) {
        try {
            res.render('user/lapor', {
                title: 'Tulis Laporan',
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async laporPost (req,res) {
        try {
            const {isi_laporan} = req.body

            await db('laporan').insert({
                tgl_laporan: new Date(),
                isi_laporan,
                status: false,
                id_masyarakat: req.params.id
            })

            res.render('user/lapor', {
                title: 'Tulis Laporan',
                id: req.params.id,
                message: 'Laporan Terkirim, Silahkan Tunggu Balasan dari Petugas'
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayat (req,res) {
        try {
            const data = await db('laporan').where({id_masyarakat: req.params.id})

            res.render('user/riwayat', {
                title: 'Riwayat Laporan',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayatDetail (req,res) {
        try {
            const dataLaporan = await db('laporan').where({id_laporan: req.params.idLap})
            const dataBalasan = await db('balasan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: req.params.id})

            if (dataBalasan.length > 0) {
                const dataAdmin = await db('petugas').where({id: dataBalasan[0].id_petugas})
                res.render('user/riwayat-detail', {
                    title: 'Info Laporan',
                    dataLaporan: dataLaporan[0],
                    dataBalasan: dataBalasan[0],
                    dataUser: dataUser[0],
                    dataAdmin: dataAdmin[0]
                })
            } else {
                res.render('user/riwayat-detail', {
                    title: 'Info Laporan',
                    dataLaporan: dataLaporan[0],
                    dataUser: dataUser[0]
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }
}

module.exports = UserController