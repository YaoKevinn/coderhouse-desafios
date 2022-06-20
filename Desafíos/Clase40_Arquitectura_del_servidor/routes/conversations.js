const express = require('express');
const chatController = require('../controllers/conversations');
const router = express.Router();

router.get('/', chatController.getAllConversations);

module.exports = router;