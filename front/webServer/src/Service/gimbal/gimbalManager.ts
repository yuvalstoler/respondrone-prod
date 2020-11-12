import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {
    AV_DATA_TELEMETRY_REP,
    GIMBAL_DATA_UI,
    AV_OPTIONS,
    CAPABILITY, GIMBAL_DATA, GIMBAL_DATA_TELEMETRY,
    ID_TYPE, MISSION_TYPE,
    OPERATIONAL_STATUS,
    SOCKET_IO_CLIENT_TYPES, GIMBAL_ACTION, ASYNC_RESPONSE, MISSION_REQUEST_DATA, REPORT_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {GS_API, MS_API, SOCKET_ROOM} from "../../../../../classes/dataClasses/api/api_enums";
import {SocketIOClient} from "../../websocket/socketIOClient";
import {AirVehicle} from "../../../../../classes/dataClasses/airVehicle/airVehicle";
import {AirVehicleMdLogic} from "../../../../../classes/modeDefineTSSchemas/airVehicles/airVehicleMdLogic";
import {Gimbal} from "../../../../../classes/dataClasses/gimbal/Gimbal";
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {CommRelayMissionRequest} from "../../../../../classes/dataClasses/missionRequest/commRelayMissionRequest";
import {ServoingMissionRequest} from "../../../../../classes/dataClasses/missionRequest/servoingMissionRequest";
import {ScanMissionRequest} from "../../../../../classes/dataClasses/missionRequest/scanMissionRequest";
import {ObservationMissionRequest} from "../../../../../classes/dataClasses/missionRequest/observationMissionRequest";
import {FollowPathMissionRequest} from "../../../../../classes/dataClasses/missionRequest/followPathMissionRequest";
import {DeliveryMissionRequest} from "../../../../../classes/dataClasses/missionRequest/deliveryMissionRequest";
import {RequestManager} from "../../AppService/restConnections/requestManager";

const _ = require('lodash');


export class GimbalManager {


    private static instance: GimbalManager = new GimbalManager();


    gimbals: Gimbal[] = [];

    private constructor() {

    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.GS, this.gimbalsSocketConfig);
    }

    private onGetGimbals = (data: GIMBAL_DATA_TELEMETRY) => {
        this.gimbals = Converting.Arr_GIMBAL_DATA_to_Arr_Gimbal(data.gimbals);

        this.sendDataToUI()
    };

    private getByIds = (ids: ID_TYPE[]): GIMBAL_DATA_UI[] => {
        const res: GIMBAL_DATA_UI[] = [];
        this.gimbals.forEach((gimbal: Gimbal) => {
            if (ids.indexOf(gimbal.id) !== -1) {
                const data = gimbal.toJsonForUI();
                res.push(data);
            }
        });
        return res;
    }

    private getDataForUI = (): GIMBAL_DATA_UI[] => {
        const res: GIMBAL_DATA_UI[] = [];
        this.gimbals.forEach((gimbal: Gimbal) => {
            const avDataUI: GIMBAL_DATA_UI = gimbal.toJsonForUI();
            // avDataUI.modeDefine = gimbal.modeDefine = AirVehicleMdLogic.validate(avDataUI);

            res.push(avDataUI);
        });
        return res;
    };

    private gimbalAction = (gimbalAction: GIMBAL_ACTION) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            RequestManager.requestToGS(GS_API.gimbalAction, gimbalAction)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });
        });
    }

    private sendDataToUI = (): void => {
        const jsonForSend: GIMBAL_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_gimbalsData', jsonForSend);
    };



    private gimbalsSocketConfig: {} = {
        [SOCKET_ROOM.Gimbals_Tel_room]: this.onGetGimbals,
    };


    // region API uncions

    public static startGetSocket = GimbalManager.instance.startGetSocket;
    public static getByIds = GimbalManager.instance.getByIds;
    public static gimbalAction = GimbalManager.instance.gimbalAction;




    // endregion API uncions

}
