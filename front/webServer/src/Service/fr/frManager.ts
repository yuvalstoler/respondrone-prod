import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, FR_DATA_UI, SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {FrMdLogic} from "../../../../../classes/modeDefineTSSchemas/frs/frMdLogic";
import {SOCKET_ROOM} from "../../../../../classes/dataClasses/api/api_enums";
import {SocketIOClient} from "../../websocket/socketIOClient";


export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: FR[] = [];

    private constructor() {

    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.FRS, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = Converting.Arr_FR_DATA_to_Arr_FR(data.FRs);

        this.sendDataToUI()
    };



    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    private getDataForUI = (): FR_DATA_UI[] => {
        const res: FR_DATA_UI[] = [];
        this.frs.forEach((user: FR) => {
            const userDataUI: FR_DATA_UI = user.toJsonForUI();
            userDataUI.modeDefine = FrMdLogic.validate(userDataUI);

            res.push(userDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: FR_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_usersData', jsonForSend);
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;




    // endregion API uncions

}