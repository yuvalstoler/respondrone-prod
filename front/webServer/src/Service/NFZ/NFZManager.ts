import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {MS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    LAST_ACTION,
    NFZ_DATA,
    NFZ_DATA_UI,
    MISSION_REQUEST_DATA,
    MISSION_STATUS,
    MISSION_TYPE, TASK_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {NFZ} from "../../../../../classes/dataClasses/nfz/nfz";
import {NFZMdLogic} from "../../../../../classes/modeDefineTSSchemas/nfz/NFZMdLogic";

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class NFZManager {


    private static instance: NFZManager = new NFZManager();


    nfzs: NFZ[] = [];

    private constructor() {
        this.getNFZFromMS();
    }

    private getNFZFromMS = () => {
        RequestManager.requestToMS(MS_API.readAllNFZ, {})
            .then((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                if ( data.success ) {
                    this.nfzs = Converting.Arr_NFZ_DATA_to_Arr_NFZ(data.data);
                }
                else {
                    //todo logger
                    console.log('error getNFZsFromMS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getNFZsFromMS', JSON.stringify(data));
            });
    };

    private getNFZs = (): NFZ_DATA[] => {
        const res: NFZ_DATA[] = [];
        this.nfzs.forEach((nfz: NFZ) => {
            res.push(nfz.toJson());
        });
        return res;
    }


    private readAllNFZ = (requestData): Promise<ASYNC_RESPONSE<NFZ_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            res.data = this.getDataForUI();
            resolve(res);
        });
    }



    private getDataForUI = (): NFZ_DATA_UI[] => {
        const res: NFZ_DATA_UI[] = [];
        this.nfzs.forEach((nfz: NFZ) => {
            const nfzDataUI: NFZ_DATA_UI = nfz.toJsonForUI();
            nfzDataUI.modeDefine = NFZMdLogic.validate(nfzDataUI);

            res.push(nfzDataUI);
        });
        return res;
    };

    private updateAllNFZs = (data: NFZ_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.nfzs = Converting.Arr_NFZ_DATA_to_Arr_NFZ(data);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }


    private sendDataToUI = (): void => {
        const jsonForSend: NFZ_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_nfzs', jsonForSend);
    };

    // region API uncions

    public static getNFZs = NFZManager.instance.getNFZs;
    public static readAllNFZ = NFZManager.instance.readAllNFZ;
    public static updateAllNFZs = NFZManager.instance.updateAllNFZs;


    public static sendDataToUI = NFZManager.instance.sendDataToUI;


    // endregion API uncions

}
