import {SocketIOClient} from "../../websocket/socketIOClient";
import {SocketIO} from "../../websocket/socket.io";

import {SOCKET_ROOM,} from '../../../../../classes/dataClasses/api/api_enums';

import {FR_DATA_TELEMETRY, FR_STATUS, FR_TYPE, SOCKET_IO_CLIENT_TYPES} from '../../../../../classes/typings/all.typings';

const _ = require('lodash');


export class FrManager {


    private static instance: FrManager = new FrManager();


    // reports: Report[] = [];

    private constructor() {
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.MG, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        SocketIO.emit(SOCKET_ROOM.FRs_Tel_room, data);
    };



    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;
    // endregion API uncions

}
