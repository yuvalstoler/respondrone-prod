import {LogModel} from "../mongo/models/logModel";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    logModel: any;


    private constructor() {
        this.logModel = new LogModel().getSchema();
    }


    // =============== Logs ==================
    private saveLog = (data: any): void => {
        this.logModel(data)
            .save()
            .then(result => {
            })
            .catch(error => {
                console.log(error);
            } );
    };


    // region API uncions

    public static saveLog = DbManager.instance.saveLog;


    // endregion API uncions

}
