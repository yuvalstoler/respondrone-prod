//import * as io from 'socket.io-client';
//import {Logger} from '../logger/Logger';

/*const projConf = require('./../../../../../../../projConf.json');

const url = projConf.DMS_Interface.protocol + '://' +
    projConf.DMS_Interface.host + ':' +
    projConf.DMS_Interface.port;*/

import { MAP } from "../../../../classes/typings/all.typings";

export class WebSocketDMSClient {
    private static instance: WebSocketDMSClient = new WebSocketDMSClient();


    socket: any = {};
    // callbacksConfig: { [key: string]: Function } = {};
    //     Sensors: 'message',
    //     Targets: 'connect',
    //     Missions: 'disconnect',
    // };


    connectStatus: boolean = false;

    private constructor() {
        //   this.socket = io(url, {autoConnect: true});
        // this.callbacksConfig = callbacksConfig;

        // Logger.logKeys('DMS Sockets', this.callbacksConfig);
        // for (let room in this.callbacksConfig) {
        //     this.listen(this.socket, room);
        // }

    }


    public addToSortConfig = (callbacksConfig: MAP<Function>) => {
        /*  // this.callbacksConfig = callbacksConfig;
          Logger.logKeys('DMS Sockets', callbacksConfig);
          for (const room in callbacksConfig) {
              if ( callbacksConfig.hasOwnProperty(room) ) {
                  this.listen(this.socket, room, callbacksConfig[room]);
              }
          }*/
    };

    /*private listen(socket, room, callbackFunction: Function) {
        socket.on(room, (data: any) => {
            try {
                callbackFunction(data);
            }
            catch (e) {
                console.log(e);
            }
        });

        socket.on('disconnect', () => {
            this.connectStatus = false;
        });
        socket.on('connect', () => {
            this.connectStatus = true;
        });
    }*/

    // public emit(room, data) {
    //     if (this.config.hasOwnProperty(room)) {
    //         try {
    //             this.socket.emit(room, data);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    // };


    // region API functions

    public static addToSortConfig = WebSocketDMSClient.instance.addToSortConfig;

    //    endregion

}
