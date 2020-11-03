import {
    FR_DATA_UI,
    GEOGRAPHIC_INSTRUCTION, GEOGRAPHIC_INSTRUCTION_MD,
    PRIORITY,
    TABLE_DATA_MD,
    TASK_DATA_MD,
    TASK_DATA_UI,
    TASK_STATUS
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class GeoInstructionsMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: GEOGRAPHIC_INSTRUCTION): GEOGRAPHIC_INSTRUCTION_MD {
        const obj: GEOGRAPHIC_INSTRUCTION_MD = {
            styles: {
                mapIcon: GeoInstructionsMdLogic.getIcon(data),
                iconSize: this.getIconSize(data)
            }
        };
        return obj;
    }

    private static getIcon = (data: GEOGRAPHIC_INSTRUCTION): string => {
        let res;
        res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getIconSize = (data: GEOGRAPHIC_INSTRUCTION): number => {
        return 30;
    };


}
