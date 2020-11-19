import {
    COMM_RELAY_MISSION_REQUEST_REP,
    DELIVERY_MISSION_REQUEST,
    DELIVERY_MISSION_REQUEST_REP, MISSION_REQUEST_DATA_UI,
    ID_TYPE,
    LAST_ACTION, MISSION_REQUEST_DATA,
    MISSION_TYPE, COMM_RELAY_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from "./missionRequest";

export class DeliveryMissionRequest extends MissionRequest {

    missionType: MISSION_TYPE = MISSION_TYPE.Delivery;
    deliveryMissionRequest: DELIVERY_MISSION_REQUEST;

    constructor(data: MISSION_REQUEST_DATA) {
        super();
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }


    private setMissionRequest = (data: DELIVERY_MISSION_REQUEST) => {
        this.deliveryMissionRequest = data;
    };

    public setValues = (data: Partial<MISSION_REQUEST_DATA>, saveConfig: Object = this.saveConfig) => {
        for ( const key in saveConfig ) {
            if ( saveConfig.hasOwnProperty(key) ) {
                if ( data.hasOwnProperty(key) ) {
                    if ( data[key] !== undefined ) {
                        if ( data !== undefined ) {
                            saveConfig[key](data[key]);
                        }
                    }
                }
            }
        }
    };


    public toJsonForSave = (): MISSION_REQUEST_DATA => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            deliveryMissionRequest: this.deliveryMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            deliveryMissionRequest: this.deliveryMissionRequest,

            missionType: this.missionType,
            description: this.description,
            comments: this.comments,
            time: this.time,
            idView: this.idView,
            createdBy: this.createdBy,
            source: this.source,
            missionStatus: this.missionStatus,
            modeDefine: undefined,
            actionOptions: this.actionOptions,
            textUI: [
                {
                    title: 'Resource',
                    value: '' + this.deliveryMissionRequest.droneId
                }
            ]
        };
    };

    public toJsonForRep = (): DELIVERY_MISSION_REQUEST_REP => {
        return {
            id: this.id,
            version: this.version,
            lastAction: this.lastAction,
            deliveryMissionRequest: this.deliveryMissionRequest,
        };
    };

    public toJsonForTMM = (): DELIVERY_MISSION_REQUEST => {
        return this.deliveryMissionRequest;
    };


    saveConfig = {
        id: this.setId,
        version: this.setVersion,
        lastAction: this.setLastAction,
        deliveryMissionRequest: this.setMissionRequest,

        description: this.setDescription,
        comments: this.setComments,
        time: this.setTime,
        idView: this.setIdView,
        createdBy: this.setCreatedBy,
        source: this.setSource,
        missionStatus: this.setMissionStatus,
    };


}
