import { ReportManager } from "../report/reportManager";

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { GeoPoint } from '../../../../../classes/dataClasses/geo/geoPoint';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE, EVENT_DATA,
    ID_OBJ,
    POINT,
    REPORT_DATA,
} from '../../../../../classes/typings/all.typings';



import {
    EVENT_API,
    FS_API,
    MWS_API,
    REPORT_API,
    WS_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {FileManager} from '../file/fileManager';
import {EventManager} from '../event/eventManager';


export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();


    private constructor() {
        // this.getDynamicNfzFromWebServer();
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };

    // ========================================================================

    private createReport = (request: Request, response: Response) => {
        const requestBody: REPORT_DATA = request.body;
        ReportManager.createReport(requestBody)
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

    private updateAllReports = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: REPORT_DATA[] = request.body;
        ReportManager.updateAllReports(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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

    // ========================================================================

    private createEvent = (request: Request, response: Response) => {
        const requestBody: EVENT_DATA = request.body;
        EventManager.createEvent(requestBody)
            .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                response.send(data);
            });
    };

    private readEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            EventManager.readEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
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

    private readAllEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA[]> = {success: false};
        EventManager.readAllEvent({})
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
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

    private deleteEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            EventManager.deleteEvent(requestBody)
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

    private deleteAllEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        EventManager.deleteAllEvent()
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

    private updateAllEvents = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: EVENT_DATA[] = request.body;
        EventManager.updateAllEvents(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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

    // ========================================================================

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

    private uploadFile = (request: Request, response: Response) => {
        FileManager.uploadFile(request, response);
    };

    private removeFile = (request: Request, response: Response) => {
        let res: ASYNC_RESPONSE = {success: false};

        FileManager.removeFile(request.body)
            .then((data: ASYNC_RESPONSE) => {
                res = data;
                response.send(res);
            })
            .catch((data) => {
                res = data;
                response.send(res);
            });

    };


    routers: {} = {
        [MWS_API.getVideoSources]: this.getVideoSources,



        [REPORT_API.createReport]: this.createReport,
        [REPORT_API.readReport]: this.readReport,
        [REPORT_API.readAllReport]: this.readAllReport,
        [REPORT_API.deleteReport]: this.deleteReport,
        [REPORT_API.deleteAllReport]: this.deleteAllReport,

        [EVENT_API.createEvent]: this.createEvent,
        [EVENT_API.readEvent]: this.readEvent,
        [EVENT_API.readAllEvent]: this.readAllEvent,
        [EVENT_API.deleteEvent]: this.deleteEvent,
        [EVENT_API.deleteAllEvent]: this.deleteAllEvent,

        [WS_API.uploadFile]: this.uploadFile,
        [FS_API.removeFile]: this.removeFile,

        [WS_API.updateAllReports]: this.updateAllReports,
        [WS_API.updateAllEvents]: this.updateAllEvents,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
