const db = require("../db/db")
const bcrypt = require('bcrypt')

class AdminController {
    static async homePage (req, res) {
        try {
            const data = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/index', {
                layout: 'layout/admin-sidebar',
                title: 'Halaman Petugas',
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profile (req,res) {
        try {
            const data = await db('petugas').where({id: req.session.aidi})

            res.render('admin/profile', {
                layout: 'layout/admin-sidebar',
                title: 'Profil Anda',
                data: data[0],
                message: req.flash('success'),
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async editProfileGet (req,res) {
        try {
            const data = await db('petugas').where({id: req.session.aidi})
            res.render('admin/edit-profile', {
                layout: 'layout/admin-sidebar',
                title: 'Edit Profil',
                data,
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async editProfilePost (req, res) {
        try {
            const {username, nama, no_telp, alamat} = req.body
            const errors = []

            const usernameDupe = await db('petugas').whereNot({id: req.session.aidi}).where({username: username.replace(/\s+/g,'').toLowerCase()})
            const noTelpDupe = await db('petugas').whereNot({id: req.session.aidi}).where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

            if (usernameDupe.length > 0) {
                errors.push({message: 'Username Tidak Tersedia'})
            }

            if (noTelpDupe.length > 0) {
                errors.push({message: 'Nomor Telepon Sudah Terdaftar'})
            }

            if (no_telp.replace(/\s+/g,'').length < 9 || no_telp.replace(/\s+/g,'').length > 12) {
                errors.push({message: 'Nomor Telepon Tidak Valid'})
            }

            if (errors.length == 0) {
                await db('petugas').where({
                    id: req.session.aidi
                }).update({
                    username: username.replace(/\s+/g,'').toLowerCase(),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    updated_at: new Date()
                })
                req.flash('success', 'Profil Berhasil Diubah!')
                res.redirect(`/admin/profil`)
            } else {
                const data = await db('petugas').where({id: req.session.aidi})
                res.render('admin/edit-profile', {
                    layout: 'layout/admin-sidebar',
                    title: 'Edit Profil',
                    data,
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
            const data = await db('petugas').where({id: req.session.aidi}).select('nama')
            res.render('admin/password', {
                layout: 'layout/admin-sidebar',
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

            const oldPassword = await db('petugas').where({id: req.session.aidi}).select('password', 'nama')
            const passCheck = await bcrypt.compare(password, oldPassword[0].password)

            if (passCheck) {
                res.render('admin/password', {
                    layout: 'layout/admin-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    nama: oldPassword[0].nama
                })
            } else {
                res.render('admin/password', {
                    layout: 'layout/admin-sidebar',
                    title: 'Ubah Password',
                    pass: false,
                    errors: 'Password Salah',
                    nama: oldPassword[0].nama
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async passwordPostNew (req,res) {
        try {
            const {password} = req.body
            const oldPassword = await db('petugas').where({id: req.session.aidi}).select('nama', 'password')
            const spaceCheck = /\s/.test(password)
            const oldPassCheck = await bcrypt.compare(password, oldPassword[0].password)

            if (spaceCheck) {
                res.render('admin/password', {
                    layout: 'layout/admin-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    errors: 'Password Tidak Bisa Mengandung Spasi',
                    nama: oldPassword[0].nama
                })
            } else if (oldPassCheck) {
                res.render('admin/password', {
                    layout: 'layout/admin-sidebar',
                    title: 'Ubah Password',
                    pass: true,
                    errors: 'Password Tidak Bisa Sama Seperti Password Lama',
                    nama: oldPassword[0].nama
                })
            } else {
                await db('petugas').where({id: req.session.aidi}).update({
                    password: await bcrypt.hash(password,10),
                    updated_at: new Date()
                })
                req.flash('success', 'Password Berhasil Diubah!')
                res.redirect('/admin/profil')
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async dashboard (req,res) {
        try {
            const semua = await db('laporan')
            const belum = await db('laporan').where({status: false})
            const sudah = await db('laporan').where({status: true})

            const data = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/dashboard', {
                layout: 'layout/admin-sidebar',
                title: 'dasbor',
                semua,
                belum,
                sudah,
                nama: data[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatList (req,res) {
        try {
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')
            const data = await db('masyarakat').orderBy('id', 'asc')

            res.render('admin/masyarakat', {
                layout: 'layout/admin-sidebar',
                title: 'Daftar Masyarakat',
                data,
                message: req.flash('success'),
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatDetail (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.params.idMasyarakat})
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/masyarakat-detail', {
                layout: 'layout/admin-sidebar',
                title: data[0].nama,
                data,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatEditGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.params.idMasyarakat})
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/masyarakat-edit', {
                layout: 'layout/admin-sidebar',
                title: data[0].nama,
                data,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatEditPost (req, res) {
        try {
            const {nik, nama, no_telp, alamat} = req.body
            const errors = []
            const data = await db('petugas').where({id: req.session.aidi}).select('nama')
            
            const nikDupe = await db('masyarakat').whereNot({id: req.params.idMasyarakat}).where({nik : nik.replace(/\s+/g,'')})
            const noTelpDupe = await db('masyarakat').whereNot({id: req.params.idMasyarakat}).where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

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

            if (errors.length > 0) {
                const data = await db('masyarakat').where({id: req.params.idMasyarakat})

                res.render('admin/masyarakat-edit', {
                    layout: 'layout/admin-sidebar',
                    title: data[0].nama,
                    data,
                    errors,
                    nama: nama[0].nama
                })
            } else {
                await db('masyarakat').where({id: req.params.idMasyarakat}).update({
                    nik: nik.replace(/\s+/g,''),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    updated_at: new Date()
                })
                req.flash('success', 'Data Berhasil Diubah!')           
                res.redirect(`/admin/masyarakat`)
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatDelete (req,res) {
        try {
            await db('masyarakat').where({id: req.params.idMasyarakat}).del()
            req.flash('success', 'Data Berhasil Dihapus!')
            res.redirect(`/admin/masyarakat`)
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasList (req,res) {
        try {
            const data = await db('petugas').whereNot({id: req.session.aidi})
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render ('admin/petugas', {
                layout: 'layout/admin-sidebar',
                title: 'Daftar Petugas',
                data,
                message: req.flash('success'),
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasRegisGet (req,res) {
        try {
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')
            res.render('admin/petugas-register', {
                layout: 'layout/admin-sidebar',
                title: 'Tambah Petugas',
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasRegisPost (req,res) {
        try {
            const {username, nama, no_telp, alamat} = req.body
            const errors = []
            
            const data = await db('petugas').where({id: req.session.aidi}).select('nama')
            const usernameDupe = await db('petugas').where({username: username.replace(/\s+/g,'').toLowerCase()})
            const noTelpDupe = await db('petugas').where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

            if (usernameDupe.length > 0) {
                errors.push({message: 'Username Tidak Tersedia'})
            }

            if (noTelpDupe.length > 0) {
                errors.push({message: 'Nomor Telepon Tidak Tersedia'})
            }

            if (no_telp.replace(/\s+/g,'').length < 9 || no_telp.replace(/\s+/g,'').length > 12) {
                errors.push({message: 'Nomor Telepon Tidak Valid'})
            }

            if (errors.length == 0) {
                await db('petugas').insert({
                    username: username.replace(/\s+/g,'').toLowerCase(),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    password: await bcrypt.hash('admin', 10),
                    created_at: new Date(),
                    updated_at: new Date()
                })
                req.flash('success', 'Data Berhasil Masuk!')
                res.redirect(`/admin/petugas`)
            } else {
                res.render('admin/petugas-register', {
                    layout: 'layout/admin-sidebar',
                    title: 'Tambah Petugas',
                    errors,
                    nama: data[0].nama
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasDetail (req,res) {
        try {
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')
            const data = await db('petugas').where({id: req.params.idPetugas})

            res.render('admin/petugas-detail', {
                layout: 'layout/admin-sidebar',
                title: data[0].nama,
                data,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})   
        }
    }

    static async belumBalas (req,res) {
        try {
            const data = await db('laporan').join('masyarakat', 'laporan.id_masyarakat', '=', 'masyarakat.id').where('laporan.status', '=', false)
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/laporan', {
                layout: 'layout/admin-sidebar',
                title: 'Belum Dibalas',
                data,
                message: req.flash('success'),
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async belumBalasDetail (req,res) {
        try {
            const dataLap = await db('laporan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: dataLap[0].id_masyarakat})
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/laporan-detail', {
                layout: 'layout/admin-sidebar',
                title: 'Info Laporan',
                dataLap,
                dataUser,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async balas (req, res) {
        try {
            const {isi_balasan} = req.body

            await db('balasan').insert({
                isi_balasan,
                tgl_balasan: new Date(),
                id_laporan: req.params.idLap,
                id_petugas: req.session.aidi
            }).then(() => {
                return db('laporan').where({id_laporan: req.params.idLap}).update({status: true})
            })
            req.flash('success', 'Berhasil Membalas Laporan!')
            res.redirect(`/admin/laporan`)
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async hapusLaporan (req,res) {
        try {
            await db('laporan').where({id_laporan: req.params.idLap}).del()
            req.flash('success', 'Berhasil Menghapus Laporan!')
            res.redirect('/admin/laporan')
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async sudahBalas (req,res) {
        try {
            const data = await db('laporan').join('masyarakat', 'laporan.id_masyarakat', '=', 'masyarakat.id').select('*').where('laporan.status', '=', true)
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/selesai', {
                layout: 'layout/admin-sidebar',
                title: 'Laporan yang Sudah Dibalas',
                data,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async sudahBalasDetail (req,res) {
        try {
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            const dataLap = await db('laporan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: dataLap[0].id_masyarakat})
            const dataBalas = await db('balasan').where({id_laporan: req.params.idLap})
            const dataAdmin = await db('petugas').where({id: dataBalas[0].id_petugas})

            res.render('admin/selesaiDetail', {
                layout: 'layout/admin-sidebar',
                title: 'Detail Laporan',
                dataLap: dataLap[0],
                dataUser: dataUser[0],
                dataAdmin: dataAdmin[0],
                dataBalas: dataBalas[0],
                nama: nama[0].nama
            })

        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayat (req,res) {
        try {
            const data = await db('balasan').join('laporan', 'laporan.id_laporan', '=', 'balasan.id_laporan').join('masyarakat', 'masyarakat.id', '=', 'laporan.id_masyarakat').where({id_petugas: req.session.aidi})
            const nama = await db('petugas').where({id: req.session.aidi}).select('nama')

            res.render('admin/riwayat', {
                layout: 'layout/admin-sidebar',
                title: 'Riwayat Anda',
                data,
                nama: nama[0].nama
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})   
        }
    }

    static async riwayatDetail (req,res) {
        try {
            const data = await db('balasan').join('laporan', 'laporan.id_laporan', '=', 'balasan.id_laporan').join('masyarakat', 'masyarakat.id', '=', 'laporan.id_masyarakat').where({id_balasan: req.params.idBalasan})
            const dataAdmin = await db('petugas').where({id: req.session.aidi}).select('nama', 'alamat', 'no_telp')
            res.render('admin/riwayat-detail', {
                layout: 'layout/admin-sidebar',
                title: 'Info Laporan dari Riwayat',
                data: data[0],
                dataAdmin: dataAdmin[0],
                nama: dataAdmin[0].nama
            })
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

module.exports = AdminController