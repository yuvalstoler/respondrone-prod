import {
    MISSION_ROUTE_DATA_MD,
    MISSION_ROUTE_DATA_UI,
    MISSION_STATUS_UI,
    MISSION_TYPE_TEXT
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";
import {MissionRequest} from "../../dataClasses/missionRequest/missionRequest";

export class MissionRouteMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: MISSION_ROUTE_DATA_UI, missionRequest: MissionRequest): MISSION_ROUTE_DATA_MD {
        const obj: MISSION_ROUTE_DATA_MD = {
            styles: {
                isDotted: MissionRouteMdLogic.isDotted(data, missionRequest),
                color: MissionRouteMdLogic.getColor(data, missionRequest)
            },
            data: {
                missionName: MissionRouteMdLogic.getMissionName(data, missionRequest),
            }
        };
        return obj;
    }


    private static isDotted = (data: MISSION_ROUTE_DATA_UI, missionRequest: MissionRequest): boolean => {
        const res = (missionRequest &&
            (missionRequest.missionStatus === MISSION_STATUS_UI.WaitingForApproval || missionRequest.missionStatus === MISSION_STATUS_UI.Pending))
        return res;
    };

    private static getColor = (data: MISSION_ROUTE_DATA_UI, missionRequest: MissionRequest): string => {
        let res: string = MDClass.colors.lightBlue;
        if (missionRequest) {
            if  (missionRequest.missionStatus === MISSION_STATUS_UI.Approved) {
                res = MDClass.colors.blue;
            } else if (missionRequest.missionStatus === MISSION_STATUS_UI.InProgress) {
                res = MDClass.colors.orange;
            }
        }
        return res;
    };

    private static getMissionName = (data: MISSION_ROUTE_DATA_UI, missionRequest: MissionRequest): string => {
        let res: string;
        if (missionRequest) {
            res = MISSION_TYPE_TEXT[missionRequest.missionType] + ' - ' + missionRequest.idView;
        }
        return res;
    };

}
