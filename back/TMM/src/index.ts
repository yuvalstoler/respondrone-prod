import * as express from 'express';

const _express = require('express');
import * as http from 'http';
import * as path from 'path';
import * as cors from 'cors';

import * as bodyParser from 'body-parser';

const request = require('request');

const services = require('./../../../../../../config/services.json');


import {API_GENERAL, TMM_API} from '../../../classes/dataClasses/api/api_enums';
import {ASYNC_RESPONSE, REST_ROUTER_CONFIG} from '../../../classes/typings/all.typings';


const url_CommRelayMissionRep = services.CommRelayMissionRep.protocol + '://' + services.CommRelayMissionRep.host + ':' + services.CommRelayMissionRep.port;
const url_PatrolMissionRep = services.PatrolMissionRep.protocol + '://' + services.PatrolMissionRep.host + ':' + services.PatrolMissionRep.port;
const url_ObservationMissionRep = services.ObservationMissionRep.protocol + '://' + services.ObservationMissionRep.host + ':' + services.ObservationMissionRep.port;
const url_ScanMissionRep = services.ScanMissionRep.protocol + '://' + services.ScanMissionRep.host + ':' + services.ScanMissionRep.port;
const url_ServoingMissionRep = services.ServoingMissionRep.protocol + '://' + services.ServoingMissionRep.host + ':' + services.ServoingMissionRep.port;
const url_DeliveryMissionRep = services.DeliveryMissionRep.protocol + '://' + services.DeliveryMissionRep.host + ':' + services.DeliveryMissionRep.port;



export class Server {

    private port = services.TMM.port;
    public app: any;
    private server: any;
    private alertService: any;


    public static bootstrap(): Server {
        return new Server();
    }

    restRouterConfig: REST_ROUTER_CONFIG [] = [


    ];

    constructor() {

        this.app = this.createApp();
        this.server = http.createServer(this.app);

        this.middleware();
        this.listen();
        this.routes();


         this.test();

        // ====================New Routes Instances=====================
        // const restManager: RestManager = new RestManager(this.app);
        this.restRouterConfig.forEach((restRouter: REST_ROUTER_CONFIG) => {
            const expressRouter = express.Router();
            this.app.use(restRouter.path, expressRouter);
            restRouter.class.listen(expressRouter);
        });
    }

    // ==================        TEST        ====================
    test = () => {
        this.app.use('/' + TMM_API.commRelayMissionRequest, (req,res) => {
            const url = url_CommRelayMissionRep + '/insertNewCommRelayMissionRequest';
            const obj = {
                id: '' + Date.now(),
                version: 0,
                commRelayMissionRequest: req.body,
                lastAction: 'Insert'
            }
            this.send(url, obj, res)
        });

        this.app.use('/' + TMM_API.followPathMissionRequest, (req,res) => {
            const url = url_PatrolMissionRep + '/insertNewFollowPathMissionRequest';
            const obj = {
                id: '' + Date.now(),
                version: 0,
                followPathMissionRequest: req.body,
                lastAction: 'Insert'
            }
            this.send(url, obj, res)
        });

        this.app.use('/' + TMM_API.observationMissionRequest, (req,res) => {
            const url = url_ObservationMissionRep + '/insertNewObservationMissionRequest';
            const obj = {
                id: '' + Date.now(),
                version: 0,
                observationMissionRequest: req.body,
                lastAction: 'Insert'
            }
            this.send(url, obj, res)
        });

        this.app.use('/' + TMM_API.scanMissionRequest, (req,res) => {
            const url = url_ScanMissionRep + '/insertNewScanMissionRequest';
            const obj = {
                id: '' + Date.now(),
                version: 0,
                scanMissionRequest: req.body,
                lastAction: 'Insert'
            }
            this.send(url, obj, res)
        });

        this.app.use('/' + TMM_API.servoingMissionRequest, (req,res) => {
            const url = url_ServoingMissionRep + '/insertNewServoingMissionRequest';
            const obj = {
                id: '' + Date.now(),
                version: 0,
                servoingMissionRequest: req.body,
                lastAction: 'Insert'
            }
            this.send(url, obj, res)
        });
    };

    send = (url, obj, res) => {
        this.sendRestRequest(url, obj)
            .then((data: any) => {
                if (data.hasOwnProperty('id')) {
                    res.send({
                        success: true,
                        entityId: data.id,
                        description: ''
                    })
                }
                else {
                    res.send(data)
                }
            })
            .catch((data) => {
                console.log("err", JSON.stringify(data));
            });
    }

    public sendRestRequest(url: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
        return new Promise((resolve, reject) => {
            (async () => {
                const IP_ = url.split('://');
                if ( IP_.length > 1 ) {
                    // const isOn = await isReachable(IP_[1]);
                    // if (isOn) {
                    const res: ASYNC_RESPONSE = {success: false};
                        request({
                            url: `${url}`,
                            method: 'POST',
                            json: true,
                            body: bodyObj,
                            timeout: 5000,
                        }, (error, response, body) => {
                            if ( error != null || typeof body !== 'object' ) {
                                res.data = error;
                                reject(res);
                                return null;
                            }
                            else {
                                const respBody: ASYNC_RESPONSE = response.body || {};
                                resolve(respBody);
                                return null;
                            }
                        });
                }
                else {
                    const res: ASYNC_RESPONSE = {success: false};
                    // reject({error: `cannot split ip from url ${url}`});
                    reject(res);
                }
            })();

        });
    }

    // ==========================================================
    // ===================         Configure Express middleware.      ====================
    private middleware(): void {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
        // enable cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: '*',
            preflightContinue: false
        };
        this.app.use(cors(options));
        this.app.options('*', cors(options));

    }

    // Configure API endpoints.
    private routes(): void {
        this.app.use('/', express.static(path.join(__dirname, 'public')));

    }

    private createApp() {
        return express();
    }

    public listen(): any {
        this.server.listen(this.port, () => {
            console.log('Running server on port ' + this.port);
        });
    }

}

Server.bootstrap();
