import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD, FR_TYPE
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class FrMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: FR_DATA_UI): FR_DATA_MD {
        const obj: FR_DATA_MD = {
            styles: {
                icon: this.getIcon(data),
                color: this.getColor(data),
            },
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



}
