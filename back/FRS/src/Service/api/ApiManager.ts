import {FRS_API} from '../../../../../classes/dataClasses/api/api_enums';

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { FrManager } from '../fr/frManager';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, ID_TYPE,
} from '../../../../../classes/typings/all.typings';


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

    private getFRById = (request: Request, response: Response) => {
        const requestBody: ID_OBJ = request.body;
        FrManager.getFRById(requestBody)
            .then((data: ASYNC_RESPONSE<FR_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<FR_DATA>) => {
                response.send(data);
            });
    };


    routers: {} = {
        [FRS_API.getFRById]: this.getFRById
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
