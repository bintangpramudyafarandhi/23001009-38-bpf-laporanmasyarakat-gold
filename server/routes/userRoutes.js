const express = require('express')
const route = express.Router()
const UserController = require('../controllers/UserController')

route.get('/:id', UserController.homePage)

route.post('/:id', UserController.laporan)

route.get('/:id/profile', UserController.profile)

route.post('/:id/profile/edit', UserController.edit)

route.get('/riwayat')

module.exports = route