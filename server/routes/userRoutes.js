const express = require('express')
const route = express.Router()
const UserController = require('../controllers/UserController')

route.get('/', UserController.homePage)

route.get('/tulis-laporan')

route.get('/riwayat')

module.exports = route