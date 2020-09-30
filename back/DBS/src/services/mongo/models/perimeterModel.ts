import {MongoConnector} from "../mongoConnector";

export class PerimeterModel {

    constructor() {
    }


    public getSchema() {
        const schema = new (MongoConnector.getMongoose()).Schema({
            id: String
        }, {strict: false});

        return MongoConnector.getMongoose().model('Perimeter', schema);
    }
}

