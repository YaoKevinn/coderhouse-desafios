const fs = require('fs').promises;

const util = require('util');
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

function print(obj) {
    console.log(util.inspect(obj, false, 12, true));
}

// Definition Normalizr
const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});
const messageSchema = new schema.Entity('post', {
    author: authorSchema
});
const postsSchema = new schema.Entity('posts', {
    mensajes: [messageSchema],
});


module.exports = class ChatFsContainer {

    constructor(path) {
        this.path = path;
    }

    async writeMessage(author, message) {
        const item = await this.getAllConversations();
        const denormalizedData = denormalize(item.result, postsSchema, item.entities);
        const lastIndex = denormalizedData.mensajes.length - 1;
        const newId = denormalizedData.mensajes.length === 0 ? 1 : (+denormalizedData.mensajes[lastIndex].id + 1).toString();
        const newMessage = {
            author,
            text: message,
            creationTime: new Date().toISOString(),
            id: newId,
        }
        denormalizedData.mensajes.push(newMessage);
        const normalizedData = normalize(denormalizedData, postsSchema);
        await this.setItemsArrayToFile(normalizedData);
        return newMessage;
    }

    async getAllConversations() {
        try {
            const item = await fs.readFile(this.path, 'utf-8');
            const parseditem = JSON.parse(item);
            return parseditem;   
        } catch (err) {
            console.log('Error getting all items in file...', err);
            return {};
        }
    }

    async setItemsArrayToFile(items) {
        try {
            await fs.writeFile(this.path, JSON.stringify(items, null, 2));
        } catch (error) {
            console.log(error);
        }
    }
}