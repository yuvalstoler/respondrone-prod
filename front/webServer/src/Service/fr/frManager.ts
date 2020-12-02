import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, FR_DATA_UI, SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY, ID_TYPE, MISSION_REQUEST_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {FrMdLogic} from "../../../../../classes/modeDefineTSSchemas/frs/frMdLogic";
import {SOCKET_ROOM} from "../../../../../classes/dataClasses/api/api_enums";
import {SocketIOClient} from "../../websocket/socketIOClient";
import {MissionRequestManager} from "../missionRequest/missionRequestManager";


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

    private getFRsByIds = (ids: ID_TYPE[]): FR_DATA_UI[] => {
        const res: FR_DATA_UI[] = [];
        this.frs.forEach((fr: FR) => {
            if (ids.indexOf(fr.id) !== -1) {
                const data = fr.toJsonForUI();
                res.push(data);
            }
        });
        return res;
    }


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    private getDataForUI = (): FR_DATA_UI[] => {
        const res: FR_DATA_UI[] = [];
        this.frs.forEach((user: FR) => {
            const userDataUI: FR_DATA_UI = user.toJsonForUI();
           // const missionsFollowingFR: MISSION_REQUEST_DATA[] = MissionRequestManager.getMissionsFollowingFR(user.id);
            userDataUI.modeDefine = FrMdLogic.validate(userDataUI, []);

            res.push(userDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: FR_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_frsData', jsonForSend);
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;
    public static getFRsByIds = FrManager.instance.getFRsByIds;




    // endregion API uncions

}
