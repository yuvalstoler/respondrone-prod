const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';

import {
    ASYNC_RESPONSE, COLLECTION_VERSIONS,
    EVENT_DATA,
    FILE_DB_DATA, GRAPHIC_OVERLAY_DATA,
    ID_OBJ,
    ID_TYPE, MISSION_DATA, MISSION_REQUEST_DATA, MISSION_ROUTE_DATA, USER_DATA,
    REPORT_DATA,
    TASK_DATA,
} from '../../../../../classes/typings/all.typings';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {
    AUTH_API,
    DBS_API
} from '../../../../../classes/dataClasses/api/api_enums';
import {AuthManager} from '../../auth/authManager';


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
    
    routers: {} = {

        [AUTH_API.login]: AuthManager.login,
        [AUTH_API.update]: AuthManager.update,
        [AUTH_API.check]: AuthManager.check,

        [AUTH_API.createUser]: AuthManager.createUser,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
