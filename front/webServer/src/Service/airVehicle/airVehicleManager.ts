import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA, FR_DATA_UI, SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY, ID_TYPE, AV_DATA_TELEMETRY_REP, AV_DATA_UI
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {ReportManager} from '../report/reportManager';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {FrMdLogic} from "../../../../../classes/modeDefineTSSchemas/frs/frMdLogic";
import {SOCKET_ROOM} from "../../../../../classes/dataClasses/api/api_enums";
import {SocketIOClient} from "../../websocket/socketIOClient";
import {AirVehicle} from "../../../../../classes/dataClasses/airVehicle/airVehicle";
import {AirVehicleMdLogic} from "../../../../../classes/modeDefineTSSchemas/airVehicles/airVehicleMdLogic";


export class AirVehicleManager {


    private static instance: AirVehicleManager = new AirVehicleManager();


    airVehicles: AirVehicle[] = [];

    private constructor() {

    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.MS, this.avsSocketConfig);
    }

    private onGetAVs = (data: AV_DATA_TELEMETRY_REP) => {
        this.airVehicles = Converting.Arr_AV_DATA_to_Arr_AV(data.drones);

        this.sendDataToUI()
    };

    private getAVsByIds = (ids: ID_TYPE[]): AV_DATA_UI[] => {
        const res: AV_DATA_UI[] = [];
        this.airVehicles.forEach((av: AirVehicle) => {
            if (ids.indexOf(av.id) !== -1) {
                const data = av.toJsonForUI();
                res.push(data);
            }
        });
        return res;
    }

    private getDataForUI = (): AV_DATA_UI[] => {
        const res: AV_DATA_UI[] = [];
        this.airVehicles.forEach((av: AirVehicle) => {
            const avDataUI: AV_DATA_UI = av.toJsonForUI();
            avDataUI.modeDefine = av.modeDefine = AirVehicleMdLogic.validate(avDataUI);

            res.push(avDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: AV_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_airVehiclesData', jsonForSend);
    };



    private avsSocketConfig: {} = {
        [SOCKET_ROOM.AVs_Tel_room]: this.onGetAVs,
    };


    // region API uncions

    public static startGetSocket = AirVehicleManager.instance.startGetSocket;
    public static getFRsByIds = AirVehicleManager.instance.getAVsByIds;




    // endregion API uncions

}
