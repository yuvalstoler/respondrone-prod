import * as io from 'socket.io-client';
import {Logger} from '../logger/Logger';
import {MAP, SOCKET_CLIENT_TYPES, SOCKET_IO_CLIENT_TYPES} from '../../../../classes/typings/all.typings';
import * as WebSocket from 'ws';

const servicesConf = require('./../../../../../../../config/services.json');

const DroneTelemetrySenderRepURL = servicesConf.DroneTelemetrySenderRep.protocol + '://' + servicesConf.DroneTelemetrySenderRep.host + ':' + servicesConf.DroneTelemetrySenderRep.port;
const FRTelemetryReceiverRepURL = servicesConf.FRTelemetryReceiverRep.protocol + '://' + servicesConf.FRTelemetryReceiverRep.host + ':' + servicesConf.FRTelemetryReceiverRep.port;
const GimbalTelemetrySenderRepURL = servicesConf.GimbalTelemetrySenderRep.protocol + '://' + servicesConf.GimbalTelemetrySenderRep.host + ':' + servicesConf.GimbalTelemetrySenderRep.port;

export class SocketClient {
    private static instance: SocketClient = new SocketClient();

    sockets: { [type: string]: any } = {};

    externalSortConfig: { [type: string]: Function } = {};

    constructor() {
        this.initSocket(SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep, GimbalTelemetrySenderRepURL);
    }

    private initSocket = (type: SOCKET_CLIENT_TYPES, url: string) => {
        this.sockets[type] = new WebSocket(url);
        this.sockets[type].on('open', () => {
            console.log('client | connect', type);
        });
        this.sockets[type].on('error',  (err) => {
            console.log('client | error', type);
        });
        this.sockets[type].on('close',  (err) => {
            setTimeout(() => {
                this.initSocket(type, url);
            }, 5000);
        });
    }

    public addToSortConfig = (type, callbacksConfig: MAP<Function>) => {
        this.externalSortConfig[type] = {...this.externalSortConfig[type], ...callbacksConfig};
        if ( this.sockets[type] ) {
            this.ListenExternalSortConfig(type);
        }
    };

    private ListenExternalSortConfig = (type) => {
        this.listen(this.sockets[type], this.externalSortConfig[type], type);
    };

    private listen(socket, callbackFunction: Function, type: SOCKET_CLIENT_TYPES) {
        socket.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                callbackFunction[type](data);
            }
            catch (e) {
                console.log(type, 'error parsing', message);
            }

        });
    }

    public emit = (type, data) => {
        if (this.sockets[type]) {
            try {
                this.sockets[type].send(JSON.stringify(data));
            } catch (e) {}
        }
    };

    public static addToSortConfig = SocketClient.instance.addToSortConfig;
    public static emit = SocketClient.instance.emit;


}
