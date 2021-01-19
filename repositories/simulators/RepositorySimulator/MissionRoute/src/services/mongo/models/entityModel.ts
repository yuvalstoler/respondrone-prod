import {MongoConnector} from '../mongoConnector';
const mongoose = require('mongoose');

const projConf = require("./../../../../config/projConf.json");
const col = projConf.Mongo.col;

export class EntityModel {

    constructor() {
    }


    public getSchema() {
        const schema = new mongoose.Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getConnection().model(col, schema);
    }
}

