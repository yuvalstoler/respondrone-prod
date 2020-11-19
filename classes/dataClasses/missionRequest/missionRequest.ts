import {
    COMMENT, MISSION_ACTION_OPTIONS,
    ID_TYPE, LAST_ACTION, MISSION_REQUEST_DATA, MISSION_STATUS_UI, MISSION_TYPE, SOURCE_TYPE
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
    uiText: {key: string}[] = []
    actionOptions: MISSION_ACTION_OPTIONS

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

    public toJsonForSave;
    public toJsonForUI;
    public toJsonForRep;
    public toJsonForTMM;
    public setValues;
    missionType;

}
