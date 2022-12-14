
const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { TaskManager } from '../task/taskManager';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ, TASK_ACTION,
    TASK_DATA, TASK_STATUS, USER_TASK_ACTION,
} from '../../../../../classes/typings/all.typings';


import {
    TS_API,
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


    private newTask = (request: Request, response: Response) => {
        const requestBody: TASK_DATA = request.body;
        TaskManager.createTask(requestBody)
            .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            });
    };

    private readTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            TaskManager.readTask(requestBody)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
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

    private readAllTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: false};
        TaskManager.readAllTask({})
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
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

    private deleteTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            TaskManager.deleteTask(requestBody)
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

    private getTasks = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: true};
        res.data = TaskManager.getTasks();
        response.send(res);

    };

    private deleteAllTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        TaskManager.deleteAllTask()
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


    private getTaskById = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: true};
        const requestBody: ID_OBJ = request.body;
        res.data = TaskManager.getTasks(requestBody);
        response.send(res);
    };

    private userTaskAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: USER_TASK_ACTION = request.body || {};
        if (requestBody.userId && requestBody.taskId && requestBody.action in TASK_ACTION) {
            TaskManager.userTaskAction(requestBody)
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
            res.description = 'missing field userId/taskId/action';
            response.send(res);
        }
    };

    private osccTaskAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: USER_TASK_ACTION = request.body || {};
        if (requestBody.taskId && requestBody.action in TASK_ACTION) {
            TaskManager.osccTaskAction(requestBody)
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
            res.description = 'missing field userId/taskId/action';
            response.send(res);
        }
    };

    routers: {} = {
        [TS_API.createTask]: this.newTask,
        [TS_API.readTask]: this.readTask,
        [TS_API.readAllTask]: this.readAllTask,
        [TS_API.deleteTask]: this.deleteTask,
        [TS_API.deleteAllTask]: this.deleteAllTask,

        [TS_API.getAllTasks]: this.getTasks,
        [TS_API.getTaskById]: this.getTaskById,

        [TS_API.userTaskAction]: this.userTaskAction,
        [TS_API.osccTaskAction]: this.osccTaskAction,
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
