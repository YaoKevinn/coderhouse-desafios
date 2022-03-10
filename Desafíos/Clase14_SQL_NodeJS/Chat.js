const knex = require('knex');

module.exports = class Chat {

    constructor(dbOption, tableName) {
        this.dbOption = dbOption;
        this.tableName = tableName;
    }

    async writeMessage(author, message) {
        const database = knex(this.dbOption);
        const newConversation = {
            author,
            message,
            creationTime: new Date().toISOString(), 
        }
        try {
            const response = await database(this.tableName).insert([newConversation]);
            return {
                ...newConversation,
                id: response[0],
            };
        } catch(err) {
            console.log(err);
            return undefined;
        } finally {
            database.destroy();
        }
    }

    async getAllConversations() {
        const database = knex(this.dbOption);
        try {
            const data = await database.from(this.tableName).select('*');
            const conversations = JSON.parse(JSON.stringify(data));
            // console.log(products);
            return conversations;
        } catch (error) {
            console.log(err);
            return [];
        } finally {
            database.destroy();
        }
    }
}