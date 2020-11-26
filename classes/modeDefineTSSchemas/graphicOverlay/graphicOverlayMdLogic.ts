import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD, FR_TYPE, EVENT_DATA_UI, GRAPHIC_OVERLAY_DATA_MD, GRAPHIC_OVERLAY_DATA_UI
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class GraphicOverlayMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: GRAPHIC_OVERLAY_DATA_UI): GRAPHIC_OVERLAY_DATA_MD {
        const obj: GRAPHIC_OVERLAY_DATA_MD = {
            styles: {
                mapIcon: GraphicOverlayMdLogic.getIcon(data),
                polygonColor: GraphicOverlayMdLogic.getColor(data),
                iconSize: this.getIconSize(data)
            },
        };
        return obj;
    }


    private static getIcon = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        const res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getColor = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res: string = MDClass.colors.lightBlue;
        return res;
    };


    private static getIconSize = (data: GRAPHIC_OVERLAY_DATA_UI): number => {
        return 45;
    };

}
