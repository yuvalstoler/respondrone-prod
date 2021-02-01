import {STATUS_SERVICE_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    CONNECTION_STATUS,
    MISSION_REQUEST_DATA,
    STATUS_INDICATOR_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {StatusMdLogic} from '../../../../../classes/modeDefineTSSchemas/status/statusMdLogic';

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class StatusManager {


    private static instance: StatusManager = new StatusManager();


    statusIndicatorData: STATUS_INDICATOR_DATA = {
        // webserver: {status: CONNECTION_STATUS.NA, description: ''},
        // internet: {status: CONNECTION_STATUS.NA, description: ''},
        repositories: {status: CONNECTION_STATUS.NA, description: ''},
        tmm: {status: CONNECTION_STATUS.NA, description: ''},
        thales: {status: CONNECTION_STATUS.NA, description: ''},
    };

    private constructor() {
        this.getStatusFromStatusService();
    }

    private getStatusFromStatusService = () => {
        RequestManager.requestToStatusService(STATUS_SERVICE_API.readAllStatuses, {})
            .then((data: ASYNC_RESPONSE<STATUS_INDICATOR_DATA>) => {
                if ( data.success ) {
                   this.updateAllStatus(data.data);
                }
                else {
                    //todo logger
                    console.log('error getMissionsFromMS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getMissionsFromMS', JSON.stringify(data));
            });
    };


    private readAllStatuses = (requestData): Promise<ASYNC_RESPONSE<STATUS_INDICATOR_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true};
            res.data = this.getDataForUI();
            resolve(res);
        });
    }

    private getDataForUI = (): STATUS_INDICATOR_DATA => {
        const res: STATUS_INDICATOR_DATA = this.statusIndicatorData;
        // res.modeDefine = StatusMdLogic.validate(res);
        return res;
    };

    private updateAllStatus = (data: STATUS_INDICATOR_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.statusIndicatorData = data;
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }


    private sendDataToUI = (): void => {
        const jsonForSend: STATUS_INDICATOR_DATA = this.getDataForUI();
        SocketIO.emit('webServer_statusData', jsonForSend);
    };

    // region API uncions

    public static readAllStatuses = StatusManager.instance.readAllStatuses;
    public static updateAllStatus = StatusManager.instance.updateAllStatus;


    public static sendDataToUI = StatusManager.instance.sendDataToUI;


    // endregion API uncions

}
