import {
    MISSION_REQUEST_DATA_UI,
    ID_TYPE,
    LAST_ACTION, MISSION_REQUEST_DATA,
    MISSION_TYPE, OBSERVATION_MISSION_REQUEST, OBSERVATION_MISSION_REQUEST_REP, FOLLOW_PATH_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from "./missionRequest";

export class ObservationMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.Observation;
    observationMissionRequest: OBSERVATION_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: OBSERVATION_MISSION_REQUEST) => {
        this.observationMissionRequest = data;
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
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            observationMissionRequest: this.observationMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            missionStatus: this.missionStatus,};
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            observationMissionRequest: this.observationMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            missionStatus: this.missionStatus,
            modeDefine: undefined,
            textUI: [
                {
                    title: 'Resource',
                    value: '' + this.observationMissionRequest.droneId
                },
                {
                    title: 'Altitude offset',
                    value: '' + this.observationMissionRequest.altitudeOffset
                },
                {
                    title: 'Observation Azimuth',
                    value: '' + this.observationMissionRequest.observationAzimuth
                }
            ]

        };
    };

    public toJsonForRep = (): OBSERVATION_MISSION_REQUEST_REP => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            observationMissionRequest: this.observationMissionRequest,
        };
    };

    public toJsonForTMM = (): OBSERVATION_MISSION_REQUEST => {
        return this.observationMissionRequest;
    };

    saveConfig = {
        id: this.setId,
        version: this.setVersion,
        lastAction: this.setLastAction,
        observationMissionRequest: this.setMissionRequest,

        description: this.setDescription,
        comments: this.setComments,
        time: this.setTime,
        idView: this.setIdView,
        createdBy: this.setCreatedBy,
        missionStatus: this.setMissionStatus,
    };


}
