//
// import {
//     ASYNC_RESPONSE,
//     TASK_DATA
// } from '../../../../../classes/typings/all.typings';
// import { RequestManager } from '../../AppService/restConnections/requestManager';
// import {API_GENERAL, WS_API} from '../../../../../classes/dataClasses/api/api_enums';
// import {TaskManager} from '../task/taskManager';
//
// const _ = require('lodash');
//
//
// const services = require('./../../../../../../../../config/services.json');
//
// const listeners: string[] = services.TS.listeners;
// const updateRouteListenersURL = API_GENERAL.general + WS_API.updateAllTasks;
//
// export class UpdateListenersManager {
//
//
//     private static instance: UpdateListenersManager = new UpdateListenersManager();
//
//     private constructor() {
//     }
//
//     private updateTaskListeners = (): Promise<ASYNC_RESPONSE> => {
//         return new Promise((resolve, reject) => {
//             const allTasksDta: TASK_DATA[] = TaskManager.getTasks(undefined);
//             const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
//             listeners.forEach((listener: string) => {
//                 console.log(Date.now(), 'start updateTaskListeners: ', listener);
//                 const requestPromise = RequestManager.requestToExternalService(listener, updateRouteListenersURL, allTasksDta);
//                 promisesArr.push(requestPromise);
//             });
//
//             const res: ASYNC_RESPONSE = {success: false};
//             Promise.all(promisesArr)
//                 .then((result: ASYNC_RESPONSE[]) => {
//                     console.log(Date.now(), 'finish *then* updateTaskListeners');
//                     res.success = true;
//                     resolve(res);
//                 })
//                 .catch((error: ASYNC_RESPONSE[]) => {
//                     console.log(Date.now(), 'finish *catch* updateTaskListeners');
//                     resolve(res);
//                 });
//         });
//
//     }
//
//
//     // region API functions
//
//     // public static updateListeners = UpdateListenersManager.instance.updateListeners;
//     public static updateTaskListeners = UpdateListenersManager.instance.updateTaskListeners;
//
//
//     // endregion API functions
//
// }
