import * as io from 'socket.io-client';
const servicesConf = require('./../../../../../../../config/services.json');


const url = servicesConf.logServer.protocol + '://' +
    servicesConf.logServer.host + ':' +
    servicesConf.logServer.port;
const socket: any = io(url, {autoConnect: true});

export class WebSocketLoggerClient {

    public static emit(data) {
        socket.emit(servicesConf.logServer.room, data);
    };

}
