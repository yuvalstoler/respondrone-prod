import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import {
    TS_API,
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    TASK_DATA, TASK_DATA_UI
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {Task} from '../../../../../classes/dataClasses/task/task';


export class TaskManager {


    private static instance: TaskManager = new TaskManager();


    tasks: Task[] = [];

    private constructor() {
        this.getTasksFromTS();
    }

    private getTasksFromTS = () => {
        RequestManager.requestToTS(TS_API.readAllTask, {})
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                if ( data.success ) {
                    this.tasks = Converting.Arr_TASK_DATA_to_Arr_Task(data.data);
                }
                else {
                    //todo logger
                    console.log('error getTasksFromTS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                //todo logger
                console.log('error getTasksFromTS', JSON.stringify(data));
            });
    };

    private getTasks = (): TASK_DATA[] => {
        const res: TASK_DATA[] = [];
        this.tasks.forEach((task: Task) => {
            res.push(task.toJsonForSave());
        });
        return res;
    }

    private updateAllTasks = (taskData: TASK_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.tasks = Converting.Arr_TASK_DATA_to_Arr_Task(taskData);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }
    private createTask = (taskData: TASK_DATA): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const newTask: Task = new Task(taskData);
            const newTaskDataJson: TASK_DATA = newTask.toJsonForSave();
            res.data = newTaskDataJson;
            res.success = true;

            RequestManager.requestToTS(TS_API.createTask, newTaskDataJson)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    resolve(data);
                });

            // resolve(res);

        });
    }

    private readTask = (taskIdData: ID_OBJ): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const findedTask: Task = this.tasks.find((task: Task) => {
                return task.id === taskIdData.id;
            });
            if ( findedTask ) {
                res.success = true;
                res.data = findedTask;
            }
            resolve(res);
        });
    }
    private readAllTask = (requestData): Promise<ASYNC_RESPONSE<TASK_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            // this.tasks.forEach((task: Task) => {
            //     res.data.push(task.toJsonForSave());
            // });
            res.data = this.getDataForUI();
            resolve(res);
        });
    }
    private deleteTask = (taskIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToTS(TS_API.deleteTask, taskIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log('delete task', data);
                    reject(data);
                });
        });
    }
    private deleteAllTask = (): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToTS(TS_API.deleteAllTask, {})
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;

                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }

    private getDataForUI = (): TASK_DATA_UI[] => {
        const res: TASK_DATA_UI[] = [];
        this.tasks.forEach((task: Task) => {
            const taskDataUI: TASK_DATA_UI = task.toJsonForUI();
            // taskDataUI.assignees = GroundResourceManager.getGroundResources(task.assigneeIds);
            // taskDataUI.modeDefine = TaskMdLogic.validate(taskDataUI);

            res.push(taskDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: TASK_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_tasksData', jsonForSend);
    };

    // region API uncions

    public static getTasks = TaskManager.instance.getTasks;

    public static updateAllTasks = TaskManager.instance.updateAllTasks;
    public static createTask = TaskManager.instance.createTask;
    public static readTask = TaskManager.instance.readTask;
    public static readAllTask = TaskManager.instance.readAllTask;
    public static deleteTask = TaskManager.instance.deleteTask;
    public static deleteAllTask = TaskManager.instance.deleteAllTask;



    // endregion API uncions

}
