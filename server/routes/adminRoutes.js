const express = require('express')
const route = express.Router()
const AdminController = require('../controllers/AdminController')

route.get('/', AdminController.homePage)

route.post('/:id/laporan/:idLap', AdminController.balas)

route.get('/dashboard')

route.get('/masyarakat')

route.get('/blm-balas')

route.get('/selesai')

route.get('/laporan')

module.exports = route