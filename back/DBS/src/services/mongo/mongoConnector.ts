const mongoose = require('mongoose');
const servicesConf = require('./../../../../../../../../config/services.json');

const mongoURL = servicesConf.DBS.mongo.url + servicesConf.DBS.mongo.db;


export class MongoConnector {

    private static instance: MongoConnector = new MongoConnector();

    constructor() {
        mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err !== null) {
                console.log(err);
            }
        });

        mongoose.connection.on('error', err => {
            console.log(err);
        });

        mongoose.connection.on('connected', err => {
            console.log('Mongoose default connection open to ' + mongoURL);
        });

        mongoose.connection.on('disconnected', err => {
            console.log('Mongoose default connection disconnected');
        });

        mongoose.set('useFindAndModify', false);
    }

    public getMongoose = () => {
        return mongoose;
    };

    public static getMongoose = MongoConnector.instance.getMongoose;

}
