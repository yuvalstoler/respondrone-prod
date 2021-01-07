import {GS_API} from '../../../../../classes/dataClasses/api/api_enums';

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    GIMBAL_CONTROL_REQUEST_MGW,
    GIMBAL_CONTROL_REQUEST_OSCC,
    GIMBAL_ACTION_MGW,
    GIMBAL_ACTION_OSCC,
    GIMBAL_CONTROL_DATA_FOR_MGW,
} from '../../../../../classes/typings/all.typings';


import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {GimbalManager} from '../gimbal/gimbalManager';
import {GimbalControlManager} from '../gimbalControl/gimbalControlManager';


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


    private gimbalActionFromMGW = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_ACTION_MGW = request.body;
        GimbalManager.gimbalActionFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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

    private gimbalActionFromOSCC = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_ACTION_OSCC = request.body;
        GimbalManager.gimbalActionFromOSCC(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.description = data.description;
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

    private requestGimbalControlFromMGW = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_CONTROL_REQUEST_MGW = request.body;
        GimbalControlManager.requestGimbalControlFromMGW(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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

    private requestGimbalControlFromOSCC = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_CONTROL_REQUEST_OSCC = request.body;
        GimbalControlManager.requestGimbalControlFromOSCC(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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

    private getGimbalControlData = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody = request.body;
        GimbalControlManager.getGimbalControlData(requestBody)
            .then((data: ASYNC_RESPONSE) => {
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
        [GS_API.gimbalActionFromOSCC]: this.gimbalActionFromOSCC,
        [GS_API.gimbalActionFromMGW]: this.gimbalActionFromMGW,
        [GS_API.requestGimbalControlFromMGW]: this.requestGimbalControlFromMGW,
        [GS_API.requestGimbalControlFromOSCC]: this.requestGimbalControlFromOSCC,
        [GS_API.getGimbalControlData]: this.getGimbalControlData
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
