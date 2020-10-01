import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {DBS_API, ES_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {ASYNC_RESPONSE, EVENT_DATA} from '../../../../../classes/typings/all.typings';
import {UpdateListenersManager} from '../updateListeners/updateListenersManager';
import {EventClass} from '../../../../../classes/dataClasses/event/event';


export class EventManager {


    private static instance: EventManager = new EventManager();


    events: EventClass[] = [];

    private constructor() {
        this.initAllEvents();
    }

    private initAllEvents = () => {
        this.getEventsFromDBS()
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                //    todo send to listeners
                UpdateListenersManager.updateEventListeners();
            })
            .catch((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                setTimeout(() => {
                    this.initAllEvents();
                }, 5000);
            });
        //    todo like AMS NFZ (or perimeter)

    }

    private getEventsFromDBS = (): Promise<ASYNC_RESPONSE<EVENT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.getAllEvents, {})
                .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                    if (data.success) {
                        this.events = Converting.Arr_EVENT_DATA_to_Arr_Event(data.data);
                        resolve(data);
                    } else {
                        //todo logger
                        console.log('error getEventsFromDBS', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                    //todo logger
                    console.log('error getEventsFromDBS', JSON.stringify(data));
                    reject(data);
                });
        });

    };

    private getEvents = (): EVENT_DATA[] => {
        const res: EVENT_DATA[] = [];
        this.events.forEach((event: EventClass) => {
            res.push(event.toJsonForSave());
        });
        return res;
    };

    private newEvent = (eventData: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const newEvent: EventClass = new EventClass(eventData);
            //todo save - send to DBS
            res.data = newEvent.toJsonForSave();
            res.success = true;
            //    todo send to RS

            resolve(res);

        });
    }


    // region API uncions
    public static getEvents = EventManager.instance.getEvents;
    public static newEvent = EventManager.instance.newEvent;


    // endregion API uncions

}
