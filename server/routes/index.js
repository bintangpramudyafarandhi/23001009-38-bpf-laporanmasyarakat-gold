const express = require('express')
const route = express.Router()
const adminRoute = require('./adminRoutes')
const userRoute = require('./userRoutes')
const Controller = require('../controllers/Controller')

route.get('/', Controller.isLoggedOut, Controller.homePage)
route.post('/', Controller.login)

route.get('/login-petugas', Controller.isLoggedOut, Controller.loginPetugasGet)
route.post('/login-petugas', Controller.loginPetugasPost)

route.get('/register', Controller.isLoggedOut, Controller.registerGet)
route.post('/register', Controller.registerPost)

route.use('/user', Controller.isLoggedInUser, userRoute)

route.use('/admin', Controller.isLoggedInAdmin, adminRoute)

module.exports = route