const mongoDbConfig = require('../db/mongoConfig');
const mongoose = require('mongoose');

class MyMongoClient {
    constructor() {
        (this.conected = false), (this.client = mongoose);
    }

    async conect() {
        try {
            this.client.connect(mongoDbConfig.url, mongoDbConfig.config, err=>{
                if(err) throw new Error("Failed connecting to Mongo");
                console.log("Successfully connected to Mongo");
            });
        } catch (error) {
          throw "Error al conectar a la DB";
        }
      }
    
      async disconect() {
        try {
          await this.client.close();
          console.log("Base de datos desconectada!");
        } catch (error) {
          throw "Error al desconectar  la DB";
        }
      }
}

module.exports = MyMongoClient