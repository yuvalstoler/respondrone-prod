import * as WebSocket from 'ws';
import {ENTITY_DATA, GENERAL_RESPONSE} from '../../classes/all.typings';
import {DbManager} from '../db/dbManager';


const _ = require('lodash');
const projConf = require("./../../../config/projConf.json");
const schemas = projConf.TelemetryService.schemas;
const sendTelemetryInterval = projConf.TelemetryService.sendTelemetryInterval;
const telemetryType = projConf.TelemetryService.telemetryType;

const Ajv = require('ajv');


export class SocketManager {
    private static instance: SocketManager = new SocketManager();
    private webSocketServer;

    private validateObj = {entity: undefined};
    private message: ENTITY_DATA;
    private telemetryStr: string;


    private constructor() {
        this.loadSchemas();
    }
    // ----------------------
    private initSocket = (server) => {
        this.startWebsocketServer(server);
        this.startSendData();
    }
    // ----------------------
    private loadSchemas = () => {
        const entitySchema = require(schemas.entity);
        const ajv = new Ajv();
        this.validateObj.entity = ajv.compile(entitySchema);
    };

    // ---------------------------------
    private startWebsocketServer(server) {

        this.webSocketServer = new WebSocket.Server({server: server});

        this.webSocketServer.on('connection', (ws: WebSocket) => {
            console.log(Date.now(), ' Socket connected',);

            ws.on('message', (message) => {
                try {
                    message = JSON.parse(message);
                    this.message = message;
                } catch (e) {
                }
            });
            ws.on('error', (err) => {
                console.log('socket error', err);
            });
            ws.on('close', (err) => {
                console.log('socket disconnected', err);
            })
        });

        this.webSocketServer.on('error',  (err) => {
            console.log("WS error", err)
        });
        this.webSocketServer.on('close', (err) => {
            console.log("WS closed", err);
            setTimeout(() => {
                this.startWebsocketServer(server);
            }, 1000);
        });
    }

    private i = 0;
    // ---------------------------
    private startSendData = () => {
        setInterval(() => {
            if (this.webSocketServer && this.webSocketServer.clients && this.message) {
                this.webSocketServer.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        try {
                            const valid = this.validateObj.entity(this.message);
                            if (valid) {
                                this.telemetryStr = JSON.stringify(this.message);
                            } else {
                                const errors = this.validateObj.entity.errors;
                                const res: GENERAL_RESPONSE = {
                                    success: false,
                                    description: errors[0] ? `${errors[0].dataPath} ${errors[0].message} ${JSON.stringify(errors[0].params)}` : 'validation failed',
                                };
                                this.errors.push(res);
                                this.saveToLog(telemetryType, this.message, res);
                            }
                        }
                        catch (e) {
                            const res: GENERAL_RESPONSE = {
                                success: false,
                                description: 'validation error ' + JSON.stringify(e),
                            };
                            this.errors.push(res);
                            this.saveToLog(telemetryType, this.message, res);
                        }

                        if (this.telemetryStr) {
                            client.send(this.telemetryStr);
                        }
                    }
                });
            }
        }, sendTelemetryInterval)
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
    errors = []
    getData = () => {
        return {
            message: this.message,
            str: this.telemetryStr,
            errors: this.errors
        }
    }

    // region API uncions
    public static initSocket = SocketManager.instance.initSocket;
    public static getData = SocketManager.instance.getData;

    // endregion API uncions

}
