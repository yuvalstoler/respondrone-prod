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
import {MissionRequest} from "./missionRequest";

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
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            followPathMissionRequest: this.followPathMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            followPathMissionRequest: this.followPathMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,
            modeDefine: undefined,
            actionOptions: this.actionOptions,
            textUI: [
                {
                    title: 'Resource',
                    value: '' + this.followPathMissionRequest.droneId
                },
                {
                    title: 'Gimbal azimuth',
                    value: '' + this.followPathMissionRequest.gimbalAzimuth
                },
                {
                    title: 'Yaw orientation',
                    value: '' + this.followPathMissionRequest.yawOrientation
                }
            ]
        };
    };

    public toJsonForRep = (): FOLLOW_PATH_MISSION_REQUEST_REP => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            followPathMissionRequest: this.followPathMissionRequest,
        };
    };

    public toJsonForTMM = (): FOLLOW_PATH_MISSION_REQUEST => {
        return this.followPathMissionRequest;
    };


    saveConfig = {
        id: this.setId,
        version: this.setVersion,
        lastAction: this.setLastAction,
        followPathMissionRequest: this.setMissionRequest,

        description: this.setDescription,
        comments: this.setComments,
        time: this.setTime,
        idView: this.setIdView,
        createdBy: this.setCreatedBy,
        source: this.setSource,
        missionStatus: this.setMissionStatus,
    };


}
