import {
    SCAN_MISSION_REQUEST,
    SCAN_MISSION_REQUEST_REP,
    ID_TYPE,
    LAST_ACTION,
    MISSION_TYPE, MISSION_REQUEST_DATA, MISSION_REQUEST_DATA_UI, OBSERVATION_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from "./missionRequest";

export class ScanMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.Scan;
    scanMissionRequest: SCAN_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: SCAN_MISSION_REQUEST) => {
        this.scanMissionRequest = data;
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
            scanMissionRequest: this.scanMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            scanMissionRequest: this.scanMissionRequest,
        };
    };

    public toJsonForRep = (): SCAN_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            scanMissionRequest: this.scanMissionRequest,
        };
    };

    public toJsonForTMM = (): SCAN_MISSION_REQUEST => {
        return this.scanMissionRequest;
    };


    saveConfig = {
        ...this.saveConfigCommon,
        scanMissionRequest: this.setMissionRequest,
    };


}
