import {
    FR_STATUS,
    EVENT_DATA,
    GEOPOINT3D_SHORT, FR_DATA, FR_DATA_UI, FR_TYPE,
    ID_TYPE, TIMESTAMP, FR_DATA_MD, FR_DATA_REP,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class FR {

    id: ID_TYPE;
    callSign: string;
    type: FR_TYPE;
    location: GEOPOINT3D_SHORT;
    lastUpdated: TIMESTAMP;
    online: boolean;
    status: FR_STATUS;
    modeDefine: FR_DATA_MD;


    constructor(data: FR_DATA) {
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

    private setLastUpdated = (data: TIMESTAMP) => {
        this.lastUpdated = data;
    };
    private setOnline = (data: boolean) => {
        this.online = data;
    };
    private setType = (data: FR_TYPE) => {
        this.type = data;
    };
    private setStatus = (data: FR_STATUS) => {
        this.status = data;
    };
    private setCallsign = (data: string) => {
        this.callSign = data;
    };
    private setLocation = (data: GEOPOINT3D_SHORT) => {
        const res: boolean = true; // todo validate GEOPOINT3D_SHORT | ADDRESS
        if ( res ) {
            this.location = data;
        }
    };


    public setValues = (data: Partial<FR_DATA>, saveConfig: Object = this.saveConfig) => {
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


    public toJsonForRepository = (): FR_DATA_REP => {
        return {
            id: this.id,
            callSign: this.callSign,
            type: this.type,
            location: this.location,
            lastUpdated: this.lastUpdated,
            online: this.online,
            status: this.status,
        };
    };


    public toJsonForUI = (): FR_DATA_UI => {
        return {
            id: this.id,
            callSign: this.callSign,
            type: this.type,
            location: this.location,
            lastUpdated: this.lastUpdated,
            online: this.online,
            status: this.status,
            modeDefine: this.modeDefine,
        };
    };

    saveConfig = {
        id: this.setId,
        callSign: this.setCallsign,
        type: this.setType,
        location: this.setLocation,
        lastUpdated: this.setLastUpdated,
        online: this.setOnline,
        status: this.setStatus,
    };


}
