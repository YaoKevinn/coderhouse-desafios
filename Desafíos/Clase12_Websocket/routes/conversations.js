const express = require('express');

const Chat = require('../Chat');

const router = express.Router()

const chat = new Chat('./conversations.txt');

router.get('/', async (req, res) => {
    const allConversations = await chat.getAllConversations();
    res.status(200).send(allConversations);
});

module.exports = router;