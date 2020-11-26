import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD,
    FR_TYPE,
    EVENT_DATA_UI,
    AV_DATA_UI,
    AV_DATA_MD,
    OPERATIONAL_STATUS,
    MISSION_REQUEST_DATA_UI,
    MISSION_STATUS_UI, MISSION_ROUTE_DATA_UI, MISSION_TYPE_TEXT, AV_OPTIONS, CAPABILITY, MISSION_TYPE
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";
import {MissionRequest} from "../../dataClasses/missionRequest/missionRequest";

export class AirVehicleMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: AV_DATA_UI, missionRequest: MissionRequest): AV_DATA_MD {
        const obj: AV_DATA_MD = {
            styles: {
                mapIcon: AirVehicleMdLogic.getIcon(data),
                statusColor: AirVehicleMdLogic.getStatusColor(data),
                iconSize: this.getIconSize(data),
                gpsIcon: this.getGPSIcon(data)
            },
            data: {
                missionName: AirVehicleMdLogic.getMissionName(data, missionRequest),
                missionOptions: AirVehicleMdLogic.getMissionOptions(data)
            }
        };
        return obj;
    }


    private static getMissionName = (data: AV_DATA_UI, missionRequest: MissionRequest): string => {
        let res: string;
        if (missionRequest) {
            res = MISSION_TYPE_TEXT[missionRequest.missionType] + ' - ' + missionRequest.idView;
        }
        return res;
    };

    private static getMissionOptions = (data: AV_DATA_UI): AV_OPTIONS => {
        const res: AV_OPTIONS = {};
        if (data.operationalStatus === OPERATIONAL_STATUS.Ready) {
            data.capability.forEach((item: CAPABILITY) => {
                switch (item) {
                    case CAPABILITY.Surveillance:
                    case CAPABILITY.Patrol:
                    case CAPABILITY.Scan:
                        res[MISSION_TYPE.Patrol] = true;
                        res[MISSION_TYPE.Observation] = true;
                        res[MISSION_TYPE.Scan] = true;
                        res[MISSION_TYPE.Servoing] = true;
                        break;
                    case CAPABILITY.CommRelay:
                        res[MISSION_TYPE.CommRelay] = true;
                        break;
                    case CAPABILITY.Delivery:
                        res[MISSION_TYPE.Delivery] = true;
                        break;
                }
            });
        }
        return res;
    }

    private static getIcon = (data: AV_DATA_UI): string => {
        let res: string = '../../../../../assets/droneBlack.png';
        return res;
    };

    private static getStatusColor = (data: AV_DATA_UI): string => {
        let res: string = MDClass.colors.white;
        if (data.operationalStatus === OPERATIONAL_STATUS.Ready) {
            res = MDClass.colors.green;
        } else if (data.operationalStatus === OPERATIONAL_STATUS.RH) {
            res = MDClass.colors.yellow;
        } else if (data.operationalStatus === OPERATIONAL_STATUS.OnMission) {
            res = MDClass.colors.orange;
        } else if (data.operationalStatus === OPERATIONAL_STATUS.NotActive) {
            res = MDClass.colors.grey;
        }
        return res;
    };

    private static getIconSize = (data: AV_DATA_UI): number => {
        return 60;
    };

    private static getGPSIcon = (data: AV_DATA_UI): string => {
        let res = '../../../../../assets/NoGPS.png';
        if (data.gpsQuality === 0) {
            res = '../../../../../assets/NoGPS.png';
        } else if (data.gpsQuality === 1) {
            res = '../../../../../assets/1GPS.png';
        } else if (data.gpsQuality === 2) {
            res = '../../../../../assets/2GPS.png';
        } else if (data.gpsQuality === 3) {
            res = '../../../../../assets/3GPS.png';
        } else if (data.gpsQuality === 4) {
            res = '../../../../../assets/FullGPS.png';
        } else if (data.gpsQuality === 5) {
            res = '../../../../../assets/FullGPS.png';
        }
        return res;
    };

}
