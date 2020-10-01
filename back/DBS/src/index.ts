import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {SocketIo} from './websocket/socket.io';

import {Logger} from './logger/Logger';
// import {RestManager} from './applicationServices/restConnections/restManager';
import {ApiManager} from './services/api/ApiManager';
import {
    DBS_API
} from '../../../classes/dataClasses/api/api_enums';
import {REST_ROUTER_CONFIG} from '../../../classes/typings/all.typings';
const services = require('./../../../../../../config/services.json');


class Server {

    private port = services.DBS.port;
    private socketIO: SocketIo;
    private app: any;

    public static bootstrap(): Server {
        return new Server();
    }

    restRouterConfig: REST_ROUTER_CONFIG [] = [
        {class: ApiManager, path: '/' + DBS_API.general},
    ];

    constructor() {
        this.app = express();

        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        const server = this.createServer(this.app);
        this.socketIO = new SocketIo(server);
        this.listen(server);

        this.runListenFunctions(this.app);
    }

    private runListenFunctions = (app) => {
        // const restManager: RestManager = new RestManager(app);
        // ApiManager.listen(restManager.routers[AMS_API.general]);

        this.restRouterConfig.forEach((restRouter: REST_ROUTER_CONFIG) => {
            const expressRouter = express.Router();
            this.app.use(restRouter.path, expressRouter);
            restRouter.class.listen(expressRouter);
        });
    };

    private createServer = (app) => {
        return http.createServer(app);
    };

    private listen = (server): any => {
        server.listen(this.port, () => {
            Logger.json('startService', {
                message: 'Running airVehicle service  on port: ' + this.port
            });
            console.log('Running server on port ', this.port);
        });
    }

    // ===================================================================================

}

Server.bootstrap();
