import * as WebSocket from 'ws';
import {ENTITY_DATA, GENERAL_RESPONSE} from '../../classes/all.typings';
import {DbManager} from '../db/dbManager';


const _ = require('lodash');
const projConf = require("./../../../config/projConf.json");
// const schemas = projConf.TelemetryService.schemas;
// const sendTelemetryInterval = projConf.TelemetryService.sendTelemetryInterval;
const telemetryType = projConf.TelemetryService.telemetryType;
const telemetryServerSocketUrl = `ws://${projConf.TelemetryService.TelemetryServer.host}:${projConf.TelemetryService.TelemetryServer.port}`
// const Ajv = require('ajv');


export class SocketManager {
    private static instance: SocketManager = new SocketManager();
    private webSocketServer;
    private webSocketClient;

    // private validateObj = {entity: undefined};
    // private message: ENTITY_DATA;
    private telemetryStr: string;


    private constructor() {
        // this.loadSchemas();
    }
    // ----------------------
    private initSocket = (server) => {
        this.startWebsocketServer(server);
        this.startWebsocketClient();
        // this.startSendData();
    }
    // ----------------------
    // private loadSchemas = () => {
    //     const entitySchema = require(schemas.entity);
    //     const ajv = new Ajv();
    //     this.validateObj.entity = ajv.compile(entitySchema);
    // };

    // ---------------------------------
    private startWebsocketServer(server) {

        this.webSocketServer = new WebSocket.Server({server: server});

        this.webSocketServer.on('connection', (ws: WebSocket) => {
            console.log(Date.now(), 'server | Socket connected',);
            this.errors.push(Date.now() + 'server | Socket connected');

            ws.on('message', (message) => {
            });
            ws.on('error', (err) => {
                console.log('server | socket error', err);
                this.errors.push(Date.now() + 'server | socket error');
            });
            ws.on('close', (err) => {
                console.log('server | socket disconnected', err);
                this.errors.push(Date.now() + 'server | socket disconnected');
            })
        });

        this.webSocketServer.on('error',  (err) => {
            console.log("server | WS error", err);
            this.errors.push(Date.now() + 'server | WS error');
        });
        this.webSocketServer.on('close', (err) => {
            console.log("server | WS closed", err);
            this.errors.push(Date.now() + 'server | WS closed');
            setTimeout(() => {
                this.startWebsocketServer(server);
            }, 1000);
        });
    }

    // ---------------------------
    private startWebsocketClient() {
        this.webSocketClient = new WebSocket(telemetryServerSocketUrl);

        this.webSocketClient.on('open', () => {
            console.log('client | connected');
            this.errors.push(Date.now() + 'client | connected' + telemetryServerSocketUrl);
        });

        this.webSocketClient.on('message', (message) => {
            this.telemetryStr = message;
            this.sendData();
        });

        this.webSocketClient.on('error',  (err) => {
            console.log('client | error', err);
            this.errors.push('client | error' + telemetryServerSocketUrl);
        });

        this.webSocketClient.on('close',  (err) => {
            console.log('client | disconnected', err);
            this.errors.push('client | disconnected' + telemetryServerSocketUrl);
            setTimeout(() => {
                this.startWebsocketClient();
            }, 1000);
        });
    }
    // ---------------------------
    private sendData = () => {
        // setInterval(() => {
            if (this.webSocketServer && this.webSocketServer.clients && this.telemetryStr) {
                this.webSocketServer.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(this.telemetryStr);
                    }
                });
            }
       // }, sendTelemetryInterval)
    }
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
    errors = [];
    getData = () => {
        return {
            str: this.telemetryStr,
            errors: this.errors
        }
    }

    // region API uncions
    public static initSocket = SocketManager.instance.initSocket;
    public static getData = SocketManager.instance.getData;

    // endregion API uncions

}
