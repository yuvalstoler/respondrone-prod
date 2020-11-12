import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {
    AV_DATA_TELEMETRY_REP,
    AV_DATA_UI,
    AV_OPTIONS,
    CAPABILITY,
    ID_TYPE, MISSION_TYPE,
    OPERATIONAL_STATUS,
    SOCKET_IO_CLIENT_TYPES
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {SOCKET_ROOM} from "../../../../../classes/dataClasses/api/api_enums";
import {SocketIOClient} from "../../websocket/socketIOClient";
import {AirVehicle} from "../../../../../classes/dataClasses/airVehicle/airVehicle";
import {AirVehicleMdLogic} from "../../../../../classes/modeDefineTSSchemas/airVehicles/airVehicleMdLogic";

const _ = require('lodash');


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
            avDataUI.missionOptions = av.missionOptions = this.getMissionOptions(avDataUI);

            res.push(avDataUI);
        });
        return res;
    };

    private getMissionOptions = (data: AV_DATA_UI): AV_OPTIONS => {
        const res: AV_OPTIONS = {};
        if (data.operationalStatus === OPERATIONAL_STATUS.Ready) {
            data.capability.forEach((item: CAPABILITY) => {
                switch (item) {
                    case CAPABILITY.Surveillance:
                    case CAPABILITY.Patrol:
                    case CAPABILITY.Scan:
                        res[MISSION_TYPE.Patrol] = true;
                        res[MISSION_TYPE.Observation] = true;
                        res[MISSION_TYPE.Scan] = true;
                        res[MISSION_TYPE.Servoing] = true;
                        break;
                    case CAPABILITY.CommRelay:
                        res[MISSION_TYPE.CommRelay] = true;
                        break;
                    case CAPABILITY.Delivery:
                        res[MISSION_TYPE.Delivery] = true;
                        break;
                }
            });
        }
        return res;
    }

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
