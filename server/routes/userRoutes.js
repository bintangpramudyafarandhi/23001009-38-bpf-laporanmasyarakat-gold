const express = require('express')
const route = express.Router()
const UserController = require('../controllers/UserController')

route.get('/:id', UserController.homePage)

route.get('/:id/profil', UserController.profil)
route.get('/:id/profil/edit', UserController.profilEditGet)
route.post('/:id/profil/edit', UserController.profilEditPost)

route.get('/:id/lapor', UserController.laporGet)
route.post('/:id/lapor', UserController.laporPost)

route.get('/:id/riwayat', UserController.riwayat)
route.get('/:id/riwayat/:idLap', UserController.riwayatDetail)

module.exports = route