const MongoContainer = require('../containers/MongoContainer');
const UserS = require('../models/User');
const userManager = new MongoContainer(UserS);

const getUserByUsername = async (username) => {
    return userManager.checkIfUserExists(username);
}

const addUser = async (username, password) => {
    return userManager.addItem({
        username,
        password
    });
}

module.exports = {
    getUserByUsername,
    addUser
}