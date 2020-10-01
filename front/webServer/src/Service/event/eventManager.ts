import { Converting } from "../../../../../classes/applicationClasses/utility/converting";



import {
    ES_API
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE, EVENT_DATA
} from '../../../../../classes/typings/all.typings';
import {EventClass} from "../../../../../classes/dataClasses/event/event";


export class EventManager {


    private static instance: EventManager = new EventManager();


    events: EventClass[] = [];

    private constructor() {
        this.getEventsFromES();
    }

    private getEventsFromES = () => {
        RequestManager.requestToES(ES_API.getAllEvents, {})
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                if ( data.success ) {
                    this.events = Converting.Arr_EVENT_DATA_to_Arr_Event(data.data);
                }
                else {
                    //todo logger
                    console.log('error getEventsFromES', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                //todo logger
                console.log('error getEventsFromES', JSON.stringify(data));
            });
    };
    private getEvents = (): EVENT_DATA[] => {
        const res: EVENT_DATA[] = [];
        this.events.forEach((event: EventClass) => {
            res.push(event.toJsonForSave());
        });
        return res;
    }

    private updateAllEvents = (eventData: EVENT_DATA[]): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.events = Converting.Arr_EVENT_DATA_to_Arr_Event(eventData);
            res.success = true;
            //    todo send to ES

            resolve(res);

        });
    }
    private newEvent = (eventData: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const newEvent: EventClass = new EventClass(eventData);
            res.data = newEvent.toJsonForSave();
            res.success = true;
            //    todo send to ES

            resolve(res);

        });
    }

    // region API uncions

    public static getEvents = EventManager.instance.getEvents;
    public static updateAllEvents = EventManager.instance.updateAllEvents;
    public static newEvent = EventManager.instance.newEvent;


    // endregion API uncions

}
