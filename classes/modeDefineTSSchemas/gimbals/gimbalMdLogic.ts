import {
    LOCATION_TYPE,
    PRIORITY,
    GIMBAL_DATA_MD,
    GIMBAL_DATA_UI,
    TABLE_DATA_MD, EVENT_DATA_UI, MISSION_REQUEST_DATA, GRAPHIC_OVERLAY_DATA_UI
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class GimbalMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: GIMBAL_DATA_UI): GIMBAL_DATA_MD {
        const obj: GIMBAL_DATA_MD = {
            styles: {
                // icon
                mapIcon: GimbalMdLogic.getIcon(data),
                iconSize: GimbalMdLogic.getIconSize(data),
                hoverText: undefined,
                labelText: undefined,
                labelBackground: undefined,
                labelOffset: undefined,
                // polygon
                color: GimbalMdLogic.getColor(data),
                fillColor: GimbalMdLogic.getFillColor(data),
                // polyline
                isDotted: undefined
            }
        };
        return obj;
    }


    private static getIcon = (data: GIMBAL_DATA_UI): string => {
        let res: string = '../../../../../assets/gimbal.png';
        return res;
    };


    private static getIconSize = (data: GIMBAL_DATA_UI): {width: number, height: number} => {
        return {width: 20, height: 20};
    };

    private static getColor = (data: GIMBAL_DATA_UI): string => {
        let res: string = MDClass.colors.red;
        return res;
    };

    private static getFillColor = (data: GIMBAL_DATA_UI): string => {
        let res: string = MDClass.colors.transparent;
        return res;
    };
}
