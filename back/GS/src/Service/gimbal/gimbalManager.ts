import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {GS_API, SOCKET_ROOM, TMM_API} from '../../../../../classes/dataClasses/api/api_enums';

import {
    ASYNC_RESPONSE,
    COLOR_PALETTE_INFRARED_CAMERA,
    FR_DATA_TELEMETRY,
    FR_DATA_TELEMETRY_REP, GIMBAL_ACTION,
    GIMBAL_DATA, GIMBAL_DATA_TELEMETRY, REPORT_DATA,
    SOCKET_CLIENT_TYPES,
    SOCKET_IO_CLIENT_TYPES
} from '../../../../../classes/typings/all.typings';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {SocketIO} from '../../websocket/socket.io';
import {SocketClient} from '../../websocket/socketClient';
import {Gimbal} from "../../../../../classes/dataClasses/gimbal/Gimbal";
import {RequestManager} from "../../AppService/restConnections/requestManager";


export class GimbalManager {


    private static instance: GimbalManager = new GimbalManager();


    gimbals: Gimbal[] = [];
    timestamp: number;

    private constructor() {
  /*      const date = Date.now();
        const test: GIMBAL_DATA_TELEMETRY = {
            timestamp: {
                timestamp: 0
            },
            gimbals: [
                {
                    "id": "string",
                    "droneId": "string",
                    "AIMode": 0,
                    "gimbalParameters": {
                        "pitch": -10,
                        "yaw": -10
                    },
                    "visibleCameraParameters": {
                        "zoomVisibleCamera": 0
                    },
                    "infraredCameraParameters": {
                        "zoomInfraredCamera": 0,
                        "colorPaletteInfraredCamera": COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    "trackedEntity": 0,
                    "cameraLookAtPoint": {
                        "lat": -90,
                        "lon": -180,
                        "alt": 0
                    },
                    "opticalVideoURL": "string",
                    "infraredVideoURL": "string"
                }
            ]

        }
        setInterval(() => {
            this.onGetGimbals(test);
        }, 5000);*/
    }

    private startGetSocket = () => {
        SocketClient.addToSortConfig(SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep, this.gimbalsSocketConfig);
    }

    private onGetGimbals = (data: GIMBAL_DATA_TELEMETRY) => {
        this.gimbals = Converting.Arr_GIMBAL_DATA_to_Arr_Gimbal(data.gimbals);
        if (data.timestamp) {
            this.timestamp = data.timestamp.timestamp;
        }
        SocketIO.emit(SOCKET_ROOM.Gimbals_Tel_room, data);
    };

    private gimbalAction = (gimbalAction: GIMBAL_ACTION) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            RequestManager.requestToTMM(TMM_API.gimbalAction, gimbalAction)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });
        });
    }

    private gimbalsSocketConfig: {} = {
        [SOCKET_ROOM.Gimbals_Tel_room]: this.onGetGimbals,
    };

    // region API uncions
    public static startGetSocket = GimbalManager.instance.startGetSocket;
    public static gimbalAction = GimbalManager.instance.gimbalAction;


    // endregion API uncions

}
