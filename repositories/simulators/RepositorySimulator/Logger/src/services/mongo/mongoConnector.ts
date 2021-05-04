const mongoose = require('mongoose');

const projConf = require('../../../config/projConf.json');

const logsMongoURL = projConf.LogsMongo.url + projConf.LogsMongo.db;


export class MongoConnector {

    private static instance: MongoConnector = new MongoConnector();
    private mongoConnection;
    private logsMongoConnection;

    constructor() {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useFindAndModify', false);


        this.logsMongoConnection = mongoose.createConnection(logsMongoURL);

        this.logsMongoConnection.on('error', err => {
            console.log(err);
        });

        this.logsMongoConnection.on('connected', err => {
            console.log('Logs Mongoose default connection open to ' + logsMongoURL);
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
