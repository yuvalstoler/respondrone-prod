import * as socketIo from 'socket.io';
import {Logger} from '../logger/Logger';

const _ = require('lodash');
const projConf = require('./../../../../../../../projConf.json');

// const rooms = _.get(projConf, 'gimbalService.websocketRooms', false);

export class SocketIo {
    webSocket: any;


    config = {
    };


    constructor(server) {

        this.webSocket = socketIo.listen(server);
        // this.webSocket.on('connect', (socket: any) => {
        //     if (rooms && Array.isArray(rooms)) {
        //         rooms.forEach((room) => {
        //             this.listen(socket, room);
        //         });
        //     }
        // });

        // Logger.logWSRooms('WebSocket Rooms:', rooms);
    };

    private listen(socket, room) {
        if (this.config.hasOwnProperty(room)) {
            try {
                socket.on(room, (data: any) => {
                    this.config[room](data);
                });
            } catch (e) {
                console.log(e)
            }
        }
    }

    public emit = (room: string, data) => {
        this.webSocket.emit(room, data);
    };
}
