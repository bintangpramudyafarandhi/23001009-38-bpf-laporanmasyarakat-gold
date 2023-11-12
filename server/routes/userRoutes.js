const express = require('express')
const route = express.Router()
const UserController = require('../controllers/UserController')

route.get('/', UserController.homePage)

route.get('/profil', UserController.profil)
route.get('/profil/edit', UserController.profilEditGet)
route.post('/profil/edit', UserController.profilEditPost)
route.get('/profil/password', UserController.passwordGet)
route.post('/profil/password', UserController.passwordPost)
route.post('/profil/password/baru', UserController.passwordPostNew)

route.get('/lapor', UserController.laporGet)
route.post('/lapor', UserController.laporPost)

route.get('/riwayat', UserController.riwayat)
route.get('/riwayat/:idLap', UserController.riwayatDetail)

route.get('/logout', UserController.logout)

module.exports = route