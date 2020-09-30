import {
    ADDRESS_GEOPOINT,
    GEOPOINT3D,
    REPORT_DATA
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Report {

    id: string = '';
    type: string = '';
    description: string = '';
    location: GEOPOINT3D | ADDRESS_GEOPOINT;
    media: string[] = [];
    events: string[] = [];

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

    private setType = (data: string) => {
        this.type = data;
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
            this.media = data;
        }
    };
    private setEvents = (data: string[]) => {
        const res: boolean = Array.isArray(data);// || todo validate array of strings
        if ( res ) {
            this.events = data;
        }
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
            type: this.type,
            description: this.description,
            location: this.location,
            media: this.media,
            events: this.events,

        };
    };

    saveConfig = {
        id: this.setId,
        type: this.setType,
        description: this.setDescription,
        location: this.setLocation,
        media: this.setMedia,
        events: this.setEvents,

    };


}
