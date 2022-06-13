const chatService = require('../services/conversations');
const { errorLogger } = require('../middleware/infoLogger'); 

const getAllConversations = async (req, res) => {
    try {
        const allConversations = await chatService.getAllConversations();
        res.status(200).send(allConversations);
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
    }
}

module.exports = {
    getAllConversations
}