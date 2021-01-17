import {
    COMM_RELAY_MISSION_REQUEST,
    COMM_RELAY_MISSION_REQUEST_REP,
    FOLLOW_PATH_MISSION_REQUEST,
    FOLLOW_PATH_MISSION_REQUEST_REP, MISSION_REQUEST_DATA_UI,
    ID_TYPE,
    LAST_ACTION, MISSION_REQUEST_DATA,
    MISSION_TYPE, DELIVERY_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from './missionRequest';

export class FollowPathMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.Patrol;
    followPathMissionRequest: FOLLOW_PATH_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: FOLLOW_PATH_MISSION_REQUEST) => {
        this.followPathMissionRequest = data;
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
                }
            }
        }
    };


    public toJsonForSave = (): MISSION_REQUEST_DATA => {
        return {
            ...this.toJsonForSaveCommon(),
            followPathMissionRequest: this.followPathMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            followPathMissionRequest: this.followPathMissionRequest,
        };
    };

    public toJsonForRep = (): FOLLOW_PATH_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            followPathMissionRequest: this.followPathMissionRequest,
        };
    };

    public toJsonForTMM = (): FOLLOW_PATH_MISSION_REQUEST => {
        return this.followPathMissionRequest;
    };


    saveConfig = {
        ...this.saveConfigCommon,
        followPathMissionRequest: this.setMissionRequest,
    };


}
