import { TaskManager } from "../task/taskManager";

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    TASK_DATA,
} from '../../../../../classes/typings/all.typings';


import {
    TS_API
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

    private createTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: true};
        const requestBody: TASK_DATA = request.body;
        TaskManager.createTask(requestBody)
            .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            });
        response.send(res);

    };

    private getTasks = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: true};
        res.data = TaskManager.getTasks();
        response.send(res);

    };
    private getTaskById = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: true};
        const requestBody: ID_OBJ = request.body;
        res.data = TaskManager.getTaskById(requestBody);
        response.send(res);
    };

    routers: {} = {
        [TS_API.createTask]: this.createTask,

        [TS_API.getAllTasks]: this.getTasks,
        [TS_API.getTaskById]: this.getTaskById,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
