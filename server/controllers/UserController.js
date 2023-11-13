const db = require('../db/db')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')

class UserController {
    static async homePage (req, res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')
            res.render('user/index', {
                layout: 'layout/user-sidebar',
                title: 'Laporan Masyarakat Depok',
                data,
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profil (req, res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi})

            res.render('user/profile' , {
                layout: 'layout/user-sidebar',
                title: 'Profil Anda',
                data: data[0],
                nama: data[0].nama,
                message: req.flash('success')
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profilEditGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi})

            res.render('user/profile-edit', {
                layout: 'layout/user-sidebar',
                title: 'Edit Profil',
                data: data[0],
                nama: data[0].nama
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
                req.flash('success', 'Profil Berhasil Diubah!')
                res.redirect(`/user/profil`)
            } else {
                const data = await db('masyarakat').where({id: req.session.aidi})
                res.render('user/profile-edit', {
                    layout: 'layout/user-sidebar',
                    title: 'Edit Profil',
                    data: data[0],
                    errors,
                    nama: data[0].nama
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async passwordGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')
            res.render('user/password', {
                layout: 'layout/user-sidebar',
                title: 'Ubah Password',
                pass: false,
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async passwordPost (req,res) {
        try {
            const {password} = req.body

            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')
            const oldPassword = await db('masyarakat').where({id: req.session.aidi}).select('password')
            const passCheck = await bcrypt.compare(password, oldPassword[0].password)

            if (passCheck) {
                res.render('user/password', {
                    layout: 'layout/user-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    nama: data[0].nama
                })
            } else {
                res.render('user/password', {
                    layout: 'layout/user-sidebar',
                    title: 'Ubah Password',
                    pass: false,
                    errors: 'Password Salah',
                    nama: data[0].nama
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
            const data = await db('masyarakat').where({id: req.session.aidi})
            const oldPassword = await db('masyarakat').where({id: req.session.aidi}).select('password')

            const oldPassCheck = await bcrypt.compare(password, oldPassword[0].password)

            if (spaceCheck) {
                res.render('user/password', {
                    layout: 'layout/user-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    errors: 'Password Tidak Bisa Mengandung Spasi',
                    nama: data[0].nama
                })
            } else if (oldPassCheck) {
                res.render('user/password', {
                    layout: 'layout/user-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    errors: 'Password Tidak Bisa Sama Seperti Password Lama',
                    nama: data[0].nama
                })
            } else {
                await db('masyarakat').where({id: req.session.aidi}).update({
                    password: await bcrypt.hash(password, 10),
                    updated_at: new Date()
                })
                req.flash('success', 'Password Berhasil Diubah!')
                res.redirect('/user/profil')
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async laporGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')
            res.render('user/lapor', {
                layout: 'layout/user-sidebar',
                title: 'Tulis Laporan',
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async laporPost (req,res) {
        try {
            const {isi_laporan} = req.body
            const foto = req.file

            const data = await db('masyarakat').where({id: req.session.aidi}).select('nama')

            if (!foto || !foto.path) {
                await db('laporan').insert({
                    tgl_laporan: new Date(),
                    isi_laporan,
                    status: false,
                    id_masyarakat: req.session.aidi
                })
            } else {
                await db('laporan').insert({
                    tgl_laporan: new Date(),
                    isi_laporan,
                    status: false,
                    foto: foto.path,
                    id_masyarakat: req.session.aidi
                })
            }

            res.render('user/lapor', {
                layout: 'layout/user-sidebar',
                title: 'Tulis Laporan',
                message: 'Laporan Terkirim, Silahkan Tunggu Balasan dari Petugas!',
                nama: data[0].nama
            })

            // res.status(201).json({
            //     data: req.body,
            //     foto: req.file
            // })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayat (req,res) {
        try {
            const data = await db('laporan').where({id_masyarakat: req.session.aidi})
            const dataUser = await db('masyarakat').where({id: req.session.aidi}).select('nama')

            res.render('user/riwayat', {
                layout: 'layout/user-sidebar',
                title: 'Riwayat Laporan',
                data,
                nama: dataUser[0].nama
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
                    layout: 'layout/user-sidebar',
                    title: 'Info Laporan',
                    dataLaporan: dataLaporan[0],
                    dataBalasan: dataBalasan[0],
                    dataUser: dataUser[0],
                    dataAdmin: dataAdmin[0],
                    nama: dataUser[0].nama
                })
            } else {
                res.render('user/riwayat-detail', {
                    layout: 'layout/user-sidebar',
                    title: 'Info Laporan',
                    dataLaporan: dataLaporan[0],
                    dataUser: dataUser[0],
                    nama: dataUser[0].nama
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