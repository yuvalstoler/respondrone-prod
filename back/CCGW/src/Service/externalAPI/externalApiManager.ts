import { RequestManager } from '../../AppService/restConnections/requestManager';

const _ = require('lodash');

import {
    ASYNC_RESPONSE, GIMBAL_ACTION_MGW, GIMBAL_CONTROL_DATA_FOR_MGW,
    ID_OBJ, MISSION_REQUEST_DATA,
    REPORT_DATA,
    TASK_DATA, USER_TASK_ACTION,

} from '../../../../../classes/typings/all.typings';
import {
    GS_API,
    MS_API,
    RS_API,
    TS_API
} from '../../../../../classes/dataClasses/api/api_enums';


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

    private userTaskAction = (body: USER_TASK_ACTION) => {
        return new Promise((resolve, reject) => {
            //     send REST to OSCC
            RequestManager.requestToTS(TS_API.userTaskAction, body)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    reject(data);
                });
        });
    }

    private createMissionRequestFromMGW = (missionRequestData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            // const res: ASYNC_RESPONSE = {success: false};
            //    todo send to RS
            RequestManager.requestToMS(MS_API.createMissionRequestFromMGW, missionRequestData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    reject(data);
                });
        });
    }

    private requestGimbalControlFromMGW = (missionRequestData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToGS(GS_API.requestGimbalControlFromMGW, missionRequestData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    reject(data);
                });
        });
    }

    private gimbalActionFromMGW = (gimbalAction: GIMBAL_ACTION_MGW): Promise<ASYNC_RESPONSE<GIMBAL_ACTION_MGW>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToGS(GS_API.gimbalActionFromMGW, gimbalAction)
                .then((data: ASYNC_RESPONSE<GIMBAL_ACTION_MGW>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<GIMBAL_ACTION_MGW>) => {
                    reject(data);
                });
        });
    }

    private getGimbalControlData = (body): Promise<ASYNC_RESPONSE<GIMBAL_CONTROL_DATA_FOR_MGW>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToGS(GS_API.getGimbalControlData, {})
                .then((data: ASYNC_RESPONSE<GIMBAL_CONTROL_DATA_FOR_MGW>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<GIMBAL_CONTROL_DATA_FOR_MGW>) => {
                    reject(data);
                });
        });
    }


    // region API uncions

    public static createReportFromMGW = ExternalApiManager.instance.createReportFromMGW;
    public static getTasks = ExternalApiManager.instance.getTasks;
    public static getTaskById = ExternalApiManager.instance.getTaskById;
    public static userTaskAction = ExternalApiManager.instance.userTaskAction;
    public static createMissionRequestFromMGW = ExternalApiManager.instance.createMissionRequestFromMGW;
    public static requestGimbalControlFromMGW = ExternalApiManager.instance.requestGimbalControlFromMGW;
    public static gimbalActionFromMGW = ExternalApiManager.instance.gimbalActionFromMGW;
    public static getGimbalControlData = ExternalApiManager.instance.getGimbalControlData;


    // endregion API uncions

}
