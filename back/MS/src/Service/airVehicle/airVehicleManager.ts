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
        const test: AV_DATA_TELEMETRY_REP = {
            'timestamp': {
                'timestamp': 0
            },
            'drones': [
                {
                    'id': '1',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.979365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 0,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 1',
                },
                {
                    'id': '2',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.989365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 30,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 2',
                },
                {
                    'id': '3',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '4',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '5',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '6',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '7',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '8',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '9',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '10',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },
                {
                    'id': '11',
                    'type': AIR_VEHICLE_TYPE.Dji,
                    'location': {
                        'lat': 32.999365,
                        'lon': 34.8,
                        'alt': 0
                    },
                    'gpsQuality': 0,
                    'energyLevel': 0,
                    'remainingTimeFlight': 0,
                    'heading': 270,
                    'altitudeAGL': 0,
                    'altitudeAsl': 0,
                    'velocity': 0,
                    'lastUpdateTimeFromDrone': {
                        'timestamp': 0
                    },
                    'capability': Object.values(CAPABILITY),
                    'commStatus': COMM_STATUS.OK,
                    'operationalStatus': OPERATIONAL_STATUS.Ready,
                    'routeId': 'string',
                    'name': 'Alpha 3',
                },

            ]
        };
        setInterval(() => {
            this.onGetAirVehicles(test);
        }, 5000);
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