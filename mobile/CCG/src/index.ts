import * as express from 'express';

const _express = require('express');
import * as http from 'http';
import * as path from 'path';
import * as cors from 'cors';

import * as bodyParser from 'body-parser';

import {SocketIO} from './websocket/socket.io';



const services = require('./../../../../../../config/services.json');


import {Logger} from './logger/Logger';
import {ApiManager} from './Service/api/ApiManager';
import {CCG_API} from '../../../classes/dataClasses/api/api_enums';
import { REST_ROUTER_CONFIG } from '../../../classes/typings/all.typings';



export class Server {

    private port = services.CCG.port;
    public app: any;
    private server: any;
    private alertService: any;


    public static bootstrap(): Server {
        return new Server();
    }

    restRouterConfig: REST_ROUTER_CONFIG [] = [

        {class: ApiManager, path: '/' + CCG_API.general},

    ];

    constructor() {

        this.app = this.createApp();
        this.server = http.createServer(this.app);

        this.middleware();
        this.listen();

        const socketIO_Server: SocketIO = new SocketIO(this.server);




        // start websocket 'algorithmManager.sendMissionStatus' - function that call on connect to WS
        const functionsToCallOnConnect = []; // [AlgorithmManager.sendMissionStatus];
        socketIO_Server.startConnectToWS(functionsToCallOnConnect);
        this.routes(socketIO_Server);


         this.test();


        // ====================New Routes Instances=====================
        // const restManager: RestManager = new RestManager(this.app);
        this.restRouterConfig.forEach((restRouter: REST_ROUTER_CONFIG) => {
            const expressRouter = express.Router();
            this.app.use(restRouter.path, expressRouter);
            restRouter.class.listen(expressRouter);
        });


        // AlgorithmManager.listen(restManager.routers['/missionAction']);
        // AltitudeSlotManager.listen(restManager.routers['/altitudeSlot']);
        // AirVehicleManagerWS.listen(restManager.routers['/droneServiceWS']);
        // GwMessagesService.listen(restManager.routers['/gwMessage']);
        // MessagesManager.listen(restManager.routers['/message']);
        // RoutesManager.listen(restManager.routers['/routes']);
        //
        // SiteManager.listen(restManager.routers['/site']);
        //
        // GimbalManagerWS.listen(restManager.routers['/gimbal']);
        // VideoManagerWS.listen(restManager.routers['/video']);
        // PwsConnectionManager.listen(restManager.routers['/pws']);
        // LockAirVehicleManager.listen(restManager.routers['/lockAirVehicle']);


        //only for get pint of corridor if need use it

    }

    // ==================        TEST        ====================
    test = () => {
        // ToasterService.test();
        // MissionPatternUtility.visintPattern('192.168.1.80', {latitude:32, longitude:34}, (data)=>{
        //     const x = data;
        // })
    };
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
    private routes(socketIO: SocketIO): void {
        this.app.use('/', express.static(path.join(__dirname, 'public')));

    }

    private createApp() {
        return express();
    }

    public listen(): any {
        this.server.listen(this.port, () => {
            Logger.info('-', 'Running web server on port ' + this.port);
            console.log('Running server on port ' + this.port);
        });
    }

}

Server.bootstrap();
