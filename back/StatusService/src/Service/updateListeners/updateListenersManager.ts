import {
    ASYNC_RESPONSE,
    DISCOVERY_DATA,
    GRAPHIC_OVERLAY_DATA,
    ID_OBJ,
    MISSION_DATA,
    MISSION_REQUEST_DATA,
    MISSION_ROUTE_DATA,
    NFZ_DATA,
    REPORT_DATA, STATUS_INDICATOR_DATA
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import {API_GENERAL, WS_API} from '../../../../../classes/dataClasses/api/api_enums';
import {DiscoveryManager} from '../discoveryManager/discoveryManager';
const _ = require('lodash');


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.StatusService.listeners;
const updateDiscoveryListenersURL = API_GENERAL.general + WS_API.updateAllStatuses;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateDiscoveryListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: STATUS_INDICATOR_DATA = DiscoveryManager.getDiscoveryData();
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateDiscoveryListenersURL, allData);
                promisesArr.push(requestPromise);
            });

            const res: ASYNC_RESPONSE = {success: false};
            Promise.all(promisesArr)
                .then((result: ASYNC_RESPONSE[]) => {
                    // console.log(Date.now(), 'finish *then* updateReportListeners');
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
    public static updateDiscoveryListeners = UpdateListenersManager.instance.updateDiscoveryListeners;


    // endregion API functions

}
