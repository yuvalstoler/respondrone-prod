import {
    COMM_RELAY_MISSION_REQUEST, COMM_RELAY_MISSION_REQUEST_REP, MISSION_REQUEST_DATA, MISSION_REQUEST_DATA_UI,
    ID_TYPE, LAST_ACTION, MISSION_TYPE, MISSION_STATUS_UI

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from './missionRequest';

export class CommRelayMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.CommRelay;
    commRelayMissionRequest: COMM_RELAY_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: COMM_RELAY_MISSION_REQUEST) => {
        this.commRelayMissionRequest = data;
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
            commRelayMissionRequest: this.commRelayMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            commRelayMissionRequest: this.commRelayMissionRequest,
        };
    };

    public toJsonForRep = (): COMM_RELAY_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            commRelayMissionRequest: this.commRelayMissionRequest,
        };
    };

    public toJsonForTMM = (): COMM_RELAY_MISSION_REQUEST => {
        return this.commRelayMissionRequest;
    };


    saveConfig = {
        ...this.saveConfigCommon,
        commRelayMissionRequest: this.setMissionRequest,
    };


}
