import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, FR_DATA_UI, SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY, ID_TYPE, MISSION_REQUEST_DATA, MAP
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {FrMdLogic} from '../../../../../classes/modeDefineTSSchemas/frs/frMdLogic';
import {SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {MissionRequestManager} from '../missionRequest/missionRequestManager';


export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: MAP<FR> = {};

    private constructor() {

    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.FRS, this.frsSocketConfig);
    };

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = {};
        data.FRs.forEach((item: FR_DATA) => {
            this.frs[item.id] = new FR(item);
        });

        this.sendDataToUI();
    };

    private getFRsByIds = (ids: ID_TYPE[]): FR_DATA_UI[] => {
        const res: FR_DATA_UI[] = [];
        for (const frId in this.frs) {
            if (this.frs[frId]) {
                if (ids.indexOf(frId) !== -1) {
                    const data = this.frs[frId].toJsonForUI();
                    res.push(data);
                }
            }
        }

        return res;
    };

    private getFRById = (id: ID_TYPE): FR => {
        return this.frs[id];
    };


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    private getDataForUI = (): FR_DATA_UI[] => {
        const res: FR_DATA_UI[] = [];
        for (const frId in this.frs) {
            if (this.frs[frId]) {
                const userDataUI: FR_DATA_UI = this.frs[frId].toJsonForUI();
                const missionsFollowingFR: MISSION_REQUEST_DATA[] = MissionRequestManager.getMissionsFollowingFR(frId);
                userDataUI.modeDefine = this.frs[frId].modeDefine = FrMdLogic.validate(userDataUI, missionsFollowingFR);
                res.push(userDataUI);
            }
        }

        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: FR_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_frsData', jsonForSend);
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;
    public static getFRsByIds = FrManager.instance.getFRsByIds;
    public static getFRById = FrManager.instance.getFRById;




    // endregion API uncions

}
