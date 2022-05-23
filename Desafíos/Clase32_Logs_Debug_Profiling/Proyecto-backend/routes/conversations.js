const express = require('express');

const ChatFsContainer = require('../containers/ChatFsContainer');
const chatFsContainer = new ChatFsContainer('conversations.txt');

const router = express.Router();
const { errorLogger } = require('../middleware/infoLogger'); 

router.get('/', async (req, res) => {
    try {
        const allConversations = await chatFsContainer.getAllConversations();
        res.status(200).send(allConversations);
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
    }
});

module.exports = router;