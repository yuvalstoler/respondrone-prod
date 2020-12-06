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
                color: GraphicOverlayMdLogic.getColor(data),
                fillColor: GraphicOverlayMdLogic.getFillColor(data),
                iconSize: this.getIconSize(data)
            },
        };
        return obj;
    }


    private static getIcon = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res = '../../../../../assets/markerBlue.png';
        switch (data.color) {
            case 'Red':
                res = '../../../../../assets/markerRed.png';
                break;
            case 'Green':
                res = '../../../../../assets/markerGreen.png';
                break;
            case 'Blue':
                res = '../../../../../assets/markerBlue.png';
                break;
            case 'Black':
                res = '../../../../../assets/markerBlack.png';
                break;
            case 'White':
                res = '../../../../../assets/markerWhite.png';
                break;
            case 'Grey':
                res = '../../../../../assets/markerGrey.png';
                break;
        }
        return res;
    };

    private static getColor = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res: string = MDClass.colors.blue;
        switch (data.color) {
            case 'Red':
                res = MDClass.colors.red;
                break;
            case 'Green':
                res = MDClass.colors.green;
                break;
            case 'Blue':
                res = MDClass.colors.blue;
                break;
            case 'Black':
                res = MDClass.colors.black;
                break;
            case 'White':
                res = MDClass.colors.white;
                break;
            case 'Grey':
                res = MDClass.colors.grey;
                break;
        }
        return res;
    };

    private static getFillColor = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res: string = 'rgba(0,0,0,0)';
        return res;
    };


    private static getIconSize = (data: GRAPHIC_OVERLAY_DATA_UI): number => {
        return 45;
    };

}
