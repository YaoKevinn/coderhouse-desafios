const fs = require('fs');

module.exports = class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async writeMessage(author, message) {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');

            const conversationsArray = JSON.parse(data);
            const newId = conversationsArray.length === 0 ? 1 : (conversationsArray.slice(-1)[0].id + 1);
            const newConversation = {
                author,
                message,
                creationTime: new Date().toISOString(),
                id: newId,
            }
            conversationsArray.push(newConversation);

            await fs.promises.writeFile(this.fileName, JSON.stringify(conversationsArray, null, 2), (error) => {
                console.log('Error guardando conversación: ', error);
            });
            return newConversation;
        } catch(error) {
            console.log('Archivo no encontrado, intentando crear nuevo archivo...');

            const conversationsArray = [{
                author,
                message,
                creationTime: new Date().toISOString(),
                id: 1,
            }];

            await fs.promises.writeFile(this.fileName, JSON.stringify(conversationsArray, null, 2), (error) => {
                console.log('Error guardando conversación: ', error);
            });

            return 1;
        }
    }

    async getAllConversations() {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            const conversationsArray = JSON.parse(data);
            return conversationsArray;
        } catch (error) {
            console.log('Archivo no encontrado');
        }
    }
}