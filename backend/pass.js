const pass = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const argon = require('argon2')

const User = require('./db_connection').User
const createNewUser = require('./db_connection').createNewUser
const isUserExist = require('./db_connection').isUserExist
const getUserPassword = require('./db_connection').getUserPassword
const findUserById = require('./db_connection').findUserById
const findUser = require('./db_connection').findUser


const loginStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    let user = await findUser(username)
    if (user === undefined || user === null) return done(null, false, {message: "No such user"})
    let hash = await getUserPassword(username)

    let result = await argon.verify(hash, password)

    if (result) {
        return done(null, user)
    }

    return done(null, false, {message: "Incorrect password"})

})


const registerStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    if(!req.body.email) {
        return done(null, false, {message: "No email"})
    }

    let exist = await isUserExist(username,req.body.email)
    if (!exist) {
        let newUser = await createNewUser(username, password, req.body.email)
        if (newUser) {
            return done(null, newUser)
        }

        return done(null, false, {message: "Cannot create user"})
    }

    return done(null, false, {message: "This user already exist"})
})


const cookieStrategy = new CookieStrategy({
    cookieName: "cookies",
    passReqToCallback: true
}, async (req, session, done) => {
    if (!req.user) return done(null, false, {message: "You should authorize to access this page"});

    let user = await findUser(req.user.username)

    if (user !== undefined && user !== null) {
        return done(null, user)
    }

    return done(null, false, {message: "You should authorize to access this page"});

})

pass.serializeUser((user, done) => {
    done(null, user.id)
})

pass.deserializeUser((id, done) => {
    findUserById(id).then(user => {
        done(null, user)
    })
})

pass.use('login', loginStrategy)
pass.use('register', registerStrategy)
pass.use('cookie', cookieStrategy)

exports.passport = pass;