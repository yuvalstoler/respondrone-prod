import {
    CONNECTION_STATUS,
    EVENT_DATA,
    GEOPOINT3D, GROUND_RESOURCE_DATA, GROUND_RESOURCE_DATA_UI, GROUND_RESOURCE_TYPE,
    ID_TYPE,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class GroundResource {

    id: ID_TYPE;
    time: number;
    type: GROUND_RESOURCE_TYPE;
    connectionStatus: CONNECTION_STATUS;
    name: string
    location: GEOPOINT3D;

    constructor(data: GROUND_RESOURCE_DATA) {
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

    private setType = (data: GROUND_RESOURCE_TYPE) => {
        this.type = data;
    };
    private setConnectionStatus = (data: CONNECTION_STATUS) => {
        this.connectionStatus = data;
    };
    private setName = (data: string) => {
        this.name = data;
    };

    private setLocation = (data: GEOPOINT3D) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS
        if ( res ) {
            this.location = data;
        }
    };


    public setValues = (data: Partial<GROUND_RESOURCE_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJsonForSave = (): GROUND_RESOURCE_DATA => {
        return {
            id: this.id,
            time: this.time,
            type: this.type,
            connectionStatus: this.connectionStatus,
            name: this.name,
            location: this.location,
        };
    };


    public toJsonForUI = (): GROUND_RESOURCE_DATA_UI => {
        return {
            id: this.id,
            time: this.time,
            type: this.type,
            connectionStatus: this.connectionStatus,
            name: this.name,
            location: this.location,
        };
    };

    saveConfig = {
        id: this.setId,
        time: this.setTime,
        type: this.setType,
        connectionStatus: this.setConnectionStatus,
        name: this.setName,
        location: this.setLocation,
    };


}
