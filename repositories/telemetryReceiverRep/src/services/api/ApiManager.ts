import {DbManager} from '../db/dbManager';
import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';

const _ = require('lodash');
import {IRest} from '../../classes/IRest';
import {SocketManager} from "../socket/SocketManager";
const projConf = require("./../../../config/projConf.json");


export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();

    private constructor() {
    }

    // ----------------------
    public listen = (router: core.Router): boolean => {
        for (const path in this.routers) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };
    // ---------------------------

    routers = {
        '/data': (request, response) => {
            const data = SocketManager.getData()
            response.json(data);
        }
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
