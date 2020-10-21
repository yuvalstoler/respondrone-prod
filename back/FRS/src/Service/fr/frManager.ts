import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {DBS_API, SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    FR_TYPE,
    SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY
} from '../../../../../classes/typings/all.typings';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';
import {SocketIOClient} from "../../websocket/socketIOClient";
import {SocketIO} from "../../websocket/socket.io";


export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: FR[] = [];

    private constructor() {
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.CCG, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = Converting.Arr_FR_DATA_to_Arr_FR(data.FRs);

        // TODO send to repository
        SocketIO.emit(SOCKET_ROOM.FRs_Tel_room, data);
    };



    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions
    public static startGetSocket = FrManager.instance.startGetSocket;


    // endregion API uncions

}
