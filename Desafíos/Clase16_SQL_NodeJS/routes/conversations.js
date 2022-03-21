const express = require('express');
const dbOptions = require('../db/mysqlconfig.js');

const Chat = require('../Chat');

const router = express.Router()

const chat = new Chat(dbOptions, 'chats');

router.get('/', async (req, res) => {
    const allConversations = await chat.getAllConversations();
    res.status(200).send(allConversations);
});

module.exports = router;