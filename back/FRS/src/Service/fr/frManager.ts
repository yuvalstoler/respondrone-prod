import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {DBS_API, SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    FR_TYPE,
    SOCKET_IO_CLIENT_TYPES, FR_DATA_TELEMETRY, FR_STATUS, SOCKET_CLIENT_TYPES, FR_DATA_TELEMETRY_REP
} from '../../../../../classes/typings/all.typings';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {SocketIO} from '../../websocket/socket.io';
import {SocketClient} from '../../websocket/socketClient';


export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: FR[] = [];
    timestamp: number;

    private constructor() {
        const date = Date.now();
        const data: FR_DATA_TELEMETRY = {
            'timestamp': {
                'timestamp': 0
            },
            'FRs': [
                {
                    'id': 'id1',
                    'callSign': 'PO-001',
                    'type': FR_TYPE.police,
                    'location': {
                        'latitude': 0,
                        'longitude': 0,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date
                    },
                    'online': true,
                    'status': FR_STATUS.available
                },
                {
                    'id': 'id2',
                    'callSign': 'PARA-001',
                    'type': FR_TYPE.paramedic,
                    'location': {
                        'latitude': 0,
                        'longitude': 0,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date - 3600000
                    },
                    'online': false,
                    'status': FR_STATUS.available
                },
                {
                    'id': 'id3',
                    'callSign': 'FF-007',
                    'type': FR_TYPE.fireFighter,
                    'location': {
                        'latitude': 0,
                        'longitude': 0,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date - 5000
                    },
                    'online': false,
                    'status': FR_STATUS.busy
                }
            ]
        };

        let lat = 42.2332, lon = 9.1061, diff = 0.00005, sign = 0, key1 = 'latitude', key2 = 'longitude';
        setInterval(() => {
            const tmp = lat; lat = lon; lon = tmp;
            const tmpKey = key1; key1 = key2; key2 = tmpKey;
            sign++;
        },  2 * 60 * 1000);

        setInterval(() => {
            data.timestamp.timestamp = Date.now();
            data.FRs.forEach((fr, index) => {
                lat += diff * (sign % 3 === 0 || sign % 4 === 0 ? -1 : 1)
                fr.location[key1] = lat;
                fr.location[key2] = lon + index * 0.005;
            });

            this.onGetFRs(data);
        }, 1000);
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.CCG, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = Converting.Arr_FR_DATA_to_Arr_FR(data.FRs);
        if (data.timestamp) {
            this.timestamp = data.timestamp.timestamp;
        }

        SocketIO.emit(SOCKET_ROOM.FRs_Tel_room, data);
        const dataForRep: FR_DATA_TELEMETRY_REP = this.convertDataForRep();
        SocketClient.emit(SOCKET_CLIENT_TYPES.FRTelemetryReceiverRep, dataForRep);
    };

    private convertDataForRep = (): FR_DATA_TELEMETRY_REP => {
        const data: FR_DATA_TELEMETRY_REP = {
            timestamp: {
                timestamp: this.timestamp
            },
            FRs: this.frs.map((fr: FR) => fr.toJsonForRepository())
        };
        return data;
    }


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions
    public static startGetSocket = FrManager.instance.startGetSocket;


    // endregion API uncions

}
