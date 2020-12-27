import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD, FR_TYPE, EVENT_DATA_UI, MISSION_DATA_MD, MISSION_DATA_UI
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class MissionMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: MISSION_DATA_UI): MISSION_DATA_MD {
        const obj: MISSION_DATA_MD = {
            styles: {
                // icon
                mapIcon: MissionMdLogic.getIcon(data),
                iconSize: MissionMdLogic.getIconSize(data),
                // polygon
                color: MissionMdLogic.getColor(data),
                fillColor: MissionMdLogic.getFillColor(data),
                // common
                hoverText: undefined,
                labelText: undefined,
                labelBackground: undefined,
                labelOffset: undefined,
            },
        };
        return obj;
    }


    private static getIcon = (data: MISSION_DATA_UI): string => {
        const res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getColor = (data: MISSION_DATA_UI): string => {
        let res: string = MDClass.colors.blue;
        return res;
    };

    private static getFillColor = (data: MISSION_DATA_UI): string => {
        let res: string = MDClass.colors.transparent;
        return res;
    };


    private static getIconSize = (data: MISSION_DATA_UI): {width: number, height: number} => {
        return {width: 45, height: 45};
    };

}
