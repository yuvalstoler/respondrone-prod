import {
    ADDRESS,
    COMMENT, FR_STATUS, FR_TYPE,
    GEOGRAPHIC_INSTRUCTION,
    GEOPOINT3D,
    ID_TYPE,
    PRIORITY,
    TASK_DATA,
    TASK_DATA_UI,
    TASK_STATUS,
    TASK_TYPE, TIMESTAMP,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class Task {

    id: ID_TYPE;
    time: number;
    createdBy: string;
    title: string;
    type: string; // TASK_TYPE;
    priority: PRIORITY;
    description: string = '';
    resources: string = '';
    status: TASK_STATUS = TASK_STATUS.pending;
    geographicInstructions: GEOGRAPHIC_INSTRUCTION[] = [];
    assigneeIds: string[] = [];
    comments: COMMENT[] = [];
    idView: string = '';
    isSendToMobile: boolean = false;

    constructor(data: TASK_DATA) {
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }

    private setId = (data: ID_TYPE | any) => {
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

    private setTime = (data: number) => {
        this.time = data;
    };
    private setCreatedBy = (data: string) => {
        this.createdBy = data;
    };
    private setType = (data: string /*TASK_TYPE*/) => {
        this.type = data;
    };
    private setTitle = (data: string) => {
        this.title = data;
    };
    private setPriority = (data: PRIORITY) => {
        this.priority = data;
    };

    private setDescription = (data: any) => {
        const res: boolean = typeof data === 'string' || data instanceof String;
        if ( res ) {
            this.description = data;
        }
    };
    private setIsSendToMobile = (data: boolean) => {
        this.isSendToMobile = data;
    };

    private setResources = (data: any) => {
        const res: boolean = typeof data === 'string' || data instanceof String;
        if ( res ) {
            this.resources = data;
        }
    };

    private setStatus = (data: TASK_STATUS) => {
        this.status = data;
    };

    private setGeographicInstructions = (data: GEOGRAPHIC_INSTRUCTION[]) => {
        this.geographicInstructions = data;
    };

    private setAssigneeIds = (data: ID_TYPE[]) => {
        const res: boolean = Array.isArray(data)
        if ( res ) {
            this.assigneeIds = data;
        }
    };

    private setComments = (data: COMMENT[]) => {
        this.comments = data;
    };
    private setIdView = (data: string) => {
        this.idView = data;
    };

    public setValues = (data: Partial<TASK_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJsonForSave = (): TASK_DATA => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            title: this.title,
            type: this.type,
            priority: this.priority,
            description: this.description,
            resources: this.resources,
            status: this.status,
            geographicInstructions: this.geographicInstructions,
            assigneeIds: this.assigneeIds,
            comments: this.comments,
            idView: this.idView,
            isSendToMobile: this.isSendToMobile
        };
    };


    public toJsonForUI = (): TASK_DATA_UI => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            title: this.title,
            type: this.type,
            priority: this.priority,
            description: this.description,
            resources: this.resources,
            status: this.status,
            geographicInstructions: this.geographicInstructions,
            assigneeIds: this.assigneeIds,
            comments: this.comments,
            idView: this.idView,
            modeDefine: undefined,
            isSendToMobile: this.isSendToMobile,

            assignees: []
        };
    };

    saveConfig = {
        id: this.setId,
        time: this.setTime,
        createdBy: this.setCreatedBy,
        title: this.setTitle,
        type: this.setType,
        priority: this.setPriority,
        description: this.setDescription,
        resources: this.setResources,
        status: this.setStatus,
        geographicInstructions: this.setGeographicInstructions,
        assigneeIds: this.setAssigneeIds,
        comments: this.setComments,
        idView: this.setIdView,
        isSendToMobile: this.setIsSendToMobile,
    };

}
