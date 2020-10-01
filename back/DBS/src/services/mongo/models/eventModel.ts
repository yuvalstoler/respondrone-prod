import {MongoConnector} from "../mongoConnector";

export class EventModel {

    constructor() {
    }

// TODO - create event schema data
    public getSchema() {
        const schema = new (MongoConnector.getMongoose()).Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getMongoose().model('event', schema);
    }
}

