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
import {Gimbal} from '../../../../../classes/dataClasses/gimbal/Gimbal';
import {RequestManager} from '../../AppService/restConnections/requestManager';


export class GimbalManager {


    private static instance: GimbalManager = new GimbalManager();


    gimbals: Gimbal[] = [];
    timestamp: number;

    private constructor() {
        const date = Date.now();
        const data: GIMBAL_DATA_TELEMETRY = {
            timestamp: {
                timestamp: 0
            },
            gimbals: [
                {
                    'id': '1',
                    'droneId': '1',
                    'AIMode': 0,
                    'gimbalParameters': {
                        'pitch': -10,
                        'yaw': -10
                    },
                    'visibleCameraParameters': {
                        'zoomVisibleCamera': 4 /*day*/
                    },
                    'infraredCameraParameters': { /*night*/
                        'zoomInfraredCamera': 5,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
                    },
                    'opticalVideoURL': 'string',
                    'infraredVideoURL': 'string'
                },
                {
                    'id': '2',
                    'droneId': '2',
                    'AIMode': 0,
                    'gimbalParameters': {
                        'pitch': -10,
                        'yaw': -10
                    },
                    'visibleCameraParameters': {
                        'zoomVisibleCamera': 6 /*day*/
                    },
                    'infraredCameraParameters': { /*night*/
                        'zoomInfraredCamera': 7,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
                    },
                    'opticalVideoURL': 'string',
                    'infraredVideoURL': 'string'
                },
                {
                    'id': '3',
                    'droneId': '3',
                    'AIMode': 0,
                    'gimbalParameters': {
                        'pitch': -10,
                        'yaw': -10
                    },
                    'visibleCameraParameters': {
                        'zoomVisibleCamera': 5 /*day*/
                    },
                    'infraredCameraParameters': { /*night*/
                        'zoomInfraredCamera': 6,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
                    },
                    'opticalVideoURL': 'string',
                    'infraredVideoURL': 'string'
                }
            ]

        };
        setInterval(() => {
            data.gimbals.forEach(drone => {
                drone.cameraLookAtPoint.lat = 42.0 + Math.random() * (0.02 + 0.01) - 0.01;
                drone.cameraLookAtPoint.lon = 9.95493 + Math.random() * (0.02 + 0.01) - 0.01;
            });
            this.onGetGimbals(data);
        }, 1000);
    }

    private startGetSocket = () => {
        SocketClient.addToSortConfig(SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep, this.gimbalsSocketConfig);
    };

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
    };

    private gimbalsSocketConfig: {} = {
        [SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep]: this.onGetGimbals,
    };

    // region API uncions
    public static startGetSocket = GimbalManager.instance.startGetSocket;
    public static gimbalAction = GimbalManager.instance.gimbalAction;


    // endregion API uncions

}
