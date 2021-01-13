import {
    FR_DATA_UI,
    GEOGRAPHIC_INSTRUCTION, GEOGRAPHIC_INSTRUCTION_MD, MISSION_REQUEST_DATA_UI, MISSION_TYPE,
    PRIORITY,
    TABLE_DATA_MD,
    TASK_DATA_MD,
    TASK_DATA_UI,
    TASK_STATUS
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from '../mdClass';

export class GeoInstructionsMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: GEOGRAPHIC_INSTRUCTION): GEOGRAPHIC_INSTRUCTION_MD {
        const obj: GEOGRAPHIC_INSTRUCTION_MD = {
            styles: {
                // icon
                mapIcon: GeoInstructionsMdLogic.getIcon(data),
                iconSize: GeoInstructionsMdLogic.getIconSize(data),
                mapIconSelected: GeoInstructionsMdLogic.getIconSelected(data),
                // polygon/polyline/arrow
                color: GeoInstructionsMdLogic.getColor(data),
                fillColor: GeoInstructionsMdLogic.getFillColor(data),
                isDotted: false,
                // common
                hoverText: GeoInstructionsMdLogic.getTextOnHover(data),
                labelText: undefined,
                labelBackground: undefined,
                labelOffset: undefined,
            }
        };
        return obj;
    }

    private static getIcon = (data: GEOGRAPHIC_INSTRUCTION): string => {
        let res;
        res = '../../../../../assets/markerBlue.png';
        return res;
    };

    private static getIconSelected = (data: GEOGRAPHIC_INSTRUCTION): string => {
        let res;
        res = '../../../../../assets/markerBlueSelected.png';
        return res;
    };

    private static getTextOnHover = (data: GEOGRAPHIC_INSTRUCTION): string => {
        return data.description;
    };

    private static getColor = (data: GEOGRAPHIC_INSTRUCTION): string => {
        const res: string = MDClass.colors.blue;
        return res;
    };

    private static getFillColor = (data: GEOGRAPHIC_INSTRUCTION): string => {
        const res: string = MDClass.colors.transparent;
        return res;
    };

    private static getIconSize = (data: GEOGRAPHIC_INSTRUCTION): {width: number, height: number} => {
        return {width: 30, height: 30};
    };


}
