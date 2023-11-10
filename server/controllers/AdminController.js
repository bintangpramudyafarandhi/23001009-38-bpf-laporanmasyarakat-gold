const db = require("../db/db")

class AdminController {
    static async homePage (req, res) {
        try {
            const data = await db('petugas').where({id: req.params.id}).select('nama', 'id')

            res.render('admin/index', {
                title: 'Halaman Petugas',
                nama: data[0].nama,
                id: data[0].id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async profile (req,res) {
        try {
            const data = await db('petugas').where({id: req.params.id}).select('*')

            res.render('admin/profile', {
                title: 'Profil Anda',
                profile: data[0],
                id: data[0].id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async editProfileGet (req,res) {
        try {
            const data = await db('petugas').where({id: req.params.id})
            res.render('admin/edit-profile', {
                title: 'Edit Profil',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async editProfilePost (req, res) {
        try {
            const {username, nama, no_telp, alamat} = req.body
            const errors = []

            const usernameDupe = await db('petugas').whereNot({id: req.params.id}).where({username: username.replace(/\s+/g,'').toLowerCase()})
            const noTelpDupe = await db('petugas').whereNot({id: req.params.id}).where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

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
                    id: req.params.id
                }).update({
                    username: username.replace(/\s+/g,'').toLowerCase(),
                    nama,
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    updated_at: new Date()
                })

                res.redirect(`/admin/${req.params.id}/profil`)
            } else {
                const data = await db('petugas').where({id: req.params.id})
                res.render('admin/edit-profile', {
                    title: 'Edit Profil',
                    data,
                    id: req.params.id,
                    errors
                })
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

            res.render('admin/dashboard', {
                title: 'dasbor',
                semua,
                belum,
                sudah,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatList (req,res) {
        try {
            const data = await db('masyarakat').select('*').orderBy('id', 'asc')

            res.render('admin/masyarakat', {
                title: 'Daftar Masyarakat',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatDetail (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.params.idMasyarakat})

            res.render('admin/masyarakat-detail', {
                title: `${data[0].nama}`,
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatEditGet (req,res) {
        try {
            const data = await db('masyarakat').where({id: req.params.idMasyarakat})

            res.render('admin/masyarakat-edit', {
                title: data[0].nama,
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatEditPost (req, res) {
        try {
            const {nik, nama, no_telp, alamat} = req.body
            const errors = []
            
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
                    title: data[0].nama,
                    data,
                    id: req.params.id,
                    errors
                })
            } else {
                await db('masyarakat').where({id: req.params.idMasyarakat}).update({
                    nik,
                    nama,
                    no_telp,
                    alamat,
                    updated_at: new Date()
                })                
                res.redirect(`/admin/${req.params.id}/masyarakat`)
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async masyarakatDelete (req,res) {
        try {
            await db('masyarakat').where({id: req.params.idMasyarakat}).del()
            res.redirect(`/admin/${req.params.id}/masyarakat`)
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasList (req,res) {
        try {
            const data = await db('petugas').whereNot({id: req.params.id}).orderBy('id', 'asc')

            res.render ('admin/petugas', {
                title: 'Daftar Petugas',
                data,
                id : req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasRegisGet (req,res) {
        try {
            res.render('admin/petugas-register', {
                title: 'Tambah Petugas',
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasRegisPost (req,res) {
        try {
            const {username, nama, no_telp, alamat} = req.body
            const errors = []
            
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
                    password: 'admin',
                    created_at: new Date(),
                    updated_at: new Date()
                })
                res.redirect(`/admin/${req.params.id}/petugas`)
            } else {
                res.render('admin/petugas-register', {
                    title: 'Tambah Petugas',
                    id: req.params.id,
                    errors
                })
            }
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async petugasDetail (req,res) {
        try {
            const data = await db('petugas').where({id: req.params.idPetugas})

            res.render('admin/petugas-detail', {
                title: data[0].nama,
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})   
        }
    }

    static async belumBalas (req,res) {
        try {
            const data = await db('laporan').join('masyarakat', 'laporan.id_masyarakat', '=', 'masyarakat.id').where('laporan.status', '=', false)

            res.render('admin/laporan', {
                title: 'Belum Dibalas',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async belumBalasDetail (req,res) {
        try {
            const dataLap = await db('laporan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: dataLap[0].id_masyarakat})

            res.render('admin/laporan-detail', {
                title: 'Info Laporan',
                dataLap,
                dataUser,
                id: req.params.id
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
                id_petugas: req.params.id
            }).then(() => {
                return db('laporan').where({id_laporan: req.params.idLap}).update({status: true})
            })

            res.redirect(`/admin/${req.params.id}/laporan`)
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async sudahBalas (req,res) {
        try {
            const data = await db('laporan').join('masyarakat', 'laporan.id_masyarakat', '=', 'masyarakat.id').select('*').where('laporan.status', '=', true)

            res.render('admin/selesai', {
                title: 'Laporan yang Sudah Dibalas',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async sudahBalasDetail (req,res) {
        try {
            const dataLap = await db('laporan').where({id_laporan: req.params.idLap})
            const dataUser = await db('masyarakat').where({id: dataLap[0].id_masyarakat})
            const dataBalas = await db('balasan').where({id_laporan: req.params.idLap})
            const dataAdmin = await db('petugas').where({id: dataBalas[0].id_petugas})

            res.render('admin/selesaiDetail', {
                title: 'Detail Laporan',
                dataLap: dataLap[0],
                dataUser: dataUser[0],
                dataAdmin: dataAdmin[0],
                dataBalas: dataBalas[0],
                id: req.params.id
            })

        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }

    static async riwayat (req,res) {
        try {
            const data = await db('balasan').join('laporan', 'laporan.id_laporan', '=', 'balasan.id_laporan').join('masyarakat', 'masyarakat.id', '=', 'laporan.id_masyarakat').where({id_petugas: req.params.id})

            res.render('admin/riwayat', {
                title: 'Riwayat Anda',
                data,
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})   
        }
    }

    static async riwayatDetail (req,res) {
        try {
            const data = await db('balasan').join('laporan', 'laporan.id_laporan', '=', 'balasan.id_laporan').join('masyarakat', 'masyarakat.id', '=', 'laporan.id_masyarakat').where({id_balasan: req.params.idBalasan})
            const dataAdmin = await db('petugas').where({id: req.params.id}).select('nama', 'alamat', 'no_telp')
            res.render('admin/riwayat-detail', {
                title: 'Info Laporan dari Riwayat',
                data: data[0],
                dataAdmin: dataAdmin[0],
                id: req.params.id
            })
        } catch (error) {
            res.status(500).json({'Error': error.message})
        }
    }
}

module.exports = AdminController