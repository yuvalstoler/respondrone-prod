import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';

import {ApiManager} from './services/api/ApiManager';
import {REST_ROUTER_CONFIG} from './classes/all.typings';


const projConf = require('./../config/projConf.json');

class Server {

    private port = projConf.EntityService.port;
    private app: any;

    public static bootstrap(): Server {
        return new Server();
    }

    restRouterConfig: REST_ROUTER_CONFIG [] = [
        {class: ApiManager, path: '/'},
    ];

    constructor() {
        this.app = express();

        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        const server = this.createServer(this.app);
        this.listen(server);

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

    private listen = (server): any => {
        server.listen(this.port, () => {
            console.log('Running server on port ', this.port);
        });
    }

    // ===================================================================================

}

Server.bootstrap();
