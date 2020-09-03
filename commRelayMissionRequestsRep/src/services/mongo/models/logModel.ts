import {MongoConnector} from "../mongoConnector";
const mongoose = require('mongoose');

const projConf = require("./../../../../config/projConf.json");
const col = projConf.LogsMongo.col;

export class LogModel {

    constructor() {
    }


    public getSchema() {
        const schema = new mongoose.Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getLogsConnection().model(col, schema);
    }
}

