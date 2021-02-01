import {DiscoveryManager} from '../discoveryManager/discoveryManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { GeoPoint } from '../../../../../classes/dataClasses/geo/geoPoint';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE, DISCOVERY_DATA, GRAPHIC_OVERLAY_DATA,
    ID_OBJ,
    MISSION_DATA,
    MISSION_DATA_UI,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_ROUTE_DATA, MISSION_TYPE, NFZ_DATA,
    POINT, STATUS_INDICATOR_DATA,
} from '../../../../../classes/typings/all.typings';



import {
    MS_API, STATUS_SERVICE_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';



export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();


    private constructor() {

    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };



    private readAllStatuses = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<STATUS_INDICATOR_DATA> = {success: false};
        DiscoveryManager.readAllStatuses({})
            .then((data: ASYNC_RESPONSE<STATUS_INDICATOR_DATA>) => {
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



    routers: {} = {
        [STATUS_SERVICE_API.readAllStatuses]: this.readAllStatuses,
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
