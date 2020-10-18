import {
    ADDRESS,
    GEOPOINT3D,
    ID_TYPE,
    TASK_DATA,
    TASK_STATUS,
    TASK_TYPE
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Task {

    id: ID_TYPE;
    type: TASK_TYPE;
    time: number;
    description: string = '';
    location: GEOPOINT3D;
    address: ADDRESS;
    reportIds: string[] = [];
    eventIds: string[] = [];
    status: TASK_STATUS;
    commentIds: string[];

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

    private setType = (data: TASK_TYPE) => {
        this.type = data;
    };
    private setTime = (data: number) => {
        this.time = data;
    };

    private setDescription = (data: any) => {
        const res: boolean = typeof data === 'string' || data instanceof String;
        if ( res ) {
            this.description = data;
        }
    };
    private setLocation = (data: GEOPOINT3D) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS_GEOPOINT
        if ( res ) {
            this.location = data;
        }
    };
    private setAddress = (data: ADDRESS) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS_GEOPOINT
        if ( res ) {
            this.address = data;
        }
    };

    private setReportIds = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.reportIds = data;
        }
    };

    private setEventIds = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.eventIds = data;
        }
    };
    private setStatus = (data: TASK_STATUS) => {
        this.status = data;
    };
    private setComments = (data: string[]) => {
        this.commentIds = data;
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
            type: this.type,
            time: this.time,
            description: this.description,
            location: this.location,
            address: this.address,
            reportIds: this.reportIds,
            eventIds: this.eventIds,
            status: this.status,
            commentIds: this.commentIds,
        };
    };

    saveConfig = {
        id: this.setId,
        type: this.setType,
        time: this.setTime,
        description: this.setDescription,
        location: this.setLocation,
        address: this.setAddress,
        reportIds: this.setReportIds,
        eventIds: this.setEventIds,
        status: this.setStatus,
        comments: this.setComments,
    };


}
