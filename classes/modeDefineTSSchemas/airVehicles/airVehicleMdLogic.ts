import {
    AV_DATA_MD,
    AV_DATA_UI,
    AV_OPTIONS,
    CAPABILITY,
    COMM_STATUS, FR_DATA_UI, FR_TYPE,
    MISSION_TYPE,
    MISSION_TYPE_TEXT,
    OPERATIONAL_STATUS
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from '../mdClass';
import {MissionRequest} from '../../dataClasses/missionRequest/missionRequest';

export class AirVehicleMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: AV_DATA_UI, missionRequest: MissionRequest): AV_DATA_MD {
        const obj: AV_DATA_MD = {
            styles: {
                // icon
                mapIcon: AirVehicleMdLogic.getIconMap(data),
                iconSize: AirVehicleMdLogic.getIconSize(data),
                hoverText: undefined,
                labelText: AirVehicleMdLogic.getLabelText(data),
                labelBackground: AirVehicleMdLogic.getStatusColor(data),
                labelOffset: AirVehicleMdLogic.getLabelOffset(data),
                // other
                statusColor: AirVehicleMdLogic.getStatusColor(data),
                gpsIcon: this.getGPSIcon(data),
                gpsDescription: this.getGPSDescription(data),
                isDisabled: this.isDisabled(data),
                mapIconSelected: AirVehicleMdLogic.getMapIconSelected(data),
                icon: AirVehicleMdLogic.getIcon(data), /*Right Panel*/
            },
            data: {
                missionName: AirVehicleMdLogic.getMissionName(data, missionRequest),
                missionId: AirVehicleMdLogic.getMissionId(data, missionRequest),
                missionOptions: AirVehicleMdLogic.getMissionOptions(data)
            }
        };
        return obj;
    }

    private static getIcon = (data: AV_DATA_UI): string => {
        let res: string;
            res = '../../../../../assets/helicopter.png';
        return res;
    };


    private static getMissionName = (data: AV_DATA_UI, missionRequest: MissionRequest): string => {
        let res: string;
        if (missionRequest) {
            res = MISSION_TYPE_TEXT[missionRequest.missionType] + ' - ' + missionRequest.idView;
        }
        return res;
    };

    private static getMissionId = (data: AV_DATA_UI, missionRequest: MissionRequest): string => {
        let res: string;
        if (missionRequest) {
            res = missionRequest.idView;
        }
        return res;
    };

    private static getMissionOptions = (data: AV_DATA_UI): AV_OPTIONS => {
        const res: AV_OPTIONS = {};
        if (data.operationalStatus === OPERATIONAL_STATUS.Ready || data.operationalStatus === OPERATIONAL_STATUS.OnMission) {
            res.isViewLiveVideo = true;
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
    };

    private static isDisabled = (data: AV_DATA_UI): boolean => {
        return (data.operationalStatus === OPERATIONAL_STATUS.NotActive || data.commStatus === COMM_STATUS.NoComm);
    };

    private static getIconMap = (data: AV_DATA_UI): string => {
        const res: string = '../../../../../assets/droneBlack.png';
        return res;
    };

    private static getMapIconSelected = (data: AV_DATA_UI): string => {
        const res: string = '../../../../../assets/droneBlackSelected.png';
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

    private static getIconSize = (data: AV_DATA_UI): {width: number, height: number} => {
        return {width: 60, height: 60};
    };

    private static getLabelOffset = (data: AV_DATA_UI): {x: number, y: number} => {
        return {x: 0, y: 30};
    };

    private static getLabelText = (data: AV_DATA_UI): string => {
        return data.name;
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

    private static getGPSDescription = (data: AV_DATA_UI): string => {
        let res = 'NoGPS';
        if (data.gpsQuality === 0) {
            res = 'NoGPS';
        } else if (data.gpsQuality === 1) {
            res = '1GPS';
        } else if (data.gpsQuality === 2) {
            res = '2GPS';
        } else if (data.gpsQuality === 3) {
            res = '3GPS';
        } else if (data.gpsQuality === 4) {
            res = 'FullGPS';
        } else if (data.gpsQuality === 5) {
            res = 'FullGPS';
        }
        return res;
    };

}
