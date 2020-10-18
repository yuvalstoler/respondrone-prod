import { UpdateListenersManager } from '../updateListeners/updateListenersManager';

const _ = require('lodash');


import {
    ASYNC_RESPONSE,
    ID_OBJ,
    TASK_DATA

} from '../../../../../classes/typings/all.typings';
import { Task } from '../../../../../classes/dataClasses/task/task';
import { RequestManager } from '../../../../RS/src/AppService/restConnections/requestManager';
import {
    DBS_API,
} from '../../../../../classes/dataClasses/api/api_enums';
import { Converting } from '../../../../../classes/applicationClasses/utility/converting';
import { DataUtility } from '../../../../../classes/applicationClasses/utility/dataUtility';


export class TaskManager {


    private static instance: TaskManager = new TaskManager();


    tasks: Task[] = [];

    private constructor() {
        this.initAllTasks();

    }


    private initAllTasks = () => {
        this.getTasksFromDBS()
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                //    todo send to listeners
                UpdateListenersManager.updateTaskListeners();

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
            RequestManager.requestToDBS(DBS_API.getAllTasks, {})
                .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    if ( data.success ) {
                        this.tasks = Converting.Arr_TASK_DATA_to_Arr_Task(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                    //todo logger
                    reject(data);
                });
        });
        //get StaticNfz From AMS

    };


    private createTask = (taskData: TASK_DATA): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            taskData.id = taskData.id || DataUtility.generateID();
            const newTask: Task = new Task(taskData);
            RequestManager.requestToDBS(DBS_API.createTask, newTask.toJsonForSave())
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const report: Task = this.tasks.find(element => element.id === data.data.id);
                        if ( report ) {
                            report.setValues(data.data);
                        }
                        else {
                            this.tasks.push(new Task(data.data));
                        }
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

    
    private getTasks = (): TASK_DATA[] => {
        const res: TASK_DATA[] = [];
        this.tasks.forEach((task: Task) => {
            res.push(task.toJsonForSave());
        });
        return res;
    }
    private getTaskById = (idObj: ID_OBJ): TASK_DATA => {
        const res: TASK_DATA = this.tasks.find((task: Task) => {
            return task.id === idObj.id;
        });
        return res;
    }


    // region API uncions
    public static createTask = TaskManager.instance.createTask;

    public static getTasks = TaskManager.instance.getTasks;
    public static getTaskById = TaskManager.instance.getTaskById;


    // endregion API uncions

}
