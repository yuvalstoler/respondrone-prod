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
    ENTITY_ARR, DISCOVERY_STATUS, LOG_DATA
} from '../../classes/all.typings';
import {DiscoveryManager} from "../discoveryManager/discoveryManager";

const projConf = require("./../../../config/projConf.json");
const schemas = projConf.EntityService.schemas;
const routes = projConf.EntityService.routes;
const entityArrKey = projConf.EntityService.entityArrKey;

const Ajv = require('ajv');


export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();
    private validateObj = {entity: undefined};

    private constructor() {
        this.loadSchemas();

        setTimeout(() => {
            // DbManager.initCollectionVersion();
            DbManager.updateCollectionVersion(0);
            DiscoveryManager.startCheckKeepAlive();
        }, 1000);
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
    private loadSchemas = () => {
        const entitySchema = require(schemas.entity);
        const ajv = new Ajv();
        this.validateObj.entity = ajv.compile(entitySchema);
    };


    // ----------------------
    private insert = (request: Request, response: Response) => {

        const body: ENTITY_DATA = request.body;
        const valid = this.validateObj.entity(body);
        if (!valid) {
            const errors = this.validateObj.entity.errors;
            const res: GENERAL_RESPONSE = {
                success: false,
                description: errors[0] ? `${errors[0].dataPath} ${errors[0].message} ${JSON.stringify(errors[0].params)}` : 'validation failed',
            };
            // this.saveToLog(request.baseUrl, request.body, res);
            response.send(res);
            return;
        }

        body.id = this.generateID();
        body.version = 0;
        body.keepAliveStatus = DISCOVERY_STATUS.Down;
        // body.lastAction = LAST_ACTION.Insert;
        // body.collectionVersion = DbManager.createCollectionVersion();

        DbManager.insert(body)
            .then((data) => {
                // DbManager.updateCollectionVersion(data.collectionVersion);
                const res: REP_ENT_GEN_RESPONSE = {
                    id: data.id,
                    entVersion: data.version,
                    collectionVersion: DbManager.getCollectionVersion()
                };
                // this.saveToLog(request.baseUrl, request.body, res);

                DiscoveryManager.startCheckKeepAlive();
                response.send(res);
            })
            .catch((data) => {
                const res: GENERAL_RESPONSE = {
                    success: false,
                    description: JSON.stringify(data),
                };
                // this.saveToLog(request.baseUrl, request.body, res);
                response.send(res);
            });
    };
    // ----------------------
    private update = (request: Request, response: Response) => {

        const body: ENTITY_DATA = request.body;
        const valid = this.validateObj.entity(body);
        if (!valid) {
            const errors = this.validateObj.entity.errors;
            const res: GENERAL_RESPONSE = {
                success: false,
                description: errors[0] ? `${errors[0].dataPath} ${errors[0].message} ${JSON.stringify(errors[0].params)}` : 'validation failed',
            };
            this.saveToLog(request.baseUrl, request.body, res);
            response.send(res);
            return;
        }

        delete body.version;
        delete body.keepAliveStatus;
        // body.lastAction = LAST_ACTION.Update;
        // body.collectionVersion = DbManager.createCollectionVersion();

        DbManager.update({id: body.id}, {...body, ...{$inc: {'version' : 1}}})
            .then((data) => {
                // DbManager.updateCollectionVersion(data.collectionVersion);
                const res: REP_ENT_GEN_RESPONSE = {
                    id: data.id,
                    entVersion: data.version,
                    collectionVersion: DbManager.getCollectionVersion()
                };
                this.saveToLog(request.baseUrl, request.body, res);
                DiscoveryManager.updateServiceKeepAlive(data);
                response.send(res);
            })
            .catch((data) => {
                const res: GENERAL_RESPONSE = {
                    success: false,
                    description: JSON.stringify(data),
                };
                this.saveToLog(request.baseUrl, request.body, res);
                response.send(res);
            });
    };
    // ----------------------
    private delete = (request: Request, response: Response) => {

        const id = _.get(request.params, 'id');

        if (id) {
            DbManager.delete({id: id})
                .then((data) => {
                    const res: GENERAL_RESPONSE = {
                        success: true,
                        description: '',
                    };
                    // this.saveToLog(request.baseUrl, request.query, res);

                    DiscoveryManager.startCheckKeepAlive();
                    response.send(res);
                })
                .catch((data) => {
                    const res: GENERAL_RESPONSE = {
                        success: false,
                        description: JSON.stringify(data),
                    };
                   //  this.saveToLog(request.baseUrl, request.query, res);
                    response.send(res);
                });
        }
        else {
            const res: GENERAL_RESPONSE = {
                success: false,
                description: 'Missing path parameter id',
            };
            // this.saveToLog(request.baseUrl, request.query, res);
            response.send(res);
        }
    };
    // ----------------------
    private getAll = (request: Request, response: Response) => {

        DbManager.requests({})
            .then((data) => {
                const res: ENTITY_ARR = {
                    [entityArrKey]: data
                };
                response.send(res);
            })
            .catch((data) => {
                const res: GENERAL_RESPONSE = {
                    success: false,
                    description: JSON.stringify(data),
                };
                response.send(res);
            });
    };


    // ---------------------------
    private saveToLog = (url: string, data: any, response: any) => {
        const obj: LOG_DATA = {
            url: url,
            data: data,
            response: response,
            date: Date.now()
        };
        DbManager.saveLog(obj); // TODO: external service?
    };
    // ---------------------------
    private generateID = (): string => {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    };

    // ---------------------------

    private routers = {
        [routes.update]:           this.update,
        [routes.getAll]:           this.getAll,

        '/insertDiscovery':         this.insert,
        '/deleteDiscovery/:id':     this.delete,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
