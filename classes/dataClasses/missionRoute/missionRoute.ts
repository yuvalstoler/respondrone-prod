import {
    ID_TYPE,
    MISSION_TYPE,
    MISSION_STATUS,
    LAST_ACTION,
    MISSION_MAP_OVERLAY,
    MISSION_DATA,
    MISSION_DATA_MD,
    MISSION_DATA_UI,
    PointOfRoute,
    ROUTE_STATUS,
    MISSION_ROUTE_DATA_UI,
    MISSION_ROUTE_DATA_MD,
    MISSION_ROUTE_DATA,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class MissionRoute {

    id: ID_TYPE;
    lastAction: LAST_ACTION;
    version: number;

    requestId: ID_TYPE;
    missionId: ID_TYPE;
    missionType: MISSION_TYPE;
    route: PointOfRoute[];
    status: ROUTE_STATUS;

    modeDefine: MISSION_ROUTE_DATA_MD;

    constructor(data: MISSION_ROUTE_DATA) {
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
    private setMissionId = (data: ID_TYPE) => {
        this.requestId = data;
    };
    private setMissionType = (data: MISSION_TYPE) => {
        this.missionType = data;
    };
    private setRoute = (data: PointOfRoute[]) => {
        this.route = data;
    };
    private setStatus = (data: ROUTE_STATUS) => {
        this.status = data;
    };


    public setValues = (data: Partial<MISSION_ROUTE_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJson = (): MISSION_ROUTE_DATA => {
        return {
            id: this.id,
            lastAction: this.lastAction,
            version: this.version,
            requestId: this.requestId,
            missionId: this.missionId,
            missionType: this.missionType,
            route: this.route,
            status: this.status
        };
    };

    public toJsonForUI = (): MISSION_ROUTE_DATA_UI => {
        return {
            id: this.id,
            lastAction: this.lastAction,
            version: this.version,
            requestId: this.requestId,
            missionId: this.missionId,
            missionType: this.missionType,
            route: this.route,
            status: this.status,
            modeDefine: this.modeDefine
        };
    };

    saveConfig = {
        id: this.setId,
        lastAction: this.setLastAction,
        version: this.setVersion,
        requestId: this.setRequestId,
        missionId: this.setMissionId,
        missionType: this.setMissionType,
        route: this.setRoute,
        status: this.setStatus,
    };


}
