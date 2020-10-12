import {
    COMMENT,
    GEOPOINT3D,
    ID_TYPE,
    LINKED_REPORT_DATA,
    LOCATION_TYPE,
    FILE_FS_DATA,
    PRIORITY,
    REPORT_DATA,
    REPORT_DATA_UI,
    REPORT_TYPE,
    SOURCE_TYPE,
    ADDRESS,
    MAP
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Report {

    id: ID_TYPE;
    type: REPORT_TYPE;
    source: SOURCE_TYPE;
    time: number;
    createdBy: string;
    priority: PRIORITY;
    description: string = '';
    locationType: LOCATION_TYPE = LOCATION_TYPE.none;
    location: GEOPOINT3D;
    address: ADDRESS;
    media: FILE_FS_DATA[] = [];
    mediaFileIds: MAP<boolean> = {};
    eventIds: string[] = [];
    comments: COMMENT[] = [];

    constructor(data: REPORT_DATA) {
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

    private setType = (data: REPORT_TYPE) => {
        this.type = data;
    };
    private setSource = (data: SOURCE_TYPE) => {
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
    private setLocation = (data: GEOPOINT3D) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS
        if ( res ) {
            this.location = data;
        }
    };

    private setAddress = (data: ADDRESS) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS
        if ( res ) {
            this.address = data;
        }
    };

    private setLocationType = (data: LOCATION_TYPE) => {
        const res: boolean = LOCATION_TYPE[data] !== undefined;
        if ( res ) {
            this.locationType = data;
        }
    };

    private setMedia = (data: FILE_FS_DATA[] = []) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.media = data;
        }
    };
    private setMediaFileIds = (data: MAP<boolean> = {}) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.mediaFileIds = data;
        }
    };
    private setEvents = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.eventIds = data;
        }
    };
    private setComments = (data: COMMENT[]) => {
        this.comments = data;
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
            locationType: this.locationType,
            location: this.location,
            address: this.address,
            media: this.media,
            mediaFileIds: this.mediaFileIds,
            eventIds: this.eventIds,
            comments: this.comments,
        };
    };

    public toJsonForUI = (): REPORT_DATA_UI => {
        return {
            id: this.id,
            source: this.source,
            time: this.time,
            createdBy: this.createdBy,
            type: this.type,
            priority: this.priority,
            description: this.description,
            locationType: this.locationType,
            location: this.location,
            address: this.address,
            media: this.media,
            mediaFileIds: this.mediaFileIds,
            eventIds: this.eventIds,
            comments: this.comments,
            events: [],
            modeDefine: undefined
        };
    };

    public toJsonLinked = (): LINKED_REPORT_DATA => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            type: this.type,
            description: this.description,
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
        locationType: this.setLocationType,
        location: this.setLocation,
        address: this.setAddress,
        media: this.setMedia,
        mediaFileIds: this.setMediaFileIds,
        eventIds: this.setEvents,
        comments: this.setComments,
    };


}
