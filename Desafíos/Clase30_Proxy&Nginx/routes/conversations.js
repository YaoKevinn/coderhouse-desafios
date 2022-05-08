const express = require('express');

const ChatFsContainer = require('../containers/ChatFsContainer');
const chatFsContainer = new ChatFsContainer('conversations.txt');

const router = express.Router();

router.get('/', async (req, res) => {
    const allConversations = await chatFsContainer.getAllConversations();
    res.status(200).send(allConversations);
});

module.exports = router;