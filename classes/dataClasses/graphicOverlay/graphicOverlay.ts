import {
    ID_TYPE,
    LAST_ACTION,
    MISSION_MAP_OVERLAY,
    MISSION_DATA,
    MISSION_DATA_MD,
    MISSION_DATA_UI,
    GEOPOINT3D_SHORT,
    GRAPHIC_OVERLAY_COLOR,
    GRAPHIC_OVERLAY_TYPE,
    GRAPHIC_OVERLAY_DATA_UI, TIMESTAMP, GRAPHIC_OVERLAY_DATA, METADATA_OBJ,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class GraphicOverlay {

    id: ID_TYPE;
    lastAction: LAST_ACTION;
    version: number;

    name: string;
    shape: GEOPOINT3D_SHORT | {coordinates: GEOPOINT3D_SHORT[]};
    color: GRAPHIC_OVERLAY_COLOR;
    type: GRAPHIC_OVERLAY_TYPE;
    metadata: METADATA_OBJ[];
    creationTime: TIMESTAMP;
    lastUpdateTime: TIMESTAMP;


    constructor(data: GRAPHIC_OVERLAY_DATA) {
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
    private setShape = (data: any) => {
        this.shape = data;
    };
    private setColor = (data: any) => {
        this.color = data;
    };
    private setType = (data: any) => {
        this.type = data;
    };
    private setMetadata = (data: any) => {
        this.metadata = data;
    };
    private setCreationTime = (data: any) => {
        this.creationTime = data;
    };
    private setLastUpdateTime = (data: any) => {
        this.lastUpdateTime = data;
    };

    public setValues = (data: Partial<MISSION_DATA>, saveConfig: Object = this.saveConfig) => {
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



    public toJson = (): GRAPHIC_OVERLAY_DATA => {
        return {
            id: this.id,
            name: this.name,
            shape: this.shape,
            color: this.color,
            type: this.type,
            metadata: this.metadata,
            creationTime: this.creationTime,
            lastUpdateTime: this.lastUpdateTime,
            lastAction: this.lastAction,
            version: this.version,
        };
    };

    public toJsonForUI = (): GRAPHIC_OVERLAY_DATA_UI => {
        return {
            id: this.id,
            name: this.name,
            shape: this.shape,
            color: this.color,
            type: this.type,
            metadata: this.metadata,
            creationTime: this.creationTime,
            lastUpdateTime: this.lastUpdateTime,
            lastAction: this.lastAction,
            version: this.version,
            modeDefine: undefined
        };
    };

    saveConfig = {
        id: this.setId,
        name: this.setName,
        shape: this.setShape,
        color: this.setColor,
        type: this.setType,
        metadata: this.setMetadata,
        creationTime: this.setCreationTime,
        lastUpdateTime: this.setLastUpdateTime,
        lastAction: this.setLastAction,
        version: this.setVersion,
    };


}
