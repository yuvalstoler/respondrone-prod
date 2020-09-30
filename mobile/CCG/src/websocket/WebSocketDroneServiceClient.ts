import * as io from 'socket.io-client';
import {Logger} from '../logger/Logger';

import * as core from 'express-serve-static-core';
import { MAP } from '../../../../classes/typings/all.typings';


const services = require('./../../../../../../../config/services.json');

const url = services.droneService.protocol + '://' +
            services.droneService.host + ':' +
            services.droneService.port;
const rooms = services.droneService.websocketRooms;
export class WebSocketDroneServiceClient {
    private static instance: WebSocketDroneServiceClient;

    socket: any = {};
    sendConfig: Object = {
        message: 'message',
        connect: 'connect',
        disconnect: 'disconnect',
    };
    connectStatus: boolean = false;

    callbacksConfig = {
        ws_droneService_velocity: '',
        ws_droneService_camera: '',
        ws_droneService_setPosition: '',
    };

    // 'websocketRooms': [
    //     'droneService_ws',
    //     'ws_droneService_velocity',
    //     'ws_droneService_camera',
    //     'ws_droneService_setPosition'
    //     ],
    // 'websocketRoomsObj': {
    //     'droneService_ws': 'droneService_ws',
    //     'ws_droneService_velocity': 'ws_droneService_velocity',
    //     'ws_droneService_camera': ' ws_droneService_camera',
    //     'ws_droneService_setPosition': 'ws_droneService_setPosition'
    // },


    private constructor() {
        this.socket = io(url, {autoConnect: true});

        if ( rooms && Array.isArray(rooms) ) {
            Logger.logValues('airVehicleService Sockets', rooms);
            rooms.forEach((room) => {
                this.listen(this.socket, room, this.callbacksConfig[room]);
            });
        }

    }

    public static getInstance() {
        if ( !WebSocketDroneServiceClient.instance ) {
            WebSocketDroneServiceClient.instance = new WebSocketDroneServiceClient();
        }
        return WebSocketDroneServiceClient.instance;
    }
    


    public addToSortConfig = (callbacksConfig: MAP<Function>) => {
        // this.callbacksConfig = callbacksConfig;
        // Logger.logKeys('DMS Sockets', callbacksConfig);
        for (const room in callbacksConfig) {
            if ( callbacksConfig.hasOwnProperty(room) ) {
                this.listen(this.socket, room, callbacksConfig[room]);
            }
        }
    };

    private listen(socket, room, callbackFunction: Function) {
        socket.on(room, (data: any) => {
            try {
                callbackFunction(data);
            }
            catch (e) {
                console.log('WebSocketDroneServiceClient: listen -> socket.on(room: ' + room + '): ' + e);

            }
        });

        socket.on('disconnect', () => {
            this.connectStatus = false;
        });
        socket.on('connect', () => {
            this.connectStatus = true;
        });
    }

    public emit(room, data) {
        if ( this.sendConfig.hasOwnProperty(room) ) {
            try {
                this.socket.emit(room, data);
            }
            catch (e) {
                console.log('WebSocketDroneServiceClient: emit(room: ' + room + '): ' + e);

            }
        }
    }

}
