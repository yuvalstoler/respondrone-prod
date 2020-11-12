import {
    ID_TYPE,
    MISSION_TYPE,
    MISSION_STATUS,
    LAST_ACTION,
    MISSION_MAP_OVERLAY,
    MISSION_DATA, MISSION_DATA_MD, MISSION_DATA_UI,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class Mission {

    id: ID_TYPE;
    lastAction: LAST_ACTION;
    version: number;

    requestId: ID_TYPE;
    missionType: MISSION_TYPE;
    missionMapOverlay: MISSION_MAP_OVERLAY;
    status: MISSION_STATUS;
    description: string;

    modeDefine: MISSION_DATA_MD;


    constructor(data: MISSION_DATA) {
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }

    private setId = (data: any) => {
        if ( data !== undefined ) {
            const res: boolean = typeof data === 'string' || data instanceof String;
            if ( res ) {
                this.id = data;
            }
        }
    };
    private setLastAction = (data: LAST_ACTION) => {
        this.lastAction = data;
    };
    private setVersion = (data: number) => {
        this.version = data;
    };

    private setRequestId = (data: ID_TYPE) => {
        this.requestId = data;
    };
    private setMissionType = (data: MISSION_TYPE) => {
        this.missionType = data;
    };
    private setMissionMapOverlay = (data: MISSION_MAP_OVERLAY) => {
        // TODO??
        data.areas.forEach((area) => {
            if ((area.coordinates[0].lat !== area.coordinates[area.coordinates.length - 1].lat)
                || (area.coordinates[0].lon !== area.coordinates[area.coordinates.length - 1].lon)) {
                area.coordinates.push(area.coordinates[0])
            }
        })
        this.missionMapOverlay = data;
    };
    private setStatus = (data: MISSION_STATUS) => {
        this.status = data;
    };
    private setDescription = (data: string) => {
        this.description = data;
    };

    public setValues = (data: Partial<MISSION_DATA>, saveConfig: Object = this.saveConfig) => {
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



    public toJson = (): MISSION_DATA => {
        return {
            id: this.id,
            requestId: this.requestId,
            missionType: this.missionType,
            missionMapOverlay: this.missionMapOverlay,
            status: this.status,
            description: this.description,
            lastAction: this.lastAction,
            version: this.version,
        };
    };

    public toJsonForUI = (): MISSION_DATA_UI => {
        return {
            id: this.id,
            requestId: this.requestId,
            missionType: this.missionType,
            missionMapOverlay: this.missionMapOverlay,
            status: this.status,
            description: this.description,
            lastAction: this.lastAction,
            version: this.version,
            modeDefine: this.modeDefine,
        };
    };

    saveConfig = {
        id: this.setId,
        requestId: this.setRequestId,
        missionType: this.setMissionType,
        missionMapOverlay: this.setMissionMapOverlay,
        status: this.setStatus,
        description: this.setDescription,
        lastAction: this.setLastAction,
        version: this.setVersion,
    };


}
