import {
    ASYNC_RESPONSE, GRAPHIC_OVERLAY_DATA, ID_OBJ, MISSION_DATA, MISSION_REQUEST_DATA, MISSION_ROUTE_DATA, NFZ_DATA,
    REPORT_DATA
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import {API_GENERAL, WS_API} from '../../../../../classes/dataClasses/api/api_enums';
import {MissionRequestManager} from "../missionRequest/missionRequestManager";
import {MissionManager} from "../mission/missionManager";
import {MissionRouteManager} from "../missionRoute/missionRouteManager";
import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import {GraphicOverlayManager} from "../graphicOverlay/graphicOverlayManager";
import {NFZManager} from "../nfz/nfzManager";

const _ = require('lodash');


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.MS.listeners;
const updateMissionRequestListenersURL = API_GENERAL.general + WS_API.updateAllMissionRequests;
const updateMissionsListenersURL = API_GENERAL.general + WS_API.updateAllMissions;
const updateMissionRoutesListenersURL = API_GENERAL.general + WS_API.updateAllMissionRoutes;
const updateGraphicOverlaysListenersURL = API_GENERAL.general + WS_API.updateAllGraphicOverlays;
const updateNFZsListenersURL = API_GENERAL.general + WS_API.updateAllNFZs;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateMissionRequestListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: MISSION_REQUEST_DATA[] = MissionRequestManager.getMissionRequests(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateMissionRequestListenersURL, allData);
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

    private updateMissionListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: MISSION_DATA[] = MissionManager.getMissions(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateMissionsListenersURL, allData);
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

    private updateMissionRouteListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: MISSION_ROUTE_DATA[] = MissionRouteManager.getMissionRoutes(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateMissionRoutesListenersURL, allData);
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

    private updateGraphicOverlayListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: GRAPHIC_OVERLAY_DATA[] = GraphicOverlayManager.getGraphicOverlays(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateGraphicOverlaysListenersURL, allData);
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

    private updateNFZListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allData: NFZ_DATA[] = NFZManager.getNFZs(undefined);
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                // console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateNFZsListenersURL, allData);
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
    public static updateMissionRequestListeners = UpdateListenersManager.instance.updateMissionRequestListeners;
    public static updateMissionListeners = UpdateListenersManager.instance.updateMissionListeners;
    public static updateMissionRouteListeners = UpdateListenersManager.instance.updateMissionRouteListeners;
    public static updateGraphicOverlayListeners = UpdateListenersManager.instance.updateGraphicOverlayListeners;
    public static updateNFZListeners = UpdateListenersManager.instance.updateNFZListeners;


    // endregion API functions

}
