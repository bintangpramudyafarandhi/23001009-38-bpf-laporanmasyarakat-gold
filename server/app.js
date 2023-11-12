const express = require('express')
const app = express()
const routes = require('./routes/')
const ejs = require('ejs')
const port = 3000
const session = require('express-session')

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'oreo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 60000
    }
}))

app.use(routes)

app.use('/',(req,res) => {
    res.status(404)
    res.send('Error 404 : Page not found.')
})
  
app.listen(port, () => {
    console.log(`I Love You ${port}`)
})