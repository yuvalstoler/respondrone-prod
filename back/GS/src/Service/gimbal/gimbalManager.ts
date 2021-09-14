import {SOCKET_ROOM, THALES_API} from '../../../../../classes/dataClasses/api/api_enums';

import {
    ASYNC_RESPONSE,
    COLOR_PALETTE_INFRARED_CAMERA,
    GIMBAL_ACTION_FOR_TMM,
    GIMBAL_ACTION_MGW,
    GIMBAL_ACTION_OSCC,
    GIMBAL_DATA,
    GIMBAL_DATA_TELEMETRY,
    GIMBAL_PARAMS,
    ID_TYPE,
    MAP,
    REPORT_DATA,
    SOCKET_CLIENT_TYPES,
    VIDEO_URL_KEY, VISIBLE_CAMERA_PARAMS
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {SocketClient} from '../../websocket/socketClient';
import {Gimbal} from '../../../../../classes/dataClasses/gimbal/Gimbal';
import {RequestManager} from '../../AppService/restConnections/requestManager';
import {GimbalControlManager} from '../gimbalControl/gimbalControlManager';


export class GimbalManager {


    private static instance: GimbalManager = new GimbalManager();


    gimbals: MAP<Gimbal> = {};
    timestamp: number;

    videoUrlKeys = Object.values(VIDEO_URL_KEY);

    private constructor() {
        const lon = -3.1335, lat = 38.0941;
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
                        'zoomVisibleCamera': 4
                    },
                    'infraredCameraParameters': {
                        'zoomInfraredCamera': 5,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': lat,
                        'lon': lon,
                        'alt': 0
                    },
                    cameraFootprint: {
                        coordinates: []
                    },
                    'opticalVideoURL': 'rtsp://iai-video1-drone1.simplex-c2.com:8554/drone1',
                    'infraredVideoURL': 'ws://80.250.156.232:8082/'
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
                        'zoomVisibleCamera': 4
                    },
                    'infraredCameraParameters': {
                        'zoomInfraredCamera': 5,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': lat + 0.0005,
                        'lon': lon,
                        'alt': 0
                    },
                    cameraFootprint: {
                        coordinates: []
                    },
                    'opticalVideoURL': 'ws://20.71.141.60:9093/',
                    'infraredVideoURL': 'ws://20.71.141.60:9094/'
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
                        'zoomVisibleCamera': 4
                    },
                    'infraredCameraParameters': {
                        'zoomInfraredCamera': 5,
                        'colorPaletteInfraredCamera': COLOR_PALETTE_INFRARED_CAMERA.Arctic
                    },
                    'trackedEntity': 0,
                    'cameraLookAtPoint': {
                        'lat': lat,
                        'lon': lon,
                        'alt': 0
                    },
                    cameraFootprint: {
                        coordinates: []
                    },
                    'opticalVideoURL': 'ws://20.71.141.60:9095/',
                    'infraredVideoURL': 'ws://20.71.141.60:9096/'
                }
            ]

        };
        setInterval(() => {
            // data.gimbals.forEach(drone => {
            //     drone.cameraLookAtPoint.lat = 42.0 + Math.random() * (0.02 + 0.01) - 0.01;
            //     drone.cameraLookAtPoint.lon = 9.95493 + Math.random() * (0.02 + 0.01) - 0.01;
            //     drone.cameraFootprint.coordinates =
            //     [
            //         {
            //             'lat': 42.05,
            //             'lon': 9.94493,
            //             'alt': 0
            //         },
            //         {
            //             'lat': 42.05 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'lon': 9.98493 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'alt': 0
            //         },
            //         {
            //             'lat': 41.95 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'lon': 9.98493 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'alt': 0
            //         },
            //         {
            //             'lat': 41.95 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'lon': 9.94493 + Math.random() * (0.02 + 0.01) - 0.01,
            //             'alt': 0
            //         },
            //         {
            //             'lat': 42.05,
            //             'lon': 9.94493,
            //             'alt': 0
            //         }
            //     ];
            // });
            this.onGetGimbals(data);
        }, 1000);
    }

    private startGetSocket = () => {
        // SocketClient.addToSortConfig(SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep, this.gimbalsSocketConfig);
    };
    // ------------------
    private onGetGimbals = (data: GIMBAL_DATA_TELEMETRY) => {
        // this.gimbals = Converting.Arr_GIMBAL_DATA_to_Arr_Gimbal(data.gimbals);
        this.gimbals = {};
        data.gimbals.forEach((item: GIMBAL_DATA) => {
            GimbalControlManager.updateGimbalIfNeeded(item);
            item.controlData = GimbalControlManager.getGimbalControlDataByDroneId(item.droneId);
            this.gimbals[item.droneId] = new Gimbal(item);
        });
        GimbalControlManager.removeGimbals(this.gimbals);

        if (data.timestamp) {
            this.timestamp = data.timestamp.timestamp;
        }
        SocketIO.emit(SOCKET_ROOM.Gimbals_Tel_room, data);
    };
    // ------------------
    private gimbalActionFromMGW = (gimbalAction: GIMBAL_ACTION_MGW) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const gimbalByVideoSource: {gimbal: Gimbal, videoUrlKey: VIDEO_URL_KEY} = this.getGimbalByVideoSource(gimbalAction.videoSource);
            if (gimbalByVideoSource && GimbalControlManager.isAllowAction(gimbalAction.userId, gimbalByVideoSource.gimbal.droneId, gimbalByVideoSource.videoUrlKey)) {
                if (gimbalAction.parameters) {
                    const gimbalActionForTMM: GIMBAL_ACTION_FOR_TMM = {
                        droneId: gimbalByVideoSource.gimbal.droneId,
                        requestorID: '',
                        parameters: undefined
                    };
                    if (gimbalAction.parameters.hasOwnProperty('zoom')) {
                        if (gimbalByVideoSource.videoUrlKey === VIDEO_URL_KEY.opticalVideoURL) {
                            gimbalActionForTMM.parameters = {
                                zoomVisibleCamera: gimbalAction.parameters.zoom,
                            };
                        }
                        else if (gimbalByVideoSource.videoUrlKey === VIDEO_URL_KEY.infraredVideoURL) {
                            gimbalActionForTMM.parameters = {
                                zoomInfraredCamera: gimbalAction.parameters.zoom || 0,
                                colorPaletteInfraredCamera: gimbalByVideoSource.gimbal.infraredCameraParameters.colorPaletteInfraredCamera
                            };
                        }
                    }
                    else if (gimbalAction.parameters.hasOwnProperty('pitch') && gimbalAction.parameters.hasOwnProperty('yaw')) {
                        gimbalActionForTMM.parameters = {
                            pitch: gimbalAction.parameters.pitch || 0,
                            yaw: gimbalAction.parameters.yaw || 0
                        };
                    }


                    if (gimbalActionForTMM.parameters) {
                        RequestManager.requestToTHALES(THALES_API.gimbalAction, gimbalActionForTMM)
                            .then((data: ASYNC_RESPONSE) => {
                                resolve(data);
                            })
                            .catch((data: ASYNC_RESPONSE) => {
                                resolve(data);
                            });
                    }
                    else {
                        res.description = 'Incorrect gimbal parameters';
                        resolve(res);
                    }
                }

            }
            else {
                res.description = 'Control is required for camera actions';
                resolve(res);
            }
        });
    };
    // ------------------
    private gimbalActionFromOSCC = (gimbalAction: GIMBAL_ACTION_OSCC) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            if (GimbalControlManager.isAllowAction(gimbalAction.userId, gimbalAction.droneId, gimbalAction.videoUrlKey)) {
                const gimbalActionForTMM: GIMBAL_ACTION_FOR_TMM = {
                    droneId: gimbalAction.droneId,
                    requestorID: '',
                    parameters: gimbalAction.parameters
                };
                RequestManager.requestToTHALES(THALES_API.gimbalAction, gimbalActionForTMM)
                    .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                        resolve(data);
                    })
                    .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                        resolve(data);
                    });
            }
            else {
                res.description = 'Control is required for camera actions';
                resolve(res);
            }
        });
    };
    // ------------------
    private getGimbalByVideoSource = (videoSource: string): {gimbal: Gimbal, videoUrlKey: VIDEO_URL_KEY} => {
        let res;
        for (const droneId in this.gimbals) {
            if (this.gimbals[droneId]) {
                this.videoUrlKeys.forEach((videoUrlKey: string) => {
                    if (this.gimbals[droneId][videoUrlKey] === videoSource) {
                        res = {gimbal: this.gimbals[droneId], videoUrlKey: videoUrlKey};
                    }
                });
            }
        }
        return res;
    }
    // ------------------
    private getVideoUrl = (droneId: ID_TYPE, videoUrlKey: VIDEO_URL_KEY) => {
        return this.gimbals[droneId] ? this.gimbals[droneId][videoUrlKey] : undefined;
    }
    // ------------------
    private gimbalsSocketConfig: {} = {
        [SOCKET_CLIENT_TYPES.GimbalTelemetrySenderRep]: this.onGetGimbals,
    };

    // region API uncions
    public static startGetSocket = GimbalManager.instance.startGetSocket;
    public static gimbalActionFromMGW = GimbalManager.instance.gimbalActionFromMGW;
    public static gimbalActionFromOSCC = GimbalManager.instance.gimbalActionFromOSCC;
    public static getGimbalByVideoSource = GimbalManager.instance.getGimbalByVideoSource;
    public static getVideoUrl = GimbalManager.instance.getVideoUrl;


    // endregion API uncions

}
