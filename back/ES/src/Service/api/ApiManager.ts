import * as core from 'express-serve-static-core';

const _ = require('lodash');

import { EventManager } from '../event/eventManager';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    EVENT_DATA,
} from '../../../../../classes/typings/all.typings';


import {
    EVENT_API,
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

    private newEvent = (request: Request, response: Response) => {
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


    routers: {} = {

        [EVENT_API.createEvent]: this.newEvent,
        [EVENT_API.readEvent]: this.readEvent,
        [EVENT_API.readAllEvent]: this.readAllEvent,
        [EVENT_API.deleteEvent]: this.deleteEvent,
        [EVENT_API.deleteAllEvent]: this.deleteAllEvent,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
