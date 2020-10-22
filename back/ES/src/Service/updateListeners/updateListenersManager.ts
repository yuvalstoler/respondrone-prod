import {
    ASYNC_RESPONSE, EVENT_DATA,
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import {API_GENERAL, WS_API} from '../../../../../classes/dataClasses/api/api_enums';
import {EventManager} from '../event/eventManager';

const _ = require('lodash');


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.RS.listeners;
const updateRouteListenersURL = API_GENERAL.general + WS_API.updateAllEvents;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateEventListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allEventsData: EVENT_DATA[] = EventManager.getEvents(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                console.log(Date.now(), 'start updateEventListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateRouteListenersURL, allEventsData);
                promisesArr.push(requestPromise);
            });

            const res: ASYNC_RESPONSE = {success: false};
            Promise.all(promisesArr)
                .then((result: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *then* updateEventListeners');
                    res.success = true;
                    resolve(res);
                })
                .catch((error: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *catch* updateEventListeners');
                    resolve(res);
                });
        });

    }


    // region API functions

    // public static updateListeners = UpdateListenersManager.instance.updateListeners;
    public static updateEventListeners = UpdateListenersManager.instance.updateEventListeners;


    // endregion API functions

}
