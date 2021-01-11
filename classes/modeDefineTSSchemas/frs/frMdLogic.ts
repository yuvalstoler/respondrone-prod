import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD, FR_TYPE, EVENT_DATA_UI, MISSION_REQUEST_DATA, AV_DATA_UI
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from '../mdClass';

export class FrMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: FR_DATA_UI, missionsFollowingFR: MISSION_REQUEST_DATA[]): FR_DATA_MD {
        const obj: FR_DATA_MD = {
            styles: {
                // icon
                mapIcon: FrMdLogic.getMapIcon(data, missionsFollowingFR),
                iconSize: FrMdLogic.getIconSize(data, missionsFollowingFR),
                hoverText: undefined,
                labelText: FrMdLogic.getLabelText(data),
                labelBackground: FrMdLogic.getColor(data),
                labelOffset: FrMdLogic.getLabelOffset(data),
                // other
                dotColor: FrMdLogic.getDotColor(data),
                mapIconSelected: FrMdLogic.getMapIconSelected(data, missionsFollowingFR),
                icon: FrMdLogic.getIcon(data),
            },
            tableData: FrMdLogic.tableData(data)
        };
        return obj;
    }


    private static getIcon = (data: FR_DATA_UI): string => {
        let res: string;
        if (data.type === FR_TYPE.fireFighter) {
            res = '../../../../../assets/fireman.png';
        } else if (data.type === FR_TYPE.paramedic) {
            res = '../../../../../assets/medicin.png';
        } else if (data.type === FR_TYPE.police) {
            res = '../../../../../assets/police.png';
        }
        return res;
    };

    private static getMapIcon = (data: FR_DATA_UI, missionsFollowingFR: MISSION_REQUEST_DATA[]): string => {
        let res: string;
        if (data.type === FR_TYPE.fireFighter) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/firemanFollowed.png' : '../../../../../assets/fireman.png';
        } else if (data.type === FR_TYPE.paramedic) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/medicinFollowed.png' : '../../../../../assets/medicin.png';
        } else if (data.type === FR_TYPE.police) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/policeFollowed.png' : '../../../../../assets/police.png';
        }
        return res;
    };

    private static getMapIconSelected = (data: FR_DATA_UI, missionsFollowingFR: MISSION_REQUEST_DATA[]): string => {
        let res: string;
        if (data.type === FR_TYPE.fireFighter) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/firemanFollowed.png' : '../../../../../assets/firemanSelected.png';
        } else if (data.type === FR_TYPE.paramedic) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/medicinFollowed.png' : '../../../../../assets/medicinSelected.png';
        } else if (data.type === FR_TYPE.police) {
            res = (missionsFollowingFR.length > 0) ? '../../../../../assets/policeFollowed.png' : '../../../../../assets/policeSelected.png';
        }
        return res;
    };

    private static getColor = (data: FR_DATA_UI): string => {
        let res: string;
        if (data.type === FR_TYPE.fireFighter) {
            res = MDClass.colors.orange;
        } else if (data.type === FR_TYPE.paramedic) {
            res = MDClass.colors.green;
        } else if (data.type === FR_TYPE.police) {
            res = MDClass.colors.lightBlue;
        }
        return res;
    };

    private static getDotColor = (data: FR_DATA_UI): string => {
        let res: string;
        if (data.online === true) {
            res = MDClass.colors.green;
        } else if (data.online === false) {
            res = MDClass.colors.grey;
        }
        return res;
    };

    private static getLabelText = (data: FR_DATA_UI): string => {
        return data.callSign;
    };

    private static tableData = (data: FR_DATA_UI) => {
        const res = {
            id: {
                type: 'text',
                data: data.callSign
            } as TABLE_DATA_MD,
            status: {
                type: 'text',
                data: data.online ? 'Online' : 'Offline'
            } as TABLE_DATA_MD
        };
        return res;
    };

    private static getIconSize = (data: FR_DATA_UI, missionsFollowingFR: MISSION_REQUEST_DATA[]): {width: number, height: number} => {
        if (missionsFollowingFR.length > 0) {
            return {width: 60, height: 60};
        }
        else {
            return {width: 45, height: 45};
        }
    };

    private static getLabelOffset = (data: FR_DATA_UI): {x: number, y: number} => {
        return {x: 0, y: 29};
    };

}
