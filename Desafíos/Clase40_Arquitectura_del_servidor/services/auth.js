const parseArgs = require('minimist');
const defaultOptions = { default: { port: 8080, dbType: 'mongo' } }
const args = parseArgs(process.argv.slice(2), defaultOptions);

const MyDaoFactory = require('../containers/MyDaoFactory');
const userDao = MyDaoFactory.getInstance().createDao(args.dbType, 'user');

const getUserByUsername = async (username) => {
    return userDao.checkIfUserExists(username);
}

const addUser = async (username, password) => {
    return userDao.addItem({
        username,
        password
    });
}

module.exports = {
    getUserByUsername,
    addUser
}