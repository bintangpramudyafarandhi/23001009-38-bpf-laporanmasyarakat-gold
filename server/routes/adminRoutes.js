const express = require('express')
const route = express.Router()
const AdminController = require('../controllers/AdminController')

route.get('/', AdminController.homePage)

route.get('/dashboard')

route.get('/masyarakat')

route.get('/unresponded')

route.get('/responded')

route.get('/laporan')

module.exports = route