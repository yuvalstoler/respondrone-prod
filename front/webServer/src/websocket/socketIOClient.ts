import * as io from 'socket.io-client';
import {Logger} from '../logger/Logger';
import {MAP, SOCKET_IO_CLIENT_TYPES} from '../../../../classes/typings/all.typings';

const servicesConf = require('./../../../../../../../config/services.json');

const FRSServiceURL = servicesConf.FRS.protocol + '://' + servicesConf.FRS.host + ':' + servicesConf.FRS.port;
const MServiceURL = servicesConf.MS.protocol + '://' + servicesConf.MS.host + ':' + servicesConf.MS.port;
const GServiceURL = servicesConf.GS.protocol + '://' + servicesConf.GS.host + ':' + servicesConf.GS.port;
const VideoServerURL = servicesConf.Blobs.protocol + '://' + servicesConf.Blobs.host + ':' + servicesConf.Blobs.port;

export class SocketIOClient {
    private static instance: SocketIOClient = new SocketIOClient();

    sockets: { [type: string]: any } = {};

    //first key - type (SOCKET_IO_CLIENT_TYPES); second key - webSocket room
    externalSortConfig: MAP<MAP<Function>> = {};

    private constructor() {
        this.sockets[SOCKET_IO_CLIENT_TYPES.FRS] = io(FRSServiceURL, {autoConnect: true});
        this.sockets[SOCKET_IO_CLIENT_TYPES.MS] = io(MServiceURL, {autoConnect: true});
        this.sockets[SOCKET_IO_CLIENT_TYPES.GS] = io(GServiceURL, {autoConnect: true});
        this.sockets[SOCKET_IO_CLIENT_TYPES.VideoServer] = io(VideoServerURL, {autoConnect: true});
        this.sockets[SOCKET_IO_CLIENT_TYPES.VideoServer].on('connect', () => {
            console.log('video socket connected');
        });

        this.sockets[SOCKET_IO_CLIENT_TYPES.MS].on('connect', () => {
            console.log('ms connected');
        });
    }

    // public static getInstance() {
    //     if ( !SocketIOClient.instance ) {
    //         SocketIOClient.instance = new SocketIOClient();
    //     }
    //     return SocketIOClient.instance;
    // }

    private addToSortConfig = (type, callbacksConfig: MAP<Function>) => {
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

    private emit = (type, room: string, data) => {
        this.sockets[type].emit(room, data);
    };

    public static addToSortConfig = SocketIOClient.instance.addToSortConfig;
    public static emit = SocketIOClient.instance.emit;


}
