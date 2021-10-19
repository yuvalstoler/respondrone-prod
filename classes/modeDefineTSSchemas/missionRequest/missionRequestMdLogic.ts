import {
    FR_DATA_UI,
    MISSION_ACTION_OPTIONS,
    MISSION_REQUEST_ACTION,
    MISSION_REQUEST_DATA_MD,
    MISSION_REQUEST_DATA_UI,
    MISSION_STATUS_UI,
    MISSION_TYPE,
    MISSION_TYPE_TEXT,
    TABLE_DATA_MD
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from '../mdClass';
import {AirVehicle} from '../../dataClasses/airVehicle/airVehicle';

export class MissionRequestMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: MISSION_REQUEST_DATA_UI, airVehicle: AirVehicle, frs: FR_DATA_UI[]): MISSION_REQUEST_DATA_MD {
        const obj: MISSION_REQUEST_DATA_MD = {
            styles: {
                // icon
                mapIcon: MissionRequestMdLogic.getIcon(data),
                iconSize: MissionRequestMdLogic.getIconSize(data),
                mapIconSelected: MissionRequestMdLogic.getIconSelected(data),
                // polygon/polyline
                color: MissionRequestMdLogic.getColor(data),
                fillColor: MissionRequestMdLogic.getFillColor(data),
                isDotted: undefined,
                // common
                hoverText: undefined,
                labelText: undefined,
                labelBackground: undefined,
                labelOffset: undefined,
                // other
                textColor: MissionRequestMdLogic.getTextColor(data),
                dotColor: MissionRequestMdLogic.getDotColor(data),
            },
            tableData: MissionRequestMdLogic.tableData(data),
            data: {
                textUI: MissionRequestMdLogic.getTextUI(data, airVehicle, frs),
                actionOptions: MissionRequestMdLogic.getActionOptions(data)
            }
        };
        return obj;
    }

    private static getTextUI = (data: MISSION_REQUEST_DATA_UI, airVehicle: AirVehicle, frs: FR_DATA_UI[]): {title: string, value: string}[] => {
        let res = [];
        const airVehicleName = airVehicle ? airVehicle.name : '';
        //const airVehicleName = airVehicles.map(obj => obj.id).join(', ');
        switch (data.missionType) {
            case MISSION_TYPE.CommRelay:
                res = [
                    {
                        title: 'Air resources',
                        value: airVehicleName
                    },
                    {
                        title: 'Communication type',
                        value: data.commRelayMissionRequest.commRelayType
                    },
                    {
                        title: 'Follow FRs',
                        value: frs.map(res => {return res.callSign}).join(', ')
                    }
                ];
                break;
            case MISSION_TYPE.Scan:
                res = [
                    {
                        title: 'Air resource',
                        value: airVehicleName
                    },
                    {
                        title: 'Azimuth',
                        value: data.scanMissionRequest.scanAngle + '°'
                    },
                    {
                        title: 'Scan speed',
                        value: data.scanMissionRequest.scanSpeed
                    },
                    {
                        title: 'Overlap percent',
                        value: data.scanMissionRequest.overlapPercent + '%'
                    },
                    {
                        title: 'Camera FOV',
                        value: data.scanMissionRequest.cameraFOV + '%'
                    }

                ];
                break;
            case MISSION_TYPE.Observation:
                res = [
                    {
                        title: 'Air resource',
                        value: airVehicleName
                    },
                    {
                        title: 'Azimuth',
                        value: data.observationMissionRequest.observationAzimuth + '°'
                    },
                    {
                        title: 'Altitude offset',
                        value: data.observationMissionRequest.altitudeOffset + 'm'
                    }
                ];
                break;
            case MISSION_TYPE.Patrol:
                res = [
                    {
                        title: 'Air resource',
                        value: airVehicleName
                    },
                    {
                        title: 'Yaw orientation',
                        value: '' + data.followPathMissionRequest.yawOrientation
                    },
                    {
                        title: 'Gimbal azimuth',
                        value: data.followPathMissionRequest.gimbalAzimuth + '°'
                    },
                    {
                        title: 'Distance',
                        value: data.followPathMissionRequest.distance + 'm'
                    }
                ];
                break;
            case MISSION_TYPE.Servoing:
                res = [
                    {
                        title: 'Air resource',
                        value: airVehicleName
                    },
                    {
                        title: 'Target type',
                        value: data.servoingMissionRequest.targetType
                    },
                    {
                        title: 'Follow FRs',
                        value: frs.map(res => {return res.callSign}).join(', ')
                    }
                ];
                break;
            case MISSION_TYPE.Delivery:
                res = [
                    {
                        title: 'Air resource',
                        value: airVehicleName
                    }
                ];
                break;
        }
        return res;
    };

    private static getActionOptions = (data: MISSION_REQUEST_DATA_UI): MISSION_ACTION_OPTIONS => {
        const res: MISSION_ACTION_OPTIONS = {};

        switch (data.missionStatus) {
            case MISSION_STATUS_UI.New: {
                res[MISSION_REQUEST_ACTION.Accept] = true;
                res[MISSION_REQUEST_ACTION.Reject] = true;
                break;
            }
            case MISSION_STATUS_UI.Pending: {
                res[MISSION_REQUEST_ACTION.Cancel] = true;
                break;
            }
            case MISSION_STATUS_UI.WaitingForApproval: {
                res[MISSION_REQUEST_ACTION.Approve] = true;
                // res[MISSION_REQUEST_ACTION.Reject] = true;
                res[MISSION_REQUEST_ACTION.Cancel] = true;
                break;
            }
            case MISSION_STATUS_UI.Approved: {
                res[MISSION_REQUEST_ACTION.Cancel] = true;
                break;
            }
            case MISSION_STATUS_UI.InProgress: {
                res[MISSION_REQUEST_ACTION.Complete] = true;
                res[MISSION_REQUEST_ACTION.Cancel] = true;
                break;
            }
            case MISSION_STATUS_UI.Cancelled:
            case MISSION_STATUS_UI.Completed: {
                res[MISSION_REQUEST_ACTION.Delete] = true;
                break;
            }
        }
        res.numOfOptions = Object.keys(res).length;
        return res;
    }

    private static getIcon = (data: MISSION_REQUEST_DATA_UI): string => {
        let res = '../../../../../assets/markerDarkGreen.png';
        if (data.missionType === MISSION_TYPE.Observation) {
            res = '../../../../../assets/markerDarkGreen.png';
        } else if (data.missionType === MISSION_TYPE.CommRelay) {
            res = '../../../../../assets/markerPurple.png';
        } else if (data.missionType === MISSION_TYPE.Delivery) {
            res = '../../../../../assets/markerRed.png';
        }
        return res;
    };

    private static getIconSelected = (data: MISSION_REQUEST_DATA_UI): string => {
        let res = '../../../../../assets/markerDarkGreenSelected.png';
        if (data.missionType === MISSION_TYPE.Observation) {
            res = '../../../../../assets/markerDarkGreenSelected.png';
        } else if (data.missionType === MISSION_TYPE.CommRelay) {
            res = '../../../../../assets/markerPurpleSelected.png';
        } else if (data.missionType === MISSION_TYPE.Delivery) {
            res = '../../../../../assets/markerRedSelected.png';
        }
        return res;
    };

    private static getColor = (data: MISSION_REQUEST_DATA_UI): string => {
        let res: string = MDClass.colors.darkGreen;
        if (data.missionType === MISSION_TYPE.Scan) {
            res = MDClass.colors.darkGreen;
        } else if (data.missionType === MISSION_TYPE.Patrol) {
            res = MDClass.colors.darkGreen;
        } else if (data.missionType === MISSION_TYPE.CommRelay) {
            res = MDClass.colors.purple;
        }
        return res;
    };

    private static getFillColor = (data: MISSION_REQUEST_DATA_UI): string => {
        const res: string = MDClass.colors.transparent;
        return res;
    };

    private static getTextColor = (data: MISSION_REQUEST_DATA_UI): string => {
        let res: string;
        if (data.missionStatus === MISSION_STATUS_UI.Rejected) {
            res = MDClass.colors.red;
        } else if (data.missionStatus === MISSION_STATUS_UI.Completed) {
            res = MDClass.colors.grey;
        }
        return res;
    };

    private static getDotColor = (data: MISSION_REQUEST_DATA_UI): string => {
        let res: string;
        if (data.missionStatus === MISSION_STATUS_UI.New) {
            res = MDClass.colors.yellow;
        } else if (data.missionStatus === MISSION_STATUS_UI.InProgress) {
            res = MDClass.colors.orange;
        } else if (data.missionStatus === MISSION_STATUS_UI.Pending) {
            res = MDClass.colors.brown;
        } else if (data.missionStatus === MISSION_STATUS_UI.Approved) {
            res = MDClass.colors.blue;
        } else if (data.missionStatus === MISSION_STATUS_UI.WaitingForApproval) {
            res = MDClass.colors.lightBlue;
        } else if (data.missionStatus === MISSION_STATUS_UI.Cancelled) {
            res = MDClass.colors.purple;
        } else if (data.missionStatus === MISSION_STATUS_UI.Completed) {
            res = MDClass.colors.green;
        } else if (data.missionStatus === MISSION_STATUS_UI.Rejected) {
            res = MDClass.colors.red;
        }
        return res;
    };

    private static tableData = (data: MISSION_REQUEST_DATA_UI) => {
        const res = {
            id: {
                type: 'text',
                data: data.idView
            } as TABLE_DATA_MD,
            missionType: {
                type: 'text',
                data: MISSION_TYPE_TEXT[data.missionType]
            } as TABLE_DATA_MD,
            time: {
                type: 'date',
                data: data.time
            } as TABLE_DATA_MD,
            message: {
                type: 'text',
                data: data.comments.length > 0 ? '' + data.comments.length : ''
            } as TABLE_DATA_MD,
            map: {
                type: 'matIcon',
                data: 'location_on',
                color: MDClass.colors.darkGray,
                tooltip: 'Mission\'s location'
            } as TABLE_DATA_MD,
        };
        return res;
    };

    private static getIconSize = (data: MISSION_REQUEST_DATA_UI): {width: number, height: number} => {
        return {width: 45, height: 45};
    }

}
