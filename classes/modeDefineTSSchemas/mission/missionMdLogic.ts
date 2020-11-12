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
                mapIcon: MissionMdLogic.getIcon(data),
                polygonColor: MissionMdLogic.getColor(data),
                iconSize: this.getIconSize(data)
            },
        };
        return obj;
    }


    private static getIcon = (data: MISSION_DATA_UI): string => {
        const res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getColor = (data: MISSION_DATA_UI): string => {
        let res: string = MDClass.colors.lightBlue;
        return res;
    };


    private static getIconSize = (data: MISSION_DATA_UI): number => {
        return 45;
    };

}
