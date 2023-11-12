const db = require('../db/db')
const bcrypt = require('bcrypt')

class UserController {
    static async homePage (req, res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')
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
            const data = await db('masyarakat').where({id: req.session.aidi})

            res.render('user/profile' , {
                title: 'Profil Anda',
                data: data[0]
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profilEditGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi})

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

            const nikDupe = await db('masyarakat').whereNot({id: req.session.aidi}).where({nik : nik.replace(/\s+/g,'')})
            const noTelpDupe = await db('masyarakat').whereNot({id: req.session.aidi}).where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

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
                await db('masyarakat').where({id: req.session.aidi}).update({
                    nik: nik.replace(/\s+/g,''),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    updated_at: new Date()
                })
                res.redirect(`/user/profil`)
            } else {
                const data = await db('masyarakat').where({id: req.session.aidi})
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

    static async passwordGet (req,res) {
        try {
            res.render('user/password', {
                title: 'Ubah Password',
                pass: false
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async passwordPost (req,res) {
        try {
            const {password} = req.body

            const oldPassword = await db('masyarakat').where({id: req.session.aidi}).select('password')
            const passCheck = await bcrypt.compare(password, oldPassword[0].password)

            if (passCheck) {
                res.render('user/password', {
                    title: 'Ubah Password',
                    pass: true
                })
            } else {
                res.render('user/password', {
                    title: 'Ubah Password',
                    pass: false,
                    errors: 'Password Salah'
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async passwordPostNew (req,res) {
        try {
            const {password} = req.body

            const spaceCheck = /\s/.test(password)

            if (spaceCheck) {
                res.render('user/password', {
                    title: 'Ubah Password',
                    pass: true,
                    errors: 'Password Tidak Bisa Mengandung Spasi'
                })
            } else {
                await db('masyarakat').where({id: req.session.aidi}).update({
                    password: await bcrypt.hash(password, 10),
                    updated_at: new Date()
                })
                res.redirect('/user/profil')
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async laporGet (req,res) {
        try {
            res.render('user/lapor', {
                title: 'Tulis Laporan'
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
                id_masyarakat: req.session.aidi
            })

            res.render('user/lapor', {
                title: 'Tulis Laporan',
                message: 'Laporan Terkirim, Silahkan Tunggu Balasan dari Petugas'
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayat (req,res) {
        try {
            const data = await db('laporan').where({id_masyarakat: req.session.aidi})

            res.render('user/riwayat', {
                title: 'Riwayat Laporan',
                data
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayatDetail (req,res) {
        try {
            const dataLaporan = await db('laporan').where({id_laporan: req.params.idLap})
            const dataBalasan = await db('balasan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: req.session.aidi})

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

    static async logout (req,res) {
        try {
            req.session.destroy()
            res.redirect('/')
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }
}

module.exports = UserController