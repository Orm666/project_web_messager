const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

const connectToDatabase = require('./db_connection').connectToDatabase
const routes = require('./routes')

const app = express()

app.use(cookieSession({
    name: "cookies",
    keys: ["qwertyuiop"],
    maxAge: 1000*60*60*24,
    secure: false,
    signed: true
}))

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(routes)

app.listen(3000, ()=> {
    connectToDatabase().then(()=> {
        console.log("CONNECT")
    }).catch(e => {
        console.log("NO CONNECT")
    })
})