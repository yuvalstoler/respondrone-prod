import * as core from 'express-serve-static-core';

const _ = require('lodash');

import { ReportManager } from '../report/reportManager';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    FILE_FS_DATA,
    ID_OBJ,
    REPORT_DATA,
} from '../../../../../classes/typings/all.typings';


import {
    REPORT_API,
    RS_API,
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';


export class ApiManager implements IRest {

    private static instance: ApiManager = new ApiManager();


    private constructor() {
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };

    private newReport = (request: Request, response: Response) => {
        const requestBody: REPORT_DATA = request.body;
        ReportManager.createReport(requestBody)
            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };
    private createReportFromMGW = (request: Request, response: Response) => {
        const requestBody: REPORT_DATA = request.body;
        ReportManager.createReportFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };
    private readReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            ReportManager.readReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA[]> = {success: false};
        ReportManager.readAllReport({})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private deleteReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            ReportManager.deleteReport(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        ReportManager.deleteAllReport()
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private updateListenersFS = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const mediaData: FILE_FS_DATA = request.body;
        ReportManager.updateMedia(mediaData)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };


    routers: {} = {

        [RS_API.createReportFromMGW]: this.createReportFromMGW,

        [RS_API.createReport]: this.newReport,
        [RS_API.readReport]: this.readReport,
        [RS_API.readAllReport]: this.readAllReport,
        [RS_API.deleteReport]: this.deleteReport,
        [RS_API.deleteAllReport]: this.deleteAllReport,
        [RS_API.updateListenersFS]: this.updateListenersFS,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
