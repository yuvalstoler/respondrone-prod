import * as socketIo from 'socket.io';
import { MAP } from "../../../../classes/typings/all.typings";


export class SocketIO {

    private static instance: SocketIO = new SocketIO();

    webSocket: any;


    connectStatus: boolean = false;

    isSendedRestart = false;

    socket;
    externalSortConfig: { [room: string]: Function } = {};

    // callbacksConfig = {};

    config = {
        proxy_ui_droneData: 'proxy_ui_droneData',
        proxy_ui_observationPoints: 'proxy_ui_observationPoints',
        fcsMessage: 'fcsMessage'/*,
        SystemTelemetry: 'SystemTelemetry'*/
    };

    constructor() {

    }

    private initSocketServer = (server, sendsOnConnect: Function[]) => {
        this.webSocket = socketIo.listen(server);
        this.connectToWebsocket(sendsOnConnect);
    }


    private connectToWebsocket = (sendsOnConnect: Function[]) => {
        this.webSocket.on('connect', (socket: any) => {
            // this.onConnect(socket, sendsOnConnect);
            console.log('server | socket connected');
            this.socket = socket;
            if ( sendsOnConnect ) {
                sendsOnConnect.forEach((sendOnConnect) => {
                    try {
                        sendOnConnect();
                    }
                    catch (e) {
                        console.log('connect to websocket can not call function sendOnConnect(): ' + e);
                    }
                });

                if ( !this.isSendedRestart ) {
                    this.onceSendToUI();
                }
            }
            // if ( rooms && Array.isArray(rooms) ) {
            //     Logger.logValues('webServer Sockets', rooms);
            //     rooms.forEach((room) => {
            //         this.listen(socket, room, this.callbacksConfig[room]);
            //     });
            // }
            this.ListenExternalSortConfig();
            this.checkExernalConnectFunction();

        });
    };

    private ListenExternalSortConfig = () => {
        for (const room in this.externalSortConfig) {
            if ( this.externalSortConfig.hasOwnProperty(room) ) {
                this.listen(this.socket, room, this.externalSortConfig[room]);
            }
        }
    };
    private checkExernalConnectFunction = () => {
        if ( this.externalSortConfig.hasOwnProperty('connect') ) {
            try {
                this.externalSortConfig['connect']();
            }
            catch (e) {
            }
        }
    };
    public addToSortConfig = (callbacksConfig: MAP<Function>) => {
        this.externalSortConfig = {...this.externalSortConfig, ...callbacksConfig};
        if ( this.socket ) {
            this.ListenExternalSortConfig();
        }
    };

    private listen(socket, room, callbackFunction: Function) {
        socket.on(room, (data: any) => {
            try {
                callbackFunction(data);
            }
            catch (e) {
                console.log('SocketIOSocketIO: listen -> socket.on(room: ' + room + '): ' + e);
            }
        });

    }



    public emit = (room: string, data) => {
        if (this.webSocket) {
            this.webSocket.emit(room, data);
        }
    };

    private onceSendToUI() {
        this.isSendedRestart = true;
        this.emit('proxy_ui_restartUI', {command: 'restart'});
    }

    public static initSocketServer = SocketIO.instance.initSocketServer;
    public static addToSortConfig = SocketIO.instance.addToSortConfig;
    public static emit = SocketIO.instance.emit;

}
