import { InternalApiManager } from "../internalAPI/internalApiManager";

const _ = require('lodash');

import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';


import {
    ASYNC_RESPONSE,
    FILE_DB_DATA,
    FILE_GW_DATA,
    ID_OBJ, MISSION_REQUEST_DATA,
    REPORT_DATA,
    TASK_DATA,
    UPDATE_FILE_STATUS, USER_TASK_ACTION,
} from '../../../../../classes/typings/all.typings';
import {
    CCGW_API,
    MWS_API,
} from '../../../../../classes/dataClasses/api/api_enums';



import { ExternalApiManager } from '../externalAPI/externalApiManager';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';


export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();


    private constructor() {
        // this.getDynamicNfzFromWebServer();
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routersExternal ) {
            if ( this.routersExternal.hasOwnProperty(path) ) {
                router.use(path, this.routersExternal[path]);
            }
        }

        for ( const path in this.routersInternal ) {
            if ( this.routersInternal.hasOwnProperty(path) ) {
                router.use(path, this.routersInternal[path]);
            }
        }
        return true;
    };


    private createReportFromMGW = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody: REPORT_DATA = request.body;

        ExternalApiManager.createReportFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };


    private getVideoSources = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody = request.body;

        // NfzManager.createDynamicNFZFromRoute(requestBody)
        //     .then((data: ASYNC_RESPONSE) => {
        response.send(res);
        // })
        // .catch((data: ASYNC_RESPONSE) => {
        //     response.send(data);
        // });
    };



    //--------------------------------
    private getFileById = (request: Request, response: Response) => {
        const fileId: ID_OBJ = request.body;
        InternalApiManager.fileById(fileId)
            .then((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                response.send(data);
            });
    };

    private updateFileStatus = (request: Request, response: Response) => {
        const fileStatus: UPDATE_FILE_STATUS = request.body;
        InternalApiManager.updateFileStatus(fileStatus)
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            });
    };
    //--------------------------------


    private getTasks = (request: Request, response: Response) => {
        ExternalApiManager.getTasks()
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    private getTaskById = (request: Request, response: Response) => {
        const requestBody: ID_OBJ = request.body;
        ExternalApiManager.getTaskById(requestBody)
            .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            });
    };

    private createTask = (request: Request, response: Response) => {
        const requestBody: TASK_DATA = request.body;
        InternalApiManager.createTask(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    private setAllTasks = (request: Request, response: Response) => {
        const requestBody: TASK_DATA[] = request.body;
        InternalApiManager.setAllTasks(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    private userTaskAction = (request: Request, response: Response) => {
        const requestBody: USER_TASK_ACTION = request.body;
        ExternalApiManager.userTaskAction(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    // -------------------------------

    private createMissionRequestFromMGW = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody: MISSION_REQUEST_DATA = request.body;

        ExternalApiManager.createMissionRequestFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    //--------------------------------

    routersExternal: {} = {
        [CCGW_API.createReportFromMGW]: this.createReportFromMGW,
        [MWS_API.getVideoSources]: this.getVideoSources,

        [CCGW_API.getTasks]: this.getTasks,
        [CCGW_API.getTaskById]: this.getTaskById,
        [CCGW_API.userTaskAction]: this.userTaskAction,

        [CCGW_API.createMissionRequestFromMGW]: this.createMissionRequestFromMGW,
    };

    routersInternal: {} = {
        [CCGW_API.getFileById]: this.getFileById,
        [CCGW_API.updateFileStatus]: this.updateFileStatus,
        [CCGW_API.createTask]: this.createTask,
        [CCGW_API.setAllTasks]: this.setAllTasks,
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
