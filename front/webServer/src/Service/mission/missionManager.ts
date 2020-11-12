import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {MS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    LAST_ACTION,
    MISSION_DATA,
    MISSION_DATA_UI,
    MISSION_REQUEST_DATA,
    MISSION_STATUS,
    MISSION_TYPE, TASK_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import {MissionMdLogic} from "../../../../../classes/modeDefineTSSchemas/mission/missionMdLogic";

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class MissionManager {


    private static instance: MissionManager = new MissionManager();


    missions: Mission[] = [];

    private constructor() {
        this.getMissionFromMS();
    }

    private getMissionFromMS = () => {
        RequestManager.requestToMS(MS_API.readAllMission, {})
            .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                if ( data.success ) {
                    this.missions = Converting.Arr_MISSION_DATA_to_Arr_Mission(data.data);
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

    private getMissions = (): MISSION_DATA[] => {
        const res: MISSION_DATA[] = [];
        this.missions.forEach((mission: Mission) => {
            res.push(mission.toJson());
        });
        return res;
    }


    private readAllMission = (requestData): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            res.data = this.getDataForUI();
            resolve(res);
        });
    }



    private getDataForUI = (): MISSION_DATA_UI[] => {
        const res: MISSION_DATA_UI[] = [];
        this.missions.forEach((mission: Mission) => {
            const missionDataUI: MISSION_DATA_UI = mission.toJsonForUI();
            missionDataUI.modeDefine = MissionMdLogic.validate(missionDataUI);

            res.push(missionDataUI);
        });
        return res;
    };

    private updateAllMissions = (data: MISSION_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.missions = Converting.Arr_MISSION_DATA_to_Arr_Mission(data);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }


    private sendDataToUI = (): void => {
        const jsonForSend: MISSION_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_missions', jsonForSend);
    };

    // region API uncions

    public static getMissions = MissionManager.instance.getMissions;
    public static readAllMission = MissionManager.instance.readAllMission;
    public static updateAllMissions = MissionManager.instance.updateAllMissions;


    public static sendDataToUI = MissionManager.instance.sendDataToUI;


    // endregion API uncions

}
