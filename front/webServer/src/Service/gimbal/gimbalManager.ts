import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {
    GIMBAL_DATA_UI,
    GIMBAL_DATA,
    GIMBAL_DATA_TELEMETRY,
    ID_TYPE,
    SOCKET_IO_CLIENT_TYPES,
    ASYNC_RESPONSE,
    GIMBAL_CONTROL_REQUEST_OSCC, MAP, GIMBAL_ACTION_OSCC
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {GS_API, SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {AirVehicle} from '../../../../../classes/dataClasses/airVehicle/airVehicle';
import {Gimbal} from '../../../../../classes/dataClasses/gimbal/Gimbal';
import {RequestManager} from '../../AppService/restConnections/requestManager';
import {AirVehicleManager} from '../airVehicle/airVehicleManager';
import {GimbalMdLogic} from '../../../../../classes/modeDefineTSSchemas/gimbals/gimbalMdLogic';

const _ = require('lodash');


export class GimbalManager {


    private static instance: GimbalManager = new GimbalManager();


    gimbals: MAP<Gimbal> = {};

    private constructor() {
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.GS, this.gimbalsSocketConfig);
    }

    private onGetGimbals = (data: GIMBAL_DATA_TELEMETRY) => {
        // this.gimbals = Converting.Arr_GIMBAL_DATA_to_Arr_Gimbal(data.gimbals);
        data.gimbals.forEach((item: GIMBAL_DATA) => {
            this.gimbals[item.id] = new Gimbal(item);
        });
        this.sendDataToUI();
    };

    private getDataForUI = (): GIMBAL_DATA_UI[] => {
        const res: GIMBAL_DATA_UI[] = [];
        for (const id in this.gimbals) {
            if (this.gimbals[id]) {
                const dataUI: GIMBAL_DATA_UI = this.gimbals[id].toJsonForUI();
                dataUI.modeDefine = GimbalMdLogic.validate(dataUI);
                const airVehicle = AirVehicleManager.getAVById(this.gimbals[id].droneId);
                if (airVehicle) {
                    dataUI.lineFromAirVehicle = [dataUI.cameraLookAtPoint, airVehicle.location];
                }

                res.push(dataUI);
            }
        }
        return res;
    };

    private gimbalAction = (gimbalAction: GIMBAL_ACTION_OSCC) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            RequestManager.requestToGS(GS_API.gimbalActionFromOSCC, gimbalAction)
                .then((data: ASYNC_RESPONSE) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    resolve(data);
                });
        });
    }

    private requestGimbalControlFromOSCC = (gimbalAction: GIMBAL_CONTROL_REQUEST_OSCC) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            RequestManager.requestToGS(GS_API.requestGimbalControlFromOSCC, gimbalAction)
                .then((data: ASYNC_RESPONSE) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
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
    public static gimbalAction = GimbalManager.instance.gimbalAction;
    public static requestGimbalControlFromOSCC = GimbalManager.instance.requestGimbalControlFromOSCC;
    public static sendDataToUI = GimbalManager.instance.sendDataToUI;




    // endregion API uncions

}
