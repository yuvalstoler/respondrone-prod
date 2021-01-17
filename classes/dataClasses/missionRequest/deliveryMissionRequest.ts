import {
    COMM_RELAY_MISSION_REQUEST_REP,
    DELIVERY_MISSION_REQUEST,
    DELIVERY_MISSION_REQUEST_REP, MISSION_REQUEST_DATA_UI,
    ID_TYPE,
    LAST_ACTION, MISSION_REQUEST_DATA,
    MISSION_TYPE, COMM_RELAY_MISSION_REQUEST

} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';
import {MissionRequest} from './missionRequest';

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
            ...this.toJsonForSaveCommon(),
            deliveryMissionRequest: this.deliveryMissionRequest,
        };
    };

    public toJsonForUI = (): MISSION_REQUEST_DATA_UI => {
        return {
            ...this.toJsonForUICommon(),
            deliveryMissionRequest: this.deliveryMissionRequest,
        };
    };

    public toJsonForRep = (): DELIVERY_MISSION_REQUEST_REP => {
        return {
            ...this.toJsonForRepCommon(),
            deliveryMissionRequest: this.deliveryMissionRequest,
        };
    };

    public toJsonForTMM = (): DELIVERY_MISSION_REQUEST => {
        return this.deliveryMissionRequest;
    };


    saveConfig = {
        ...this.saveConfigCommon,
        deliveryMissionRequest: this.setMissionRequest,
    };


}
