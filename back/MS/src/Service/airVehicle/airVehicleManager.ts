import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';

import {
    AIR_VEHICLE_TYPE,
    AV_DATA_TELEMETRY_REP,
    CAPABILITY,
    COMM_STATUS,
    OPERATIONAL_STATUS,
    SOCKET_CLIENT_TYPES
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {SocketClient} from '../../websocket/socketClient';
import {AirVehicle} from '../../../../../classes/dataClasses/airVehicle/airVehicle';


export class AirVehicleManager {


    private static instance: AirVehicleManager = new AirVehicleManager();


    airVehicles: AirVehicle[] = [];
    timestamp: number;

    private constructor() {
        const date = Date.now();
        const data: AV_DATA_TELEMETRY_REP = {
            'timestamp': {
                'timestamp': 0
            },
            'drones': [
                {
                    'id': '1',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 10000
                    },
                    'gpsQuality': 0,
                    'energyLevel': 10,
                    'remainingTimeFlight': 0,
                    'heading': 0,
                    'altitudeAGL': 500,
                    'altitudeAsl': 500,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 12455451215
                    },
                    'capability': [CAPABILITY.Surveillance, CAPABILITY.CommRelay],
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.OnMission,
                    'routeId': 'iefsgwr',
                    'name': 'Alpha 1',
                },
                {
                    'id': '2',
                    'type': AIR_VEHICLE_TYPE.Pixhawk,
                    'location': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 10000
                    },
                    'gpsQuality': 0,
                    'energyLevel': 80,
                    'remainingTimeFlight': 0,
                    'heading': 30,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 66544545455
                    },
                    'capability': [ CAPABILITY.Surveillance, CAPABILITY.CommRelay],
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'name': 'Alpha 2',
                },
                {
                    'id': '3',
                    'type': AIR_VEHICLE_TYPE.Alpha,
                    'location': {
                        'lat': 0,
                        'lon': 0,
                        'alt': 10000
                    },
                    'gpsQuality': 0,
                    'energyLevel': 44,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 484452454
                    },
                    'capability': [CAPABILITY.CommRelay],
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'name': 'Alpha 3',
                }
            ]
        };
        setInterval(() => {
            data.timestamp.timestamp = Date.now();
            data.drones.forEach(drone => {
                drone.location.lat = 42.0 + Math.random() * (0.2 + 0.1) - 0.1;
                drone.location.lon = 9.95493 + Math.random() * (0.2 + 0.1) - 0.1;
            });

            this.onGetAirVehicles(data);
        }, 1000);
    }

    private startGetSocket = () => {
        SocketClient.addToSortConfig(SOCKET_CLIENT_TYPES.DroneTelemetrySenderRep, this.airVehiclesSocketConfig);
    };

    private onGetAirVehicles = (data: AV_DATA_TELEMETRY_REP) => { //        if (data.drones) {}
        this.airVehicles = Converting.Arr_AV_DATA_to_Arr_AV(data.drones);
        this.timestamp = data.timestamp.timestamp;
        SocketIO.emit(SOCKET_ROOM.AVs_Tel_room, data);
    };


    private airVehiclesSocketConfig: {} = {
        [SOCKET_CLIENT_TYPES.DroneTelemetrySenderRep]: this.onGetAirVehicles,
    };

    // region API uncions
    public static startGetSocket = AirVehicleManager.instance.startGetSocket;


    // endregion API uncions

}
