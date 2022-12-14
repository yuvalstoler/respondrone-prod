import {
    CHAT_GROUP,
    COMMENT,
    GEOGRAPHIC_INSTRUCTION,
    GEOGRAPHIC_INSTRUCTION_TYPE,
    ID_TYPE,
    MAP,
    PRIORITY,
    TASK_ACTION,
    TASK_DATA,
    TASK_DATA_UI,
    TASK_STATUS,
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
    taskActionByUser: MAP<TASK_ACTION> = {};
    chatGroup: CHAT_GROUP;

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

    private setChatGroup = (data: CHAT_GROUP) => {
        this.chatGroup = data;
    }

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

    private getGeoInstructionsForMobile = (): GEOGRAPHIC_INSTRUCTION[] => {
        return this.geographicInstructions.map((obj: GEOGRAPHIC_INSTRUCTION) => {
            const geoInstruction = Object.assign({}, obj);
            if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.address) {
                geoInstruction.type = GEOGRAPHIC_INSTRUCTION_TYPE.point;
            }
            return geoInstruction;
        });
    }

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
            isSendToMobile: this.isSendToMobile,
            taskActionByUser: this.taskActionByUser,
            chatGroup: this.chatGroup
        };
    };

    public toJsonForMobile = (): TASK_DATA => {
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
            geographicInstructions: this.getGeoInstructionsForMobile(),
            assigneeIds: this.assigneeIds,
            comments: this.comments,
            idView: this.idView,
            isSendToMobile: this.isSendToMobile,
            taskActionByUser: this.taskActionByUser,
            chatGroup: this.chatGroup
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
            taskActionByUser: this.taskActionByUser,
            chatGroup: this.chatGroup,
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
        chatGroup: this.setChatGroup,
        isSendToMobile: this.setIsSendToMobile,
    };

}
