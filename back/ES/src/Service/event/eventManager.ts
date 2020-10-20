import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {DBS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {ASYNC_RESPONSE, EVENT_DATA, ID_OBJ} from '../../../../../classes/typings/all.typings';
import {UpdateListenersManager} from '../updateListeners/updateListenersManager';
import {Event} from '../../../../../classes/dataClasses/event/event';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';


export class EventManager {


    private static instance: EventManager = new EventManager();


    events: Event[] = [];

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
            RequestManager.requestToDBS(DBS_API.readAllEvent, {})
                .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                    if ( data.success ) {
                        this.events = Converting.Arr_EVENT_DATA_to_Arr_Event(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getEventsFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                    //todo logger
                    console.log('error getEventsFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
        //get StaticNfz From AMS

    };

    private getEventsDATA = (idObj: ID_OBJ): EVENT_DATA[] => {
        const res: EVENT_DATA[] = [];
        if ( idObj ) {
            const found = this.events.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJsonForSave());
            }
        }
        else {
            this.events.forEach((event: Event) => {
                res.push(event.toJsonForSave());
            });
        }
        return res;
    };

    private getEvent = (idObj: ID_OBJ): Event => {
        let res: Event;
        if ( idObj ) {
            res = this.events.find(element => element.id === idObj.id);
        }

        return res;
    };

    private createEvent = (eventData: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            eventData.id = eventData.id || DataUtility.generateID();
            eventData.time = eventData.time || Date.now();
            eventData.idView = eventData.idView || DataUtility.generateIDForView();
            const newEvent: Event = new Event(eventData);

            RequestManager.requestToDBS(DBS_API.createEvent, newEvent.toJsonForSave())
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const event: Event = this.events.find(element => element.id === data.data.id);
                        if (event) {
                            event.setValues(data.data);
                        } else {
                            this.events.push(new Event(data.data));
                        }

                        UpdateListenersManager.updateEventListeners();
                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }

    private updateEvent = (eventData: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const event: Event = this.getEvent({id: eventData.id});
            //todo save - send to DBS
            res.success = true;
            //    todo send to RS
            resolve(res);
        });
    }


    private readEvent = (eventIdData: ID_OBJ): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const findedEvent: Event = this.events.find((event: Event) => {
                return event.id === eventIdData.id;
            });
            if ( findedEvent ) {
                res.success = true;
                res.data = findedEvent;
            }
            resolve(res);
        });
    }
    private readAllEvent = (requestData): Promise<ASYNC_RESPONSE<EVENT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            this.events.forEach((event: Event) => {
                res.data.push(event.toJsonForSave());
            });
            resolve(res);
        });
    }
    private deleteEvent = (eventIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteEvent, eventIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        const index = this.events.findIndex(element => element.id === data.data.id);
                        if (index !== -1) {
                            this.events.splice(index, 1);
                        }
                        UpdateListenersManager.updateEventListeners();

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
    private deleteAllEvent = (): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteAllEvent, {})
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
    public static getEvents = EventManager.instance.getEventsDATA;
    public static getEvent = EventManager.instance.getEventsDATA;

    public static createEvent = EventManager.instance.createEvent;
    public static updateEvent = EventManager.instance.updateEvent;

    public static readEvent = EventManager.instance.readEvent;
    public static readAllEvent = EventManager.instance.readAllEvent;
    public static deleteEvent = EventManager.instance.deleteEvent;
    public static deleteAllEvent = EventManager.instance.deleteAllEvent;


    // endregion API uncions

}
