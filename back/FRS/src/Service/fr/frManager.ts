import {Converting} from '../../../../../classes/applicationClasses/utility/converting';


import {DBS_API, SOCKET_ROOM} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    FR_DATA,
    FR_TYPE,
    SOCKET_IO_CLIENT_TYPES,
    FR_DATA_TELEMETRY,
    FR_STATUS,
    SOCKET_CLIENT_TYPES,
    FR_DATA_TELEMETRY_REP,
    MAP,
    GEOPOINT3D,
    FR_DATA_REP, ID_TYPE
} from '../../../../../classes/typings/all.typings';
import {FR} from '../../../../../classes/dataClasses/fr/FR';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';
import {SocketIOClient} from '../../websocket/socketIOClient';
import {SocketIO} from '../../websocket/socket.io';
import {SocketClient} from '../../websocket/socketClient';


export class FrManager {


    private static instance: FrManager = new FrManager();


    frs: MAP<FR> = {};
    timestamp: number;

    private constructor() {
        // const date = Date.now();
        // const data: FR_DATA_TELEMETRY = {
        //     'timestamp': {
        //         'timestamp': 0
        //     },
        //     'FRs': [
        //         {
        //             'id': '1',
        //             'callSign': 'PO-001',
        //             'type': FR_TYPE.police,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date
        //             },
        //             'online': true,
        //             'status': FR_STATUS.available
        //         },
        //         {
        //             'id': '2',
        //             'callSign': 'PARA-001',
        //             'type': FR_TYPE.paramedic,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date - 3600000
        //             },
        //             'online': true,
        //             'status': FR_STATUS.available
        //         },
        //         {
        //             'id': 'id4',
        //             'callSign': 'FF-008',
        //             'type': FR_TYPE.fireFighter,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date - 5000
        //             },
        //             'online': false,
        //             'status': FR_STATUS.busy
        //         },
        //         {
        //             'id': 'dev@simplex141.mooo.com',
        //             'callSign': 'FF-007',
        //             'type': FR_TYPE.paramedic,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date - 5000
        //             },
        //             'online': false,
        //             'status': FR_STATUS.busy
        //         },
        //         {
        //             'id': 'test@20.71.141.60',
        //             'callSign': 'FF-008',
        //             'type': FR_TYPE.fireFighter,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date - 5000
        //             },
        //             'online': false,
        //             'status': FR_STATUS.busy
        //         },
        //         {
        //             'id': '3',
        //             'callSign': 'PO-001',
        //             'type': FR_TYPE.police,
        //             'location': {
        //                 'lat': 0,
        //                 'lon': 0,
        //                 'alt': 0
        //             },
        //             'lastUpdated': {
        //                 'timestamp': date
        //             },
        //             'online': true,
        //             'status': FR_STATUS.available
        //         },
        //     ]
        // };
        //
        // let lat = 38.071, lon = -3.0928, diff = 0.00005, sign = 0, key1 = 'lat', key2 = 'lon';
        // setInterval(() => {
        //     const tmp = lat; lat = lon; lon = tmp;
        //     const tmpKey = key1; key1 = key2; key2 = tmpKey;
        //     sign++;
        // },  2 * 60 * 1000);
        //
        // setInterval(() => {
        //     data.timestamp.timestamp = Date.now();
        //     data.FRs.forEach((fr, index) => {
        //         lat += diff * (sign % 3 === 0 || sign % 4 === 0 ? -1 : 1)
        //         fr.location[key1] = lat;
        //         fr.location[key2] = lon + index * 0.005;
        //     });
        //
        //     this.onGetFRs(data);
        // }, 1000);
    }

    private startGetSocket = () => {
        SocketIOClient.addToSortConfig(SOCKET_IO_CLIENT_TYPES.CCG, this.frsSocketConfig);
    }

    private isValid = (item: FR_DATA): ASYNC_RESPONSE => {
        // TODO change
        const res: ASYNC_RESPONSE = {success: true};
        if (!item || !item.id || item.lastUpdated === undefined || !item.status) {
            res.success = false;
            res.description = 'not valid';
        }
        return res;
    }

    private onGetFRs = (data: FR_DATA_TELEMETRY) => {
        // this.frs = Converting.Arr_FR_DATA_to_Arr_FR(data.FRs);
        this.frs = {};

        for (let i = 0; i < data.FRs.length; i++) {
            const item = data.FRs[i];
            if (this.isValid(item).success) {
                if (item.location && item.location.hasOwnProperty('longitude')) {
                    const location: GEOPOINT3D = item.location as any;
                    item.location = {lat: location.latitude, lon: location.longitude, alt: location.altitude};
                }
                this.frs[item.id] = new FR(item);
            }
            else {
                data.FRs.splice(i--);
            }
        }
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
            FRs: this.getFRDataForRepository()
        };
        return data;
    }

    private getFRDataForRepository = (): FR_DATA_REP[] => {
        const res: FR_DATA_REP[] = [];
        for (const frId in this.frs) {
            if (this.frs.hasOwnProperty(frId)) {
                res.push(this.frs[frId].toJsonForRepository());
            }
        }
        return res;
    }

    private getFRById = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE<FR_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<FR_DATA> = {success: false};
            if (idObj && idObj.id) {
                res.success = (this.frs[idObj.id] !== undefined);
                res.data = this.frs[idObj.id];
            }
            resolve(res);
        });
    }


    private frsSocketConfig: {} = {
        [SOCKET_ROOM.FRs_Tel_room]: this.onGetFRs,
    };

    // region API uncions
    public static startGetSocket = FrManager.instance.startGetSocket;
    public static getFRById = FrManager.instance.getFRById;


    // endregion API uncions

}
