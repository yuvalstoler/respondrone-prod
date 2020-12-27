import {
    GEOPOINT3D_SHORT, NFZ_DATA_MD, NFZ_DATA_UI, POINT3D
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class NFZMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: NFZ_DATA_UI): NFZ_DATA_MD {
        const obj: NFZ_DATA_MD = {
            styles: {
                // polygon
                color: NFZMdLogic.getColor(data),
                fillColor: NFZMdLogic.getFillColor(data),
                // common
                hoverText: undefined,
                labelText: NFZMdLogic.getLabelText(data),
                labelBackground: undefined,
                labelOffset: undefined,

            },
        };
        return obj;
    }



    private static getColor = (data: NFZ_DATA_UI): string => {
        let res: string = MDClass.colors.red;
        return res;
    };

    private static getFillColor = (data: NFZ_DATA_UI): string => {
        let res: string = MDClass.colors.redOpacity;
        return res;
    };

    private static getLabelText = (data: NFZ_DATA_UI): string => {
        return `${data.name}`;
    };


}
