const db = require('../db/db')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')

class Controller {
    static isLoggedInUser (req,res,next) {
        if (req.session.auth && req.session.role == 'user') {
            next()
        } else {
            if (req.session.role == 'admin') {
                res.redirect('/admin')
            } else {
                res.redirect('/')
            }
        } 
    }

    static isLoggedInAdmin (req,res,next) {
        if (req.session.role == 'admin') {
            next()
        } else {
            if (req.session.role == 'user') {
                res.redirect('/user')
            } else {
                res.redirect('/')
            }
        }
    }

    static isLoggedOut (req,res,next) {
        if (!req.session.auth) {
            next()
        } else {
            if (req.session.role == 'user') {
                res.redirect('/user')
            } else {
                res.redirect('/admin')
            }
        }
    }

    static homePage (req, res) {
        try {
            res.render('login', {
                layout: 'login',
                title: 'Laporan Masyarakat Depok',
                message: req.flash('success')
            })
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }

    static async login (req,res) {
        try {
            const {nik, password} = req.body
            const errors = []

            const find = await db('masyarakat').where({nik: nik})

            if (find.length > 0) {
                const passCheck = await bcrypt.compare(password, find[0].password)
                if (passCheck) {
                    req.session.auth = true
                    req.session.role = 'user'
                    req.session.aidi = find[0].id
                    res.redirect(`/user`)
                } else {
                    errors.push({message: 'NIK atau Password Salah'})
                    res.render('login', {
                        layout: 'login',
                        title: 'Laporan Masyarakat Depok',
                        errors
                    })
                }
            } else {
                errors.push({message: 'NIK atau Password Salah'})
                res.render('login', {
                    layout: 'login',
                    title: 'Laporan Masyarakat Depok',
                    errors
                })
            }
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }

    static async loginPetugasGet (req,res) {
        try {
            res.render('login-petugas', {
                layout: 'login-petugas',
                title: 'Login Petugas'
            })
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }

    static async loginPetugasPost (req,res) {
        try {
            const {username, password} = req.body
            const errors = []

            const find = await db('petugas').where({username: username})
            if (find.length > 0) {
                const passCheck = await bcrypt.compare(password,find[0].password)
                if (passCheck) {
                    req.session.auth = true
                    req.session.role = 'admin'
                    req.session.aidi = find[0].id
                    res.redirect(`/admin`)
                } else {
                    errors.push({message: 'Username atau Password Salah'})
                    res.render('login-petugas', {
                        layout: 'login-petugas',
                        title: 'Login Petugas',
                        errors
                    })
                }
            } else {
                errors.push({message: 'Username atau Password Salah'})
                res.render('login-petugas', {
                    layout: 'login-petugas',
                    title: 'Login Petugas',
                    errors
                })
            }
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }

    static async registerGet (req,res) {
        try {
            res.render('register', {
                layout: 'register',
                title: 'Halaman Registrasi',
            })
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }

    static async registerPost (req,res) {
        try {
            const {nik, nama, password, no_telp, alamat} = req.body

            const errors = []

            const nikDupe = await db('masyarakat').where({nik : nik.replace(/\s+/g,'')})
            const noTelpDupe = await db('masyarakat').where({no_telp: no_telp.replace(/\s+/g,'').substring(1)})

            if (nikDupe.length > 0) {
                errors.push({message: 'NIK Sudah Terdaftar'})
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
                await db('masyarakat').insert({
                    nik: nik.replace(/\s+/g,''),
                    nama,
                    password: await bcrypt.hash(password,10),
                    no_telp: no_telp.replace(/\s+/g,''),
                    alamat,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                req.flash('success', 'Registrasi Berhasil, Silahkan Login!')
                res.redirect('/')
            } else {
                res.render('register', {
                    layout: 'register',
                    title: 'Halaman Register',
                    errors
                })
            }
        } catch (error) {
            res.status(500).json({'Error' : error.message})
        }
    }
}

module.exports = Controller