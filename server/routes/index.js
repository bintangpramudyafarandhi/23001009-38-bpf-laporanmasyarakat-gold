const express = require('express')
const route = express.Router()
const adminRoute = require('./adminRoutes')
const userRoute = require('./userRoutes')
const Controller = require('../controllers/Controller')

route.get('/', Controller.homePage)
route.post('/', Controller.login)

route.get('/login-petugas', Controller.loginPetugasGet)
route.post('/login-petugas', Controller.loginPetugasPost)

route.get('/register', Controller.registerGet)
route.post('/register', Controller.registerPost)

route.use('/admin', adminRoute)

route.use('/user', userRoute)

module.exports = route