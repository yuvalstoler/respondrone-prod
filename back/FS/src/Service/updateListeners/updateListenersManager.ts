const _ = require('lodash');

import {
    ASYNC_RESPONSE,
    FILE_FS_DATA,

} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    API_GENERAL,
    FS_API,

} from '../../../../../classes/dataClasses/api/api_enums';


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.FS.listeners;
const updateFileListenersURL = API_GENERAL.general + FS_API.updateListenersFS;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateFileListeners = (fileData: FILE_FS_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {

            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateFileListenersURL, fileData);
                promisesArr.push(requestPromise);
            });

            const res: ASYNC_RESPONSE = {success: false};
            Promise.all(promisesArr)
                .then((result: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *then* updateFileListeners');
                    res.success = true;
                    resolve(res);
                })
                .catch((error: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *catch* updateFileListeners');
                    resolve(res);
                });
        });

    }


    // region API functions

    // public static updateListeners = UpdateListenersManager.instance.updateListeners;
    public static updateFileListeners = UpdateListenersManager.instance.updateFileListeners;


    // endregion API functions

}
