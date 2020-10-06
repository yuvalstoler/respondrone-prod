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
    ENTITY_ARR
} from '../../classes/all.typings';

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
            DbManager.initCollectionVersion();
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
            this.saveToLog(request.baseUrl, request.body, res);
            response.send(res);
            return;
        }

        body.id = this.generateID();
        body.version = 0;
        body.lastAction = LAST_ACTION.Insert;
        body.collectionVersion = DbManager.createCollectionVersion();

        DbManager.insert(body)
            .then((data) => {
                DbManager.updateCollectionVersion(data.collectionVersion);
                const res: REP_ENT_GEN_RESPONSE = {
                    id: data.id,
                    entVersion: data.version,
                    collectionVersion: DbManager.getCollectionVersion()
                };
                this.saveToLog(request.baseUrl, request.body, res);
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
        body.lastAction = LAST_ACTION.Update;
        body.collectionVersion = DbManager.createCollectionVersion();

        DbManager.update({id: body.id, lastAction: { $not: {$eq: LAST_ACTION.Delete}}}, {...body, ...{$inc: {'version' : 1}}})
            .then((data) => {
                DbManager.updateCollectionVersion(data.collectionVersion);
                const res: REP_ENT_GEN_RESPONSE = {
                    id: data.id,
                    entVersion: data.version,
                    collectionVersion: DbManager.getCollectionVersion()
                };
                this.saveToLog(request.baseUrl, request.body, res);
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
            const body: any = {};
            body.lastAction = LAST_ACTION.Delete;
            body.collectionVersion = DbManager.createCollectionVersion();

            DbManager.update({id: id}, {$set: {'lastAction': body.lastAction, 'collectionVersion': body.collectionVersion}, $inc : {'version' : 1}})
                .then((data) => {
                    DbManager.updateCollectionVersion(data.collectionVersion);
                    const res: GENERAL_RESPONSE = {
                        success: true,
                        description: '',
                    };
                    this.saveToLog(request.baseUrl, request.query, res);
                    response.send(res);
                })
                .catch((data) => {
                    const res: GENERAL_RESPONSE = {
                        success: false,
                        description: JSON.stringify(data),
                    };
                    this.saveToLog(request.baseUrl, request.query, res);
                    response.send(res);
                });
        }
        else {
            const res: GENERAL_RESPONSE = {
                success: false,
                description: 'Missing path parameter id',
            };
            this.saveToLog(request.baseUrl, request.query, res);
            response.send(res);
        }
    };
    // ----------------------
    private getLast = (request: Request, response: Response) => {

        const currentVersion = parseInt(_.get(request.params, 'currentVersion'), 0);

        if (Number.isFinite(currentVersion)) {
            DbManager.requests({'collectionVersion': {$gt : currentVersion}})
                .then((data) => {
                    const res: REP_COLLECTION_GEN_RESPONSE & ENTITY_ARR = {
                        collectionVersion: DbManager.getCollectionVersion(),
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
        }
        else {
            const res: GENERAL_RESPONSE = {
                success: false,
                description: 'Missing path parameter currentVersion',
            };
            response.send(res);
        }
    };
    // ----------------------
    private keepAlive = (request: Request, response: Response) => {
        response.send({success: true});
    };

    // ---------------------------
    private saveToLog = (url: string, data: any, response: any) => {
        const obj = {
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

    routers = {
        [routes.insert]:           this.insert,
        [routes.update]:           this.update,
        [routes.delete]:           this.delete,
        [routes.getLast]:          this.getLast,

        '/keepAlive':               this.keepAlive
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
