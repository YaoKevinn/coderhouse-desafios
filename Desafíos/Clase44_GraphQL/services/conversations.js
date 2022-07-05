const ChatFsContainer = require('../containers/ChatFsContainer');
const chatFsContainer = new ChatFsContainer('conversations.txt');

const getAllConversations = () => {
    return chatFsContainer.getAllConversations();
}

module.exports = {
    getAllConversations
}