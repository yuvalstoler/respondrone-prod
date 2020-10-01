import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import {ApiManager} from './services/api/ApiManager';
import {REST_ROUTER_CONFIG} from './classes/all.typings';
import {SocketManager} from './services/socket/SocketManager';


const projConf = require('./../config/projConf.json');

class Server {

    private port = projConf.TelemetryService.port;
    private app: any;

    public static bootstrap(): Server {
        return new Server();
    }

    restRouterConfig: REST_ROUTER_CONFIG [] = [
        {class: ApiManager, path: '/'},
    ];

    constructor() {
        this.app = express();

        const server = this.createServer(this.app);
        this.middleware();
        this.listen(server);
        SocketManager.initSocket(server);

        this.runListenFunctions(this.app);
    }

    private runListenFunctions = (app) => {
        this.restRouterConfig.forEach((restRouter: REST_ROUTER_CONFIG) => {
            const expressRouter = express.Router();
            this.app.use(restRouter.path, expressRouter);
            restRouter.class.listen(expressRouter);
        });
    };

    private createServer = (app) => {
        return http.createServer(app);
    };

    private middleware = (): void => {
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

    private listen = (server): any => {
        server.listen(this.port, () => {
            console.log('Running server on port ', this.port);
        });
    }

    // ===================================================================================

}

Server.bootstrap();
