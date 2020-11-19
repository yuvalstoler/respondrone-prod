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
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            scanMissionRequest: this.scanMissionRequest,

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
            scanMissionRequest: this.scanMissionRequest,

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
                    value: '' + this.scanMissionRequest.droneId
                },
                {
                    title: 'Scan angle',
                    value: '' + this.scanMissionRequest.scanAngle
                },
                {
                    title: 'Scan speed',
                    value: '' + this.scanMissionRequest.scanSpeed
                },
                {
                    title: 'Overlap percent',
                    value: '' + this.scanMissionRequest.overlapPercent
                },
                {
                    title: 'Camera FOV',
                    value: '' + this.scanMissionRequest.cameraFOV
                }
            ]
        };
    };

    public toJsonForRep = (): SCAN_MISSION_REQUEST_REP => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            scanMissionRequest: this.scanMissionRequest,
        };
    };

    public toJsonForTMM = (): SCAN_MISSION_REQUEST => {
        return this.scanMissionRequest;
    };


    saveConfig = {
        id: this.setId,
        version: this.setVersion,
        lastAction: this.setLastAction,
        scanMissionRequest: this.setMissionRequest,

        description: this.setDescription,
        comments: this.setComments,
        time: this.setTime,
        idView: this.setIdView,
        createdBy: this.setCreatedBy,
        source: this.setSource,
        missionStatus: this.setMissionStatus,
    };


}
