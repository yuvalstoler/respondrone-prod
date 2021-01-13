import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD,
    FR_TYPE,
    EVENT_DATA_UI,
    GRAPHIC_OVERLAY_DATA_MD,
    GRAPHIC_OVERLAY_DATA_UI,
    METADATA_OBJ,
    GEOPOINT3D_SHORT, POINT3D
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class GraphicOverlayMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: GRAPHIC_OVERLAY_DATA_UI): GRAPHIC_OVERLAY_DATA_MD {
        const obj: GRAPHIC_OVERLAY_DATA_MD = {
            styles: {
                // icon
                mapIcon: GraphicOverlayMdLogic.getIcon(data),
                iconSize: GraphicOverlayMdLogic.getIconSize(data),
                mapIconSelected: undefined,
                // polygon
                color: GraphicOverlayMdLogic.getColor(data),
                fillColor: GraphicOverlayMdLogic.getFillColor(data),
                polygonLabelPosition: GraphicOverlayMdLogic.getPolygonLabelPosition(data),
                // common
                hoverText: GraphicOverlayMdLogic.getTextOnHover(data),
                labelText: GraphicOverlayMdLogic.getLabelText(data),
                labelBackground: GraphicOverlayMdLogic.getColor(data),
                labelOffset: GraphicOverlayMdLogic.getLabelOffset(data)
            },
        };
        return obj;
    }


    private static getIcon = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res;
        if (GraphicOverlayMdLogic.getType(data) === 'icon') {
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
        }
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
        let res: string = MDClass.colors.transparent;
        return res;
    };

    private static getPolygonLabelPosition = (data: GRAPHIC_OVERLAY_DATA_UI): POINT3D => {
        let res: POINT3D;
        if (GraphicOverlayMdLogic.getType(data) === 'polygon' && data.shape.coordinates.length > 0) {
            let minIndex = 0;
            data.shape.coordinates.forEach((coord: GEOPOINT3D_SHORT, index: number) => {
                if (coord.lat > data.shape.coordinates[minIndex].lat) {
                    minIndex = index;
                }
            });
            res = [data.shape.coordinates[minIndex].lon, data.shape.coordinates[minIndex].lat, data.shape.coordinates[minIndex].alt];
        }
        return res;
    };

    private static getTextOnHover = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        let res: string;
        if (data.metadata && data.metadata.length > 0) {
            res = '';
            data.metadata.forEach((obj: METADATA_OBJ) => {
                res += `${obj.name}: ${obj.value}\n`
            });
            res = res.slice(0, -1);
        }
        return res;
    };

    private static getLabelText = (data: GRAPHIC_OVERLAY_DATA_UI): string => {
        return data.type;
    };

    private static getLabelOffset = (data: GRAPHIC_OVERLAY_DATA_UI): {x: number, y: number} => {
        if (GraphicOverlayMdLogic.getType(data) === 'icon') {
            return {x: 0, y: 27}
        }
    };

    private static getIconSize = (data: GRAPHIC_OVERLAY_DATA_UI): {width: number, height: number} => {
        return {width: 45, height: 45};
    };


    private static getType = (data: GRAPHIC_OVERLAY_DATA_UI): 'icon' | 'polygon' => {
        if (data.shape.coordinates !== undefined) {
            return 'polygon'
        }
        else {
            return 'icon'
        }
    }

}
