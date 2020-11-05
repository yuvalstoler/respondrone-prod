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
        const test: FR_DATA_TELEMETRY = {
            'timestamp': {
                'timestamp': 0
            },
            'FRs': [
                {
                    'id': 'aaa',
                    'callSign': 'PO-001',
                    'type': FR_TYPE.police,
                    'location': {
                        'latitude': 32.379365,
                        'longitude': 34.945756,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date
                    },
                    'online': true,
                    'status': FR_STATUS.busy
                },
                {
                    'id': 'bbb',
                    'callSign': 'PARA-001',
                    'type': FR_TYPE.paramedic,
                    'location': {
                        'latitude': 32.369365,
                        'longitude': 34.955756,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date + 50
                    },
                    'online': false,
                    'status': FR_STATUS.available
                },
                {
                    'id': 'ccc',
                    'callSign': 'FR-007',
                    'type': FR_TYPE.fireFighter,
                    'location': {
                        'latitude': 32.367365,
                        'longitude': 34.945756,
                        'altitude': 0
                    },
                    'lastUpdated': {
                        'timestamp': date - 4550
                    },
                    'online': false,
                    'status': FR_STATUS.busy
                }
            ]
        };
        setInterval(() => {
            this.onGetFRs(test);
        }, 5000);
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
