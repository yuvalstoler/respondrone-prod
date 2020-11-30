import {DbManager} from '../db/dbManager';
import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';

const _ = require('lodash');
import {IRest} from '../../classes/IRest';
import {
    ENTITY_DATA,
    GENERAL_RESPONSE,
    LAST_ACTION,
    REP_COLLECTION_GEN_RESPONSE,
    REP_ENT_GEN_RESPONSE,
    ENTITY_ARR, LOG_DATA
} from '../../classes/all.typings';

const projConf = require("./../../../config/projConf.json");
const routes = projConf.LoggerService.routes;
const interval = projConf.LoggerService.interval;


export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();

    private logs: LOG_DATA[] = [];


    private constructor() {
        this.startUpdateLogs();
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

    // ----------------------
    private startUpdateLogs = () => {
        setInterval(() => {
            DbManager.getLogs({})
                .then((data: LOG_DATA[]) => {
                    this.logs = data;
                })
                .catch((data) => {
                });
        }, interval);
    };
    // ----------------------
    private data = (request: Request, response: Response) => {
        response.render('data.ejs', {logs: this.logs});
    }
    // ----------------------
    private getData = (request: Request, response: Response) => {
        response.render('getData.ejs', {logs: this.logs});
    }

    // ---------------------------

    private routers = {
        [routes.data]:            this.data,
        '/getData':               this.getData,
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
