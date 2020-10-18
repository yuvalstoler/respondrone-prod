import { RequestManager } from "../../AppService/restConnections/requestManager";

const _ = require('lodash');

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    REPORT_DATA,
    TASK_DATA,

} from '../../../../../classes/typings/all.typings';
import {
    RS_API,
    TS_API
} from "../../../../../classes/dataClasses/api/api_enums";


export class ExternalApiManager {


    private static instance: ExternalApiManager = new ExternalApiManager();


    private constructor() {

    }

    private createReportFromMGW = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            // const res: ASYNC_RESPONSE = {success: false};
            //    todo send to RS
            RequestManager.requestToRS(RS_API.createReportFromMGW, reportData)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    reject(data);
                });

            // resolve(res);

        });
    }

    private getTasks = (): Promise<ASYNC_RESPONSE<TASK_DATA[]>> => {
        return new Promise((resolve, reject) => {
            //     send REST to OSCC
            RequestManager.requestToTS(TS_API.getAllTasks, {})
                .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    reject(data);
                });
        });
    }
    private getTaskById = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            //     send REST to OSCC
            RequestManager.requestToTS(TS_API.getTaskById, idObj)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    reject(data);
                });
        });
    }


    // region API uncions

    public static createReportFromMGW = ExternalApiManager.instance.createReportFromMGW;
    public static getTasks = ExternalApiManager.instance.getTasks;
    public static getTaskById = ExternalApiManager.instance.getTaskById;


    // endregion API uncions

}
