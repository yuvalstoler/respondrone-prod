const mongoose = require('mongoose');

const projConf = require('../../../config/projConf.json');

// const mongoURL = projConf.Mongo.url + projConf.Mongo.db;
// const logsMongoURL = projConf.LogsMongo.url + projConf.LogsMongo.db;

const mongoURL = `mongodb://${projConf.Mongo.username}:${projConf.Mongo.password}@${projConf.Mongo.hostname}:${projConf.Mongo.port}/${projConf.Mongo.db}?authSource=admin`;
const logsMongoURL = `mongodb://${projConf.LogsMongo.username}:${projConf.LogsMongo.password}@${projConf.LogsMongo.hostname}:${projConf.LogsMongo.port}/${projConf.LogsMongo.db}?authSource=admin`;

export class MongoConnector {

    private static instance: MongoConnector = new MongoConnector();
    private mongoConnection;
    private logsMongoConnection;

    constructor() {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useFindAndModify', false);


        this.mongoConnection = mongoose.createConnection(mongoURL);

        this.mongoConnection.on('error', err => {
            console.log(err);
        });

        this.mongoConnection.on('connected', err => {
            console.log('Mongoose default connection open to ' + mongoURL);
        });

        this.mongoConnection.on('disconnected', err => {
            console.log('Mongoose default connection disconnected');
        });



        this.logsMongoConnection = mongoose.createConnection(logsMongoURL);

        this.logsMongoConnection.on('error', err => {
            console.log(err);
        });

        this.logsMongoConnection.on('connected', err => {
            console.log('Logs Mongoose default connection open to ' + mongoURL);
        });

        this.logsMongoConnection.on('disconnected', err => {
            console.log('Logs Mongoose default connection disconnected');
        });

    }

    public getConnection = () => {
        return this.mongoConnection;
    };

    public getLogsConnection = () => {
        return this.logsMongoConnection;
    };

    public static getConnection = MongoConnector.instance.getConnection;
    public static getLogsConnection = MongoConnector.instance.getLogsConnection;

}
