
const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { GeoPoint } from '../../../../../classes/dataClasses/geo/geoPoint';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    POINT,
} from '../../../../../classes/typings/all.typings';



import {
    MWS_API,
    REPORT_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';


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


    private createDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody = request.body;

        // NfzManager.createDynamicNFZFromRoute(requestBody)
        //     .then((data: ASYNC_RESPONSE) => {
        response.send(res);
        // })
        // .catch((data: ASYNC_RESPONSE) => {
        //     response.send(data);
        // });
    };

    private getVideoSources = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody = request.body;

        // NfzManager.createDynamicNFZFromRoute(requestBody)
        //     .then((data: ASYNC_RESPONSE) => {
        response.send(res);
        // })
        // .catch((data: ASYNC_RESPONSE) => {
        //     response.send(data);
        // });
    };


    routers: {} = {
        [REPORT_API.createReport]: this.createDynamicNFZ,
        [MWS_API.getVideoSources]: this.getVideoSources,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
