import {
    ADDRESS_GEOPOINT,
    GEOPOINT3D,
    PRIORITY,
    REPORT_DATA,
    REPORT_TYPE
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Report {

    id: string = '';
    type: REPORT_TYPE;
    source: string;
    time: number;
    createdBy: string
    priority: PRIORITY;
    description: string = '';
    location: GEOPOINT3D | ADDRESS_GEOPOINT;
    mediaIds: string[] = [];
    eventIds: string[] = [];
    commentIds: string[];

    constructor(data: REPORT_DATA) {
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
        else {
            this.id = DataUtility.generateID();
        }
    };

    private setType = (data: REPORT_TYPE) => {
        this.type = data;
    };
    private setSource = (data: string) => {
        this.source = data;
    };
    private setTime = (data: number) => {
        this.time = data;
    };
    private setCreatedBy = (data: string) => {
        this.createdBy = data;
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
    private setLocation = (data: GEOPOINT3D | ADDRESS_GEOPOINT) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS_GEOPOINT
        if ( res ) {
            this.location = data;
        }
    };

    private setMedia = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.mediaIds = data;
        }
    };
    private setEvents = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.eventIds = data;
        }
    };
    private setComments = (data: string[]) => {
        this.commentIds = data;
    };
    public setValues = (data: Partial<REPORT_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJsonForSave = (): REPORT_DATA => {
        return {
            id: this.id,
            source: this.source,
            time: this.time,
            createdBy: this.createdBy,
            type: this.type,
            priority: this.priority,
            description: this.description,
            location: this.location,
            mediaIds: this.mediaIds,
            eventIds: this.eventIds,

        };
    };

    saveConfig = {
        id: this.setId,
        type: this.setType,
        source: this.setSource,
        time: this.setTime,
        createdBy: this.setCreatedBy,

        priority: this.setPriority,
        description: this.setDescription,
        location: this.setLocation,
        media: this.setMedia,
        events: this.setEvents,
        comments: this.setComments,
    };


}
