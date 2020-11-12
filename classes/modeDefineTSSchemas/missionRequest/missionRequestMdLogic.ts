import {
    MISSION_REQUEST_DATA_MD,
    MISSION_REQUEST_DATA_UI,
    MISSION_STATUS_UI,
    MISSION_TYPE_TEXT,
    TABLE_DATA_MD
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class MissionRequestMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: MISSION_REQUEST_DATA_UI): MISSION_REQUEST_DATA_MD {
        const obj: MISSION_REQUEST_DATA_MD = {
            styles: {
                mapIcon: MissionRequestMdLogic.getIcon(data),
                textColor: MissionRequestMdLogic.getTextColor(data),
                dotColor: MissionRequestMdLogic.getDotColor(data),
                iconSize: this.getIconSize(data)
            },
            tableData: MissionRequestMdLogic.tableData(data)
        };
        return obj;
    }


    private static getIcon = (data: MISSION_REQUEST_DATA_UI): string => {
        const res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getColor = (data: MISSION_REQUEST_DATA_UI): string => {
        let res: string = MDClass.colors.lightBlue;
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
        } else if (data.missionStatus === MISSION_STATUS_UI.Approve) {
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
        let res = {
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
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,
        };
        return res;
    };

    private static getIconSize = (data: MISSION_REQUEST_DATA_UI): number => {
        return 45;
    };

}
