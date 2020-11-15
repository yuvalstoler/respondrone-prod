import {MongoConnector} from "../mongoConnector";

export class CollectionVersionModel {

    constructor() {
    }


    public getSchema() {
        const schema = new (MongoConnector.getMongoose()).Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getMongoose().model('collectionVersion', schema);
    }
}

