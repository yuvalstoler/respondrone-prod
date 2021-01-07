import {
    FR_STATUS,
    EVENT_DATA,
    FR_TYPE,
    ID_TYPE,
    TIMESTAMP,
    FR_DATA_MD,
    FR_DATA_REP,
    GIMBAL_PARAMS,
    VISIBLE_CAMERA_PARAMS,
    INFRARED_CAMERA_PARAMS,
    GIMBAL_DATA, GEOPOINT3D_SHORT, GIMBAL_DATA_UI, GIMBAL_CONTROL,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class Gimbal {

    id: ID_TYPE;
    droneId: ID_TYPE;
    AIMode: number;
    gimbalParameters: GIMBAL_PARAMS;
    visibleCameraParameters: VISIBLE_CAMERA_PARAMS;
    infraredCameraParameters: INFRARED_CAMERA_PARAMS;
    trackedEntity: number;
    cameraLookAtPoint: GEOPOINT3D_SHORT;
    cameraFootprint: {coordinates: GEOPOINT3D_SHORT[]};
    opticalVideoURL: string;
    infraredVideoURL: string;

    controlData?: GIMBAL_CONTROL;


    constructor(data: GIMBAL_DATA) {
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

    private setDroneId = (data: any) => {
        this.droneId = data;
    };
    private setAIMode = (data: any) => {
        this.AIMode = data;
    };
    private setGimbalParameters = (data: any) => {
        this.gimbalParameters = data;
    };
    private setVisibleCameraParameters = (data: any) => {
        this.visibleCameraParameters = data;
    };
    private setInfraredCameraParameters = (data: any) => {
        this.infraredCameraParameters = data;
    };
    private setTrackedEntity = (data: any) => {
        this.trackedEntity = data;
    };
    private setCameraLookAtPoint = (data: any) => {
        this.cameraLookAtPoint = data;
    };
    private setCameraFootprint = (data: any) => {
        this.cameraFootprint = data;
    };
    private setOpticalVideoURL = (data: any) => {
        this.opticalVideoURL = data;
    };
    private setInfraredVideoURL = (data: any) => {
        this.infraredVideoURL = data;
    };
    private setControlData = (data: any) => {
        this.controlData = data;
    };



    public setValues = (data: Partial<GIMBAL_DATA>, saveConfig: Object = this.saveConfig) => {
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



    public toJsonForUI = (): GIMBAL_DATA_UI => {
        return {
            id: this.id,
            droneId: this.droneId,
            AIMode: this.AIMode,
            gimbalParameters: this.gimbalParameters,
            visibleCameraParameters: this.visibleCameraParameters,
            infraredCameraParameters: this.infraredCameraParameters,
            trackedEntity: this.trackedEntity,
            cameraLookAtPoint: this.cameraLookAtPoint,
            cameraFootprint: this.cameraFootprint,
            opticalVideoURL: this.opticalVideoURL,
            infraredVideoURL: this.infraredVideoURL,

            controlData: this.controlData,
            modeDefine: undefined,
            lineFromAirVehicle: undefined,
        };
    };

    saveConfig = {
        id: this.setId,
        droneId: this.setDroneId,
        AIMode: this.setAIMode,
        gimbalParameters: this.setGimbalParameters,
        visibleCameraParameters: this.setVisibleCameraParameters,
        infraredCameraParameters: this.setInfraredCameraParameters,
        trackedEntity: this.setTrackedEntity,
        cameraLookAtPoint: this.setCameraLookAtPoint,
        cameraFootprint: this.setCameraFootprint,
        opticalVideoURL: this.setOpticalVideoURL,
        infraredVideoURL: this.setInfraredVideoURL,

        controlData: this.setControlData,
    };


}
