import {
    LOCATION_TYPE,
    PRIORITY,
    FR_DATA_MD,
    FR_DATA_UI,
    TABLE_DATA_MD, FR_TYPE, EVENT_DATA_UI
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class FrMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: FR_DATA_UI): FR_DATA_MD {
        const obj: FR_DATA_MD = {
            styles: {
                icon: FrMdLogic.getIcon(data),
                color: FrMdLogic.getColor(data),
                dotColor: FrMdLogic.getDotColor(data),
            },
            tableData: FrMdLogic.tableData(data)
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

    private static getDotColor = (data: FR_DATA_UI): string => {
        let res: string;
        if (data.online === true) {
            res = MDClass.colors.green;
        } else if (data.online === false) {
            res = MDClass.colors.grey;
        }
        return res;
    };

    private static tableData = (data: FR_DATA_UI) => {
        let res = {
            id: {
                type: 'text',
                data: data.callSign
            } as TABLE_DATA_MD,
            status: {
                type: 'text',
                data: data.online ? 'Online' : 'Offline'
            } as TABLE_DATA_MD
        };
        return res;
    };



}
