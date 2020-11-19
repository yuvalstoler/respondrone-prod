const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { GeoPoint } from '../../../../../classes/dataClasses/geo/geoPoint';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    MISSION_DATA,
    MISSION_DATA_UI,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_ROUTE_DATA,
    POINT,
} from '../../../../../classes/typings/all.typings';



import {
    MS_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {MissionRequestManager} from "../missionRequest/missionRequestManager";
import {MissionManager} from "../mission/missionManager";
import {MissionRouteManager} from "../missionRoute/missionRouteManager";


export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();


    private constructor() {
        // this.getDynamicNfzFromWebServer();
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };


    private createMissionRequest = (request: Request, response: Response) => {
        const requestBody: MISSION_REQUEST_DATA = request.body;
        MissionRequestManager.createMissionRequest(requestBody)
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                response.send(data);
            });
    };

    private createMissionRequestFromMGW = (request: Request, response: Response) => {
        const requestBody: MISSION_REQUEST_DATA = request.body;
        MissionRequestManager.createMissionRequestFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                response.send(data);
            });
    };

    private readAllMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]> = {success: false};
        MissionRequestManager.readAllMissionRequest({})
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_DATA[]> = {success: false};
        MissionManager.readAllMission({})
            .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]> = {success: false};
        MissionRouteManager.readAllMissionRoute({})
            .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private missionRequestAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: MISSION_REQUEST_ACTION_OBJ = request.body;
        MissionRequestManager.missionRequestAction(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };



    routers: {} = {
        [MS_API.createMissionRequestFromMGW]: this.createMissionRequestFromMGW,

        [MS_API.createMissionRequest]: this.createMissionRequest,
        [MS_API.readAllMissionRequest]: this.readAllMissionRequest,
        [MS_API.readAllMission]: this.readAllMission,
        [MS_API.readAllMissionRoute]: this.readAllMissionRoute,
        [MS_API.missionRequestAction]: this.missionRequestAction,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
