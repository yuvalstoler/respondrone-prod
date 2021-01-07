import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    FR_DATA_UI,
    SOCKET_IO_CLIENT_TYPES,
    FR_DATA_TELEMETRY,
    ID_TYPE,
    MISSION_REQUEST_DATA,
    MAP,
    FR_TYPE,
    FR_STATUS
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';
import {SocketIOClient} from '../../websocket/socketIOClient';



export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: MAP<FR> = {};

    private constructor() {
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.FRS, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = {};
        data.FRs.forEach((item: FR_DATA) => {
           this.frs[item.id] = new FR(item);
        });
    };

    private getFRById = (id: ID_TYPE): FR => {
        return this.frs[id];
    }

    private getFRNameById = (id: ID_TYPE): string => {
        return this.frs[id] ? this.frs[id].callSign : id;
    }


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;
    public static getFRById = FrManager.instance.getFRById;
    public static getFRNameById = FrManager.instance.getFRNameById;




    // endregion API uncions

}
