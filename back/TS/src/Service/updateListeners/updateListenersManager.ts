
import {
    ASYNC_RESPONSE,
    TASK_DATA
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import {API_GENERAL, MWS_API} from '../../../../../classes/dataClasses/api/api_enums';
import { TaskManager } from '../task/taskManager';

const _ = require('lodash');


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.RS.listeners;
const updateRouteListenersURL = API_GENERAL.general + MWS_API.updateAllReports;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateTaskListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allReportsDta: TASK_DATA[] = TaskManager.getTasks();
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateRouteListenersURL, allReportsDta);
                promisesArr.push(requestPromise);
            });

            const res: ASYNC_RESPONSE = {success: false};
            Promise.all(promisesArr)
                .then((result: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *then* updateReportListeners');
                    res.success = true;
                    resolve(res);
                })
                .catch((error: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *catch* updateReportListeners');
                    resolve(res);
                });
        });

    }


    // region API functions

    // public static updateListeners = UpdateListenersManager.instance.updateListeners;
    public static updateTaskListeners = UpdateListenersManager.instance.updateTaskListeners;


    // endregion API functions

}
