import {
    ID_TYPE,
    LAST_ACTION,
    GEOPOINT3D_SHORT,
    NFZ_DATA_UI, NFZ_DATA,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class NFZ {

    id: ID_TYPE;
    lastAction: LAST_ACTION;
    version: number;

    name: string;
    polygon: {coordinates: GEOPOINT3D_SHORT[]};
    minAlt: number;
    maxAlt: number;


    constructor(data: NFZ_DATA) {
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
    };

    private setLastAction = (data: LAST_ACTION) => {
        this.lastAction = data;
    };
    private setVersion = (data: number) => {
        this.version = data;
    };
    private setName = (data: any) => {
        this.name = data;
    };
    private setPolygon = (data: any) => {
        this.polygon = data;
    };
    private setMinAlt = (data: any) => {
        this.minAlt = data;
    };
    private setMaxAlt = (data: any) => {
        this.maxAlt = data;
    };

    public setValues = (data: Partial<NFZ_DATA>, saveConfig: Object = this.saveConfig) => {
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



    public toJson = (): NFZ_DATA => {
        return {
            id: this.id,
            name: this.name,
            polygon: this.polygon,
            minAlt: this.minAlt,
            maxAlt: this.maxAlt,
            lastAction: this.lastAction,
            version: this.version,
        };
    };

    public toJsonForUI = (): NFZ_DATA_UI => {
        return {
            id: this.id,
            name: this.name,
            polygon: this.polygon,
            minAlt: this.minAlt,
            maxAlt: this.maxAlt,
            lastAction: this.lastAction,
            version: this.version,
            modeDefine: undefined
        };
    };

    saveConfig = {
        id: this.setId,
        name: this.setName,
        polygon: this.setPolygon,
        minAlt: this.setMinAlt,
        maxAlt: this.setMaxAlt,
        lastAction: this.setLastAction,
        version: this.setVersion,
    };


}
