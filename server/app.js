const express = require('express')
const app = express()
const routes = require('./routes/')
const ejs = require('ejs')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const expressEjsLayouts = require('express-ejs-layouts')
const port = 3000

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(expressEjsLayouts)
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'oreo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 60000
    }
}))
app.use(flash())

app.use(routes)

app.use('/',(req,res) => {
    res.status(404)
    res.render('404', {
        layout: '404'
    })
})
  
app.listen(port, () => {
    console.log(`I Love You ${port}`)
})