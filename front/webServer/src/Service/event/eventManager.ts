import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');

import { Event } from '../../../../../classes/dataClasses/event/event';

import {
    EVENT_API,
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    EVENT_DATA, ID_TYPE, EVENT_DATA_UI, LINKED_REPORT_DATA, LINKED_EVENT_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {EventMdLogic} from '../../../../../classes/modeDefineTSSchemas/events/eventMdLogic';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';


export class EventManager {


    private static instance: EventManager = new EventManager();


    events: Event[] = [];

    private constructor() {
        this.getEventsFromES();
    }

    private getEventsFromES = () => {
        RequestManager.requestToES(EVENT_API.readAllEvent, {})
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
        this.events.forEach((event: Event) => {
            res.push(event.toJsonForSave());
        });
        return res;
    }
    private getLinkedEvents = (ids: ID_TYPE[]): LINKED_EVENT_DATA[] => {
        const res: LINKED_EVENT_DATA[] = [];
        this.events.forEach((event: Event) => {
            if (ids.indexOf(event.id) !== -1) {
                const data = event.toJsonLinked();
                res.push(data);
            }
        });
        return res;
    }

    private updateAllEvents = (eventData: EVENT_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.events = Converting.Arr_EVENT_DATA_to_Arr_Event(eventData);
            res.success = true;
            this.sendDataToUI();
            ReportManager.sendDataToUI();
            resolve(res);

        });
    }
    private createEvent = (eventData: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const newEvent: Event = new Event(eventData);
            const newEventDataJson: EVENT_DATA = newEvent.toJsonForSave();
            res.data = newEventDataJson;
            res.success = true;

            RequestManager.requestToES(EVENT_API.createEvent, newEventDataJson)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    resolve(data);
                });

            // resolve(res);

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
            // this.events.forEach((event: Event) => {
            //     res.data.push(event.toJsonForSave());
            // });
            res.data = this.getDataForUI();
            resolve(res);
        });
    }
    private deleteEvent = (eventIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToES(EVENT_API.deleteEvent, eventIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log('delete event', data);
                    reject(data);
                });
        });
    }
    private deleteAllEvent = (): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToES(EVENT_API.deleteAllEvent, {})
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

    private getDataForUI = (): EVENT_DATA_UI[] => {
        const res: EVENT_DATA_UI[] = [];
        this.events.forEach((event: Event) => {
            const eventDataUI: EVENT_DATA_UI = event.toJsonForUI();
            eventDataUI.reports = ReportManager.getLinkedReports(event.reportIds);
            eventDataUI.modeDefine = EventMdLogic.validate(eventDataUI);

            res.push(eventDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: EVENT_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_eventsData', jsonForSend);
    };

    // region API uncions

    public static getEvents = EventManager.instance.getEvents;

    public static updateAllEvents = EventManager.instance.updateAllEvents;
    public static createEvent = EventManager.instance.createEvent;
    public static readEvent = EventManager.instance.readEvent;
    public static readAllEvent = EventManager.instance.readAllEvent;
    public static deleteEvent = EventManager.instance.deleteEvent;
    public static deleteAllEvent = EventManager.instance.deleteAllEvent;

    public static getLinkedEvents = EventManager.instance.getLinkedEvents;
    public static sendDataToUI = EventManager.instance.sendDataToUI;


    // endregion API uncions

}
