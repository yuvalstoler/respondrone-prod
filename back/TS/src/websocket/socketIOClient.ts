import * as io from 'socket.io-client';
import {Logger} from '../logger/Logger';
import { MAP } from "../../../../classes/typings/all.typings";

const servicesConf = require('./../../../../../../../config/services.json');

const gimbalServiceURL = servicesConf.gimbalService.protocol + '://' + servicesConf.gimbalService.host + ':' + servicesConf.gimbalService.port;
const PWS_ServiceURL = servicesConf.PWS.protocol + '://' + servicesConf.PWS.host + ':' + servicesConf.PWS.port;

export class SocketIOClient {
    private static instance: SocketIOClient;

    sockets: { [type: string]: any } = {};

    externalSortConfig: { [type: string]: { [room: string]: Function } } = {};

    constructor() {
    }

    public static getInstance() {
        if ( !SocketIOClient.instance ) {
            SocketIOClient.instance = new SocketIOClient();
        }
        return SocketIOClient.instance;
    }

    public addToSortConfig = (type, callbacksConfig: MAP<Function>) => {
        this.externalSortConfig[type] = {...this.externalSortConfig[type], ...callbacksConfig};
        if ( this.sockets[type] ) {
            this.ListenExternalSortConfig(type);
        }
    };

    private ListenExternalSortConfig = (type) => {
        for (const room in this.externalSortConfig[type]) {
            if ( this.externalSortConfig[type].hasOwnProperty(room) ) {
                this.listen(this.sockets[type], room, this.externalSortConfig[type][room]);
            }
        }
    };

    private listen(socket, room, callbackFunction: Function) {
        socket.on(room, (data: any) => {
            try {
                callbackFunction(data);
            }
            catch (e) {
                console.log('SocketIOClient: listen -> socket.on(room: ' + room + '): ' + e);
            }
        });
    }

    public emit = (type, room: string, data) => {
        this.sockets[type].emit(room, data);
    };


}
