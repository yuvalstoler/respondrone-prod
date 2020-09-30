// import {RequestManager} from "../../applicationServices/restConnections/requestManager";
// import {ASYNC_RESPONSE} from "../../../../../classes/typings/all.typings";
// import {SiteManager} from "../site/siteManager";
//
// const _ = require('lodash');
//
// const projConf = require('./../../../../../../../../projConf.json');
//
// const listeners: string[] = projConf.AMS.listeners;
//
// const updateListenerPath = 'api/updateArea';
//
// export class UpdateListenersManager {
//
//
//     private static instance: UpdateListenersManager = new UpdateListenersManager();
//
//     private constructor() {
//     }
//
//     private updateListeners = (): Promise<ASYNC_RESPONSE> => {
//         return new Promise((resolve, reject) => {
//             const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
//             const updateData = this.prepareUpdateData();
//
//             listeners.forEach((listener: string) => {
//                 RequestManager.requestToExternalService(listener, updateListenerPath, updateData)
//             });
//
//             const res: ASYNC_RESPONSE = {success: false};
//             Promise.all(promisesArr)
//                 .then((result: ASYNC_RESPONSE[]) => {
//                     res.success = true;
//                     resolve(res)
//                 })
//                 .catch((error: ASYNC_RESPONSE[]) => {
//                     resolve(res)
//                 });
//         });
//
//     };
//
//     private prepareUpdateData = (): Object => {
//         let res = {};
//         res = SiteManager.getSite()
//         return res;
//     };
//     // region API uncions
//
//     public static updateListeners = UpdateListenersManager.instance.updateListeners;
//
//     // endregion API uncions
//
// }
