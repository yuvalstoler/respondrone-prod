
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
    FR_DATA,
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




    routers: {} = {

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions


}
