import {
    ADDRESS_GEOPOINT, EVENT_DATA, EVENT_DATA_UI, EVENT_TYPE,
    GEOPOINT3D, LINKED_EVENT_DATA, LOCATION_TYPE, POLYGON_GEOPOINT,
    PRIORITY,
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Event {

    id: string = '';
    time: number;
    createdBy: string
    title: string;
    type: EVENT_TYPE;
    priority: PRIORITY;
    description: string = '';
    locationType: LOCATION_TYPE = LOCATION_TYPE.none;
    location: GEOPOINT3D | ADDRESS_GEOPOINT | POLYGON_GEOPOINT;
    reportIds: string[] = [];
    commentIds: string[] = [];

    constructor(data: EVENT_DATA) {
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

    private setTime = (data: number) => {
        this.time = data;
    };
    private setCreatedBy = (data: string) => {
        this.createdBy = data;
    };
    private setType = (data: EVENT_TYPE) => {
        this.type = data;
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

    private setLocationType = (data: LOCATION_TYPE) => {
        const res: boolean = LOCATION_TYPE[data] !== undefined;
        if ( res ) {
            this.locationType = data;
        }
    };
    private setLocation = (data: GEOPOINT3D | ADDRESS_GEOPOINT | POLYGON_GEOPOINT) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS_GEOPOINT
        if ( res ) {
            this.location = data;
        }
    };

    private setReports = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.reportIds = data;
        }
    };
    private setComments = (data: string[]) => {
        this.commentIds = data;
    };
    public setValues = (data: Partial<EVENT_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJsonForSave = (): EVENT_DATA => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            title: this.title,
            type: this.type,
            priority: this.priority,
            description: this.description,
            locationType: this.locationType,
            location: this.location,
            reportIds: this.reportIds,
            commentIds: this.commentIds,
        };
    };

    public toJsonLinked = (): LINKED_EVENT_DATA => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            type: this.type,
            description: this.description,
        };
    };

    public toJsonForUI = (): EVENT_DATA_UI => {
        return {
            id: this.id,
            time: this.time,
            createdBy: this.createdBy,
            title: this.title,
            type: this.type,
            priority: this.priority,
            description: this.description,
            locationType: this.locationType,
            location: this.location,
            reportIds: this.reportIds,
            commentIds: this.commentIds,

            reports: [],
            comments: [
                {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
                {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
                {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
            ],
            modeDefine: undefined
        };
    };

    saveConfig = {
        id: this.setId,
        time: this.setTime,
        createdBy: this.setCreatedBy,
        type: this.setType,
        priority: this.setPriority,
        description: this.setDescription,
        locationType: this.setLocationType,
        location: this.setLocation,
        reportIds: this.setReports,
        commentIds: this.setComments,
    };


}
