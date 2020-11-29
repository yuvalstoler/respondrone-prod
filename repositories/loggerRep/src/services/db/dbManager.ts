import {EntityModel} from '../mongo/models/entityModel';
import {ENTITY_DATA, ID_TYPE} from '../../classes/all.typings';
import {LogModel} from "../mongo/models/logModel";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    logModel: any;



    private constructor() {

        this.logModel = new LogModel().getSchema();
    }


    // ----------------------
    private getLogs = (condition: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.logModel
                .find(condition, '-_id -__v')
                .lean()
                .exec()
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    };


    // region API uncions

    public static getLogs = DbManager.instance.getLogs;


    // endregion API uncions

}
