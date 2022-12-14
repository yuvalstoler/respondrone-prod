import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {
    AV_DATA_REP,
    AV_DATA_TELEMETRY_REP,
    AV_DATA_UI,
    AV_OPTIONS,
    CAPABILITY,
    ID_TYPE, MAP, MISSION_TYPE, MISSION_TYPE_TEXT,
    OPERATIONAL_STATUS,
    SOCKET_IO_CLIENT_TYPES
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {AirVehicle} from '../../../../../classes/dataClasses/airVehicle/airVehicle';
import {AirVehicleMdLogic} from '../../../../../classes/modeDefineTSSchemas/airVehicles/airVehicleMdLogic';
import {MissionRequestManager} from '../missionRequest/missionRequestManager';
import {MissionRouteManager} from '../missionRoute/missionRouteManager';
import {GimbalManager} from '../gimbal/gimbalManager';

const _ = require('lodash');


export class AirVehicleManager {


    private static instance: AirVehicleManager = new AirVehicleManager();


    airVehicles: MAP<AirVehicle> = {};

    private constructor() {

    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.MS, this.avsSocketConfig);
    };

    private onGetAVs = (data: AV_DATA_TELEMETRY_REP) => {
        // this.airVehicles = Converting.Arr_AV_DATA_to_Arr_AV(data.drones);
        this.airVehicles = {};
        data.drones.forEach((item: AV_DATA_REP) => {
            this.airVehicles[item.id] = new AirVehicle(item);
        });

        this.sendDataToUI();
    };

    private getAVsByIds = (ids: ID_TYPE[]): AV_DATA_UI[] => {
        const res: AV_DATA_UI[] = [];
        for (const avId in this.airVehicles) {
            if (this.airVehicles[avId]) {
                if (ids.indexOf(avId) !== -1) {
                    const data = this.airVehicles[avId].toJsonForUI();
                    res.push(data);
                }
            }
        }
        return res;
    };

    private getAVById = (id: ID_TYPE): AirVehicle => {
        return this.airVehicles[id];
    };

    private getDataForUI = (): AV_DATA_UI[] => {
        const res: AV_DATA_UI[] = [];

        for (const avId in this.airVehicles) {
            if (this.airVehicles[avId]) {
                let missionRequest;
                const missionRoute = MissionRouteManager.getMissionRouteById(this.airVehicles[avId].routeId);
                if (missionRoute) {
                    missionRequest = MissionRequestManager.getMissionRequestById(missionRoute.requestId);
                }

                const avDataUI: AV_DATA_UI = this.airVehicles[avId].toJsonForUI();
                avDataUI.modeDefine = AirVehicleMdLogic.validate(avDataUI, missionRequest);
                avDataUI.missionRequestId = missionRequest ? missionRequest.id : undefined;
                res.push(avDataUI);
            }
        }
        return res;
    };



    private sendDataToUI = (): void => {
        const jsonForSend: AV_DATA_UI[] = this.getDataForUI();
        GimbalManager.sendDataToUI();
        SocketIO.emit('webServer_airVehiclesData', jsonForSend);
    };



    private avsSocketConfig: {} = {
        [SOCKET_ROOM.AVs_Tel_room]: this.onGetAVs,
    };


    // region API uncions

    public static startGetSocket = AirVehicleManager.instance.startGetSocket;
    public static getAVById = AirVehicleManager.instance.getAVById;




    // endregion API uncions

}
