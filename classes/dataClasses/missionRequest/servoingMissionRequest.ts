import {
    SERVOING_MISSION_REQUEST,
    SERVOING_MISSION_REQUEST_REP,
    ID_TYPE,
    LAST_ACTION,
    MISSION_TYPE, MISSION_REQUEST_DATA, MISSION_REQUEST_DATA_UI, SCAN_MISSION_REQUEST, SOURCE_TYPE

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from './missionRequest';

export class ServoingMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.Servoing;
    servoingMissionRequest: SERVOING_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: SERVOING_MISSION_REQUEST) => {
        this.servoingMissionRequest = data;
    };

    public setValues = (data: Partial<MISSION_REQUEST_DATA>, saveConfig: Object = this.saveConfig) => {
        for ( const key in saveConfig ) {
            if ( saveConfig.hasOwnProperty(key) ) {
                if ( data.hasOwnProperty(key) ) {
                    if ( data[key] !== undefined ) {
                        if ( data !== undefined ) {
                            saveConfig[key](data[key]);
                        }
                    }
                    else if ( data.id === undefined ) {
                        saveConfig['id'](data['id']);
                    }
                }
            }
        }
    };


    public toJsonForSave = (): MISSION_REQUEST_DATA => {
        return {
            ...this.toJsonForSaveCommon(),
            servoingMissionRequest: this.servoingMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            servoingMissionRequest: this.servoingMissionRequest,
        };
    };

    public toJsonForRep = (): SERVOING_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            servoingMissionRequest: this.servoingMissionRequest,
        };
    };

    public toJsonForTMM = (): SERVOING_MISSION_REQUEST => {
        return this.servoingMissionRequest;
    };

    saveConfig = {
        ...this.saveConfigCommon,
        servoingMissionRequest: this.setMissionRequest,
    };


}
