import {
    COMMENT,
    MISSION_ACTION_OPTIONS,
    ID_TYPE,
    LAST_ACTION,
    MISSION_REQUEST_DATA,
    MISSION_STATUS_UI,
    MISSION_TYPE,
    SOURCE_TYPE,
    MISSION_REQUEST_DATA_UI,
    REP_ENTITY
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class MissionRequest {

    id: ID_TYPE;
    version: number;
    lastAction: LAST_ACTION;

    source: SOURCE_TYPE;
    description: string = '';
    comments: COMMENT[] = [];
    createdBy: string;
    time: number;
    idView: string;
    missionStatus: MISSION_STATUS_UI;

    createdById: ID_TYPE;

    constructor() {
    }

    protected setId = (data: ID_TYPE | any) => {
        if ( data !== undefined ) {
            const res: boolean = typeof data === 'string' || data instanceof String;
            if ( res ) {
                this.id = data;
            }
        }
        else {
            this.id = DataUtility.generateID();
        }
    };

    protected setVersion = (data: number) => {
        this.version = data;
    };


    protected setLastAction = (data: LAST_ACTION) => {
        this.lastAction = data;
    };

    protected setDescription = (data: any) => {
        const res: boolean = typeof data === 'string' || data instanceof String;
        if ( res ) {
            this.description = data;
        }
    };

    protected setComments = (data: COMMENT[]) => {
        this.comments = data;
    };

    protected setTime = (data: any) => {
        this.time = data;
    };

    protected setIdView = (data: string) => {
        this.idView = data;
    };

    protected setCreatedBy = (data: string) => {
        this.createdBy = data;
    };

    protected setMissionStatus = (data: MISSION_STATUS_UI) => {
        this.missionStatus = data;
    };

    protected setSource = (data: SOURCE_TYPE) => {
        this.source = data;
    };

    protected setCreatedById = (data: ID_TYPE) => {
        this.createdById = data;
    };

    public toJsonForSaveCommon = (): MISSION_REQUEST_DATA => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,

            createdById: this.createdById,
        };
    };

    public toJsonForUICommon = (): MISSION_REQUEST_DATA_UI => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,
            modeDefine: undefined,
        };
    }

    public toJsonForRepCommon = (): REP_ENTITY => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
        };
    };

    saveConfigCommon = {
        id: this.setId,
        version: this.setVersion,
        lastAction: this.setLastAction,

        description: this.setDescription,
        comments: this.setComments,
        time: this.setTime,
        idView: this.setIdView,
        createdBy: this.setCreatedBy,
        source: this.setSource,
        missionStatus: this.setMissionStatus,

        createdById: this.setCreatedById
    };


    public toJsonForSave;
    public toJsonForUI;
    public toJsonForRep;
    public toJsonForTMM;
    public setValues;
    missionType;

}
