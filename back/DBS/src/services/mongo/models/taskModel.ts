import {MongoConnector} from "../mongoConnector";

export class TaskModel {

    constructor() {
    }


    public getSchema() {
        const schema = new (MongoConnector.getMongoose()).Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getMongoose().model('task', schema);
    }
}

