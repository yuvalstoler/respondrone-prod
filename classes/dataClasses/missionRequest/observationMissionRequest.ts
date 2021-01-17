import {
    MISSION_REQUEST_DATA_UI,
    ID_TYPE,
    LAST_ACTION, MISSION_REQUEST_DATA,
    MISSION_TYPE, OBSERVATION_MISSION_REQUEST, OBSERVATION_MISSION_REQUEST_REP, FOLLOW_PATH_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from './missionRequest';

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
            ...this.toJsonForSaveCommon(),
            observationMissionRequest: this.observationMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            observationMissionRequest: this.observationMissionRequest,
        };
    };

    public toJsonForRep = (): OBSERVATION_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            observationMissionRequest: this.observationMissionRequest,
        };
    };

    public toJsonForTMM = (): OBSERVATION_MISSION_REQUEST => {
        return this.observationMissionRequest;
    };

    saveConfig = {
        ...this.saveConfigCommon,
        observationMissionRequest: this.setMissionRequest,
    };


}
