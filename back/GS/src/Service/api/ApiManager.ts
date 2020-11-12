import {GS_API} from "../../../../../classes/dataClasses/api/api_enums";

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, GIMBAL_ACTION,
} from '../../../../../classes/typings/all.typings';


import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {GimbalManager} from "../gimbal/gimbalManager";


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


    private gimbalAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_ACTION = request.body;
        GimbalManager.gimbalAction(requestBody)
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
        [GS_API.gimbalAction]: this.gimbalAction
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
