import {Converting} from '../../../../../classes/applicationClasses/utility/converting';
import {Report} from '../../../../../classes/dataClasses/report/report';

import {MS_API, RS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    FILE_FS_DATA,
    ID_OBJ,
    ID_TYPE, LAST_ACTION,
    LINKED_REPORT_DATA,
    MEDIA_TYPE,
    MISSION_DATA,
    MISSION_DATA_UI,
    MISSION_REQUEST_DATA,
    MISSION_REQUEST_DATA_UI,
    MISSION_ROUTE_DATA, MISSION_ROUTE_DATA_UI, MISSION_STATUS,
    MISSION_TYPE,
    REPORT_DATA,
    REPORT_DATA_UI, ROUTE_STATUS
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {EventManager} from '../event/eventManager';
import {ReportMdLogic} from '../../../../../classes/modeDefineTSSchemas/reports/reportMdLogic';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';
import {MissionRoute} from "../../../../../classes/dataClasses/missionRoute/missionRoute";
import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import {MissionRouteMdLogic} from "../../../../../classes/modeDefineTSSchemas/missionRoute/missionRouteMdLogic";
import {MissionRequestManager} from "../missionRequest/missionRequestManager";
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class MissionRouteManager {


    private static instance: MissionRouteManager = new MissionRouteManager();


    missionRoutes: MissionRoute[] = [];

    private constructor() {
        this.getMissionRoutesFromMS();

    }

    private getMissionRoutesFromMS = () => {
        RequestManager.requestToMS(MS_API.readAllMissionRoute, {})
            .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                if ( data.success ) {
                    this.missionRoutes = Converting.Arr_MISSION_ROUTE_DATA_to_Arr_MissionRoute(data.data);
                }
                else {
                    //todo logger
                    console.log('error getMissionRoutesFromMS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getMissionRoutesFromMS', JSON.stringify(data));
            });
    };

    private getMissionRoutes = (): MISSION_ROUTE_DATA[] => {
        const res: MISSION_ROUTE_DATA[] = [];
        this.missionRoutes.forEach((missionRoute: MissionRoute) => {
            res.push(missionRoute.toJson());
        });
        return res;
    }


    private readAllMissionRoute = (requestData): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            // this.reports.forEach((report: Report) => {
            //     res.data.push(report.toJsonForSave());
            // });
            res.data = this.getDataForUI();
            resolve(res);
        });
    }

    private updateAllMissionRoutes = (data: MISSION_ROUTE_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.missionRoutes = Converting.Arr_MISSION_ROUTE_DATA_to_Arr_MissionRoute(data);
            res.success = true;
            this.sendDataToUI();
            resolve(res);


        });
    }

    private getDataForUI = (): MISSION_ROUTE_DATA_UI[] => {
        const res: MISSION_ROUTE_DATA_UI[] = [];
        this.missionRoutes.forEach((missionRoute: MissionRoute) => {
            const missionRouteDataUI: MISSION_ROUTE_DATA_UI = missionRoute.toJsonForUI();
            const missionRequest: MissionRequest = MissionRequestManager.getMissionRequestById(missionRoute.requestId);
            missionRouteDataUI.modeDefine = MissionRouteMdLogic.validate(missionRouteDataUI, missionRequest);

            res.push(missionRouteDataUI);
        });
        return res;
    };


    private getMissionRouteById = (missionId: ID_TYPE) => {
        return this.missionRoutes.find(element => element.id === missionId)
    }

    private sendDataToUI = (): void => {
        const jsonForSend: MISSION_ROUTE_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_missionRoutes', jsonForSend);
    };

    // region API uncions

    public static getMissionRoutes = MissionRouteManager.instance.getMissionRoutes;
    public static readAllMissionRoute = MissionRouteManager.instance.readAllMissionRoute;
    public static updateAllMissionRoutes = MissionRouteManager.instance.updateAllMissionRoutes;
    public static getMissionRouteById = MissionRouteManager.instance.getMissionRouteById;

    public static sendDataToUI = MissionRouteManager.instance.sendDataToUI;


    // endregion API uncions

}
