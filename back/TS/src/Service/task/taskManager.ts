import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {CCGW_API, DBS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    MAP,
    OSCC_TASK_ACTION,
    TASK_ACTION,
    TASK_DATA,
    TASK_STATUS,
    USER_TASK_ACTION
} from '../../../../../classes/typings/all.typings';
import {UpdateListenersManager} from '../updateListeners/updateListenersManager';
import {Task} from '../../../../../classes/dataClasses/task/task';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';


export class TaskManager {


    private static instance: TaskManager = new TaskManager();


    tasks: Task[] = [];

    tasksSendToMobile: MAP<TASK_DATA> = {};
    tasksSendToDB: MAP<TASK_DATA> = {};

    private constructor() {
        this.initAllTasks();
        this.startInterval();
    }

    private initAllTasks = () => {
        this.getTasksFromDBS()
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                //    todo send to listeners
                UpdateListenersManager.updateTaskListeners();
                this.sendTasksToMobile();
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                setTimeout(() => {

                    this.initAllTasks();
                }, 5000);
            });
        //    todo like AMS NFZ (or perimeter)

    }

    private getTasksFromDBS = (): Promise<ASYNC_RESPONSE<TASK_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllTask, {})
                .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    if ( data.success ) {
                        this.tasks = Converting.Arr_TASK_DATA_to_Arr_Task(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getTasksFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    //todo logger
                    console.log('error getTasksFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
        //get StaticNfz From AMS

    };

    private getTasksDATA = (idObj: ID_OBJ = undefined): TASK_DATA[] => {
        const res: TASK_DATA[] = [];
        if ( idObj ) {
            const found = this.tasks.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJsonForSave());
            }
        }
        else {
            this.tasks.forEach((task: Task) => {
                res.push(task.toJsonForSave());
            });
        }
        return res;
    };

    private getTask = (idObj: ID_OBJ): Task => {
        let res: Task;
        if ( idObj ) {
            res = this.tasks.find(element => element.id === idObj.id);
        }

        return res;
    };

    private createTask = (taskData: TASK_DATA): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            taskData.id = taskData.id || DataUtility.generateID();
            taskData.time = taskData.time || Date.now();
            taskData.idView = taskData.idView || DataUtility.generateIDForView();
            const newTask: Task = new Task(taskData);

            RequestManager.requestToDBS(DBS_API.createTask, newTask.toJsonForSave())
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        let task: Task = TaskManager.getTask({id: data.data.id});
                        if (task) {
                            task.setValues(data.data);
                        } else {
                            task = new Task(data.data)
                            this.tasks.push(task);
                        }

                        this.sendTaskToMobile(task);
                        UpdateListenersManager.updateTaskListeners();
                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }

    private sendTasksToMobile = () => {
        this.tasks.forEach((task: Task) => {
            if (!task.isSendToMobile) {
                this.sendTaskToMobile(task)
            }
        })
    }

    private sendTaskToMobile = (task: Task) => {
        const taskData = task.toJsonForSave();
        RequestManager.requestToCCG(CCGW_API.createTask, taskData)
            .then((data: ASYNC_RESPONSE) => {
                if (data.success) {
                    taskData.isSendToMobile = true;

                    RequestManager.requestToDBS(DBS_API.createTask, taskData)
                        .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                            if (!data.success) {
                                this.tasksSendToDB[task.id] = taskData;
                            }
                        })
                        .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                            console.log(data);
                            this.tasksSendToDB[task.id] = taskData;
                        });
                }
                else {
                    this.tasksSendToMobile[task.id] = taskData;
                }
            })
            .catch((data: ASYNC_RESPONSE) => {
                this.tasksSendToMobile[task.id] = taskData;
            })
    }

    private startInterval = () => {
        setInterval(() => {
            for (const taskId in this.tasksSendToMobile) {
                const taskData: TASK_DATA = this.tasksSendToMobile[taskId];
                RequestManager.requestToCCG(CCGW_API.createTask, taskData)
                    .then((data: ASYNC_RESPONSE) => {
                        if (data.success) {
                            delete this.tasksSendToMobile[taskData.id];
                            this.tasksSendToDB[taskData.id] = taskData;
                        }
                    })
                    .catch((data: ASYNC_RESPONSE) => {})
            }


            for (const taskId in this.tasksSendToDB) {
                const taskData: TASK_DATA = this.tasksSendToDB[taskId];
                RequestManager.requestToDBS(DBS_API.createTask, taskData)
                    .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                        if (data.success) {
                            delete this.tasksSendToDB[taskData.id];
                        }
                    })
                    .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {});
            }

        }, 5000)
    }

    // private updateTask = (taskData: TASK_DATA): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
    //     return new Promise((resolve, reject) => {
    //         const res: ASYNC_RESPONSE = {success: false};
    //
    //         const task: Task = this.getTask({id: taskData.id});
    //         //todo save - send to DBS
    //         res.success = true;
    //         //    todo send to RS
    //         resolve(res);
    //     });
    // }

    private getTaskStatus = (taskData: TASK_DATA, lastAction: TASK_ACTION): TASK_STATUS => {
        let res: TASK_STATUS;
        if (taskData.status === TASK_STATUS.pending || taskData.status === TASK_STATUS.inProgress) {
            if (lastAction === TASK_ACTION.accept) {
                res = TASK_STATUS.inProgress;
            }
            else if (lastAction === TASK_ACTION.complete) {
                res = TASK_STATUS.completed;
            }
            else if (lastAction === TASK_ACTION.cancel) {
                res = TASK_STATUS.cancelled;
            }
            else if (lastAction === TASK_ACTION.reject) {
                let isAllRejected = true;
                taskData.assigneeIds.forEach((assigneeId) => {
                    if (taskData.taskActionByUser[assigneeId] !== TASK_ACTION.reject) {
                        isAllRejected = false;
                    }
                })
                if (isAllRejected) {
                    res = TASK_STATUS.rejected;
                }
            }
        }
        else {
            res = taskData.status;
        }
        return res;
    }

    private userTaskAction = (data: USER_TASK_ACTION) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const task = TaskManager.getTask({id: data.taskId});
            if (task) {
                const taskData = task.toJsonForSave();
                taskData.taskActionByUser[data.userId] = data.action
                taskData.status = this.getTaskStatus(taskData, data.action);
                RequestManager.requestToDBS(DBS_API.createTask, taskData)
                    .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                        res.data = data.data;
                        res.success = data.success;
                        res.description = data.description;
                        if ( data.success ) {
                            task.setValues(data.data);
                            this.sendTaskToMobile(task);
                            UpdateListenersManager.updateTaskListeners();
                            resolve(res);
                        }
                        else {
                            reject(res)
                        }

                    })
                    .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                        console.log(data);
                        reject(data);
                    });
            }
            else {
                res.data =  'task doesnt exist: '+ data.taskId
                reject(res);
            }
        });
    }

    private osccTaskAction = (data: OSCC_TASK_ACTION) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const task = TaskManager.getTask({id: data.taskId});
            if (task) {
                const taskData = task.toJsonForSave();
                taskData.status = this.getTaskStatus(taskData, data.action);
                RequestManager.requestToDBS(DBS_API.createTask, taskData)
                    .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                        res.data = data.data;
                        res.success = data.success;
                        res.description = data.description;
                        if ( data.success ) {
                            task.setValues(data.data);
                            this.sendTaskToMobile(task);
                            UpdateListenersManager.updateTaskListeners();
                            resolve(res);
                        }
                        else {
                            reject(res)
                        }

                    })
                    .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                        console.log(data);
                        reject(data);
                    });
            }
            else {
                res.data =  'task doesnt exist: '+ data.taskId
                reject(res);
            }
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
            this.tasks.forEach((task: Task) => {
                res.data.push(task.toJsonForSave());
            });
            resolve(res);
        });
    }
    private deleteTask = (taskIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteTask, taskIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        const index = this.tasks.findIndex(element => element.id === data.data.id);
                        if (index !== -1) {
                            this.tasks.splice(index, 1);
                        }
                        UpdateListenersManager.updateTaskListeners();

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
    private deleteAllTask = (): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteAllTask, {})
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


    // region API uncions
    public static getTasks = TaskManager.instance.getTasksDATA;
    public static getTask = TaskManager.instance.getTask;

    public static createTask = TaskManager.instance.createTask;
    public static userTaskAction = TaskManager.instance.userTaskAction;
    public static osccTaskAction = TaskManager.instance.osccTaskAction;

    public static readTask = TaskManager.instance.readTask;
    public static readAllTask = TaskManager.instance.readAllTask;
    public static deleteTask = TaskManager.instance.deleteTask;
    public static deleteAllTask = TaskManager.instance.deleteAllTask;


    // endregion API uncions

}
