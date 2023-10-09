const express = require('express')
const route = express.Router()
const adminRoute = require('./adminRoutes')
const userRoute = require('./userRoutes')
const Controller = require('../controllers/Controller')

route.get('/', Controller.homePage)

route.use('/admin', adminRoute)

route.use('/user', userRoute)

module.exports = route