const {Sequelize} = require('sequelize')
const settings = require('./config/config.json').development
const argon = require('argon2')
const { Op } = require("sequelize");

const sequelize = new Sequelize(settings.database, settings.username, settings.password, {
    host: settings.host,
    dialect: settings.dialect,
    logging: false
})

const userModel = require('./models/user')(sequelize, Sequelize)
const messageModel = require('./models/message')(sequelize, Sequelize)

async function connectToDatabase() {
    try {
        await sequelize.authenticate()
        console.log("Connection has been established successfully")
    } catch (error) {
        console.error("Unable to connect to the database: ", error)
    }
}

async function findAllUsers() {
    return await userModel.findAll()
}

async function findUser(username) {
    return await userModel.findOne({
        where: {
            username: username
        }
    })
}

async function isUserExist(username) {
    let user = await findUser(username)
    return (user !== undefined && user !== null)
}

async function getUserPassword(username) {
    let user = await findUser(username)
    return user.password
}

async function findUserById(id) {
    return await userModel.findOne({
        where: {
            id: id
        }
    })
}

async function createNewUser(username, password, email) {
    const hashedPassword = await argon.hash(password);

    let res = await argon.verify(hashedPassword, password);

    if (res) {
        let newUser = userModel.build({
            username: username,
            password: hashedPassword,
            email: email
        });

        return await newUser.save();

    }

    return undefined;

}


async function addMessage(message, from, to) {

    if (!message || !from || !to) {
        return undefined
    }

    let newMessage = messageModel.build({
        message: message,
        from: from,
        to: to,
        read: false
    })

    return await newMessage.save();
}

async function checkMessages(from, to) {

    try {
        return await messageModel.findAll({
            where: {
                [Op.or]: [
                    {
                        from: from,
                        to: to
                    },
                    {
                        from: to,
                        to: from
                    }
                ]
            }
        })
    } catch (e) {
        console.log(e)
        return undefined
    }
}

exports.sequelize = sequelize;
exports.getUserPassword = getUserPassword;
exports.isUserExist = isUserExist;
exports.User = userModel;
exports.createNewUser = createNewUser;
exports.findAllUsers = findAllUsers;
exports.findUserById = findUserById;
exports.connectToDatabase = connectToDatabase;
exports.findUser = findUser
exports.addMessage = addMessage
exports.checkMessages = checkMessages