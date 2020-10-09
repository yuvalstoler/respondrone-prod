import { DbManager } from '../DB/dbManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';

import {
    ASYNC_RESPONSE, EVENT_DATA,
    ID_OBJ,
    ID_TYPE,
    REPORT_DATA,
} from '../../../../../classes/typings/all.typings';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {
    EVENT_API,
    REPORT_API
} from '../../../../../classes/dataClasses/api/api_enums';


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


    // ----------------------

    // ----------------------
    private setReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};

        const requestBody: REPORT_DATA = request.body;

        if ( requestBody ) {
            DbManager.setReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;

                    res.data = data.data;

                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
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

        const requestBody = request.body;


        DbManager.readAllReport({})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
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

    private deleteReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteReport(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
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

        const requestBody = request.body;


        DbManager.deleteAllReport({})
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

    // ----------------------

    private setEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};

        const requestBody: EVENT_DATA = request.body;

        if ( requestBody ) {
            DbManager.setEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.success = data.success;

                    res.data = data.data;

                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
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

        const requestBody = request.body;


        DbManager.readAllEvent({})
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
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

    private deleteEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteEvent(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
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

        const requestBody = request.body;


        DbManager.deleteAllEvent({})
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

        [REPORT_API.createReport]: this.setReport,
        [REPORT_API.readReport]: this.readReport,
        [REPORT_API.readAllReport]: this.readAllReport,
        [REPORT_API.deleteReport]: this.deleteReport,
        [REPORT_API.deleteAllReport]: this.deleteAllReport,

        [EVENT_API.createEvent]: this.setEvent,
        [EVENT_API.readEvent]: this.readEvent,
        [EVENT_API.readAllEvent]: this.readAllEvent,
        [EVENT_API.deleteEvent]: this.deleteEvent,
        [EVENT_API.deleteAllEvent]: this.deleteAllEvent,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
