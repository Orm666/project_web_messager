const {findUser} = require("./db_connection");
const {findUserById} = require("./db_connection");
const router = require('express').Router()
const passport = require('./pass').passport
const addMessage = require('./db_connection').addMessage
const checkMessages = require('./db_connection').checkMessages

router.use((req, res, next) => {
    let date = new Date();
    console.log(`${date} ${req.method} request at ${req.url} from ${req.ip}`);
    next();
})


router.get('/api/users', async (req, res) => {
    if (req.query.id) {
        let toID = Number(req.query.id)
        let user = await findUserById(toID)
        if (user) {
            res.send({
                result: user.username
            })
        } else {
            res.send({
                error: "No such user"
            })
        }
    } else {
        if (req.user) {
            res.send({
                result: req.user.id
            })
        } else {
            res.send({
                error: "No such user"
            })
        }
    }
})

router.get('/api/error', (req, res) => {
    let err = req.flash()

    console.log(err)
    if (err) {

        res.send(err)

    } else {
        res.send({error: "Unknown error"})
    }

})

router.post('/api/users', passport.authenticate('login',
    {
        failureRedirect: '/api/error',
        failureFlash: true
    }), (req, res) => {
    res.send({result: req.user.id});
})

router.get('/api/logout', function (req, res) {
    req.logout();
    res.send({
        message: {result: "Success"}
    })
})

router.post('/api/registration', passport.authenticate('register', {
    failureRedirect: '/api/error',
    failureFlash: true
}), (req, res) => {
    res.send({result: "Success"});
})

router.get('/api/messages', passport.authenticate('cookie', {
    failureRedirect: '/api/error',
    failureFlash: true
}), async (req, res) => {
    let id = req.user.id
    let toId;
    if (req.query.id) {
        toId = Number(req.query.id)
    } else if (req.query.name) {
        let user = await findUser(req.query.name);
        if (!user) {
            res.send({
                error: "No data"
            })
        }
        toId = Number(user.id)
    } else {
        res.send({
            error: "No data"
        })
    }
    res.send(await checkMessages(id, toId))
})

router.post('/api/messages', passport.authenticate('cookie', {
    failureRedirect: '/api/error',
    failureFlash: true
}), async (req, res) => {
    let message = req.body.message
    let sendToUser = await findUser(req.body.to)
    if (!sendToUser) {
        res.send({error: "No such user"})
    }
    let target = Number(sendToUser.id)
    let source = Number(req.user.id)

    let result = await addMessage(message, source, target)

    if (!result) {
        res.send({error: "Incorrect data"})
    } else {

        res.send({result: "Success"})
    }

})

router.use(function (req, res, next) {
    let err = new Error("NO PAGE")
    err.statusCode = 404
    next(err)
});

router.use(function (err, req, res, next) {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    res.send("Error with status code " + err.statusCode)
});

module.exports = router