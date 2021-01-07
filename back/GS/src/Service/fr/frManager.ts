import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');


import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    FR_DATA_UI,
    SOCKET_IO_CLIENT_TYPES,
    FR_DATA_TELEMETRY,
    ID_TYPE,
    MISSION_REQUEST_DATA,
    MAP,
    FR_TYPE,
    FR_STATUS
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';
import {SocketIOClient} from '../../websocket/socketIOClient';



export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: MAP<FR> = {};

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
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
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
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
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
                        'lat': 0,
                        'lon': 0,
                        'alt': 0
                    },
                    'lastUpdated': {
                        'timestamp': date - 5000
                    },
                    'online': false,
                    'status': FR_STATUS.busy
                }
            ]
        };

        let lat = 42.2332, lon = 9.1061, diff = 0.00005, sign = 0, key1 = 'lat', key2 = 'lon';
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
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.FRS, this.frsSocketConfig);
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        this.frs = {};
        data.FRs.forEach((item: FR_DATA) => {
           this.frs[item.id] = new FR(item);
        });
    };

    private getFRById = (id: ID_TYPE): FR => {
        return this.frs[id];
    }

    private getFRNameById = (id: ID_TYPE): string => {
        return this.frs[id] ? this.frs[id].callSign : id;
    }


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions

    public static startGetSocket = FrManager.instance.startGetSocket;
    public static getFRById = FrManager.instance.getFRById;
    public static getFRNameById = FrManager.instance.getFRNameById;




    // endregion API uncions

}
