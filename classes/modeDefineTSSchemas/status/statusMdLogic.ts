import {CONNECTION_STATUS, STATUS_INDICATOR_DATA, STATUS_INDICATOR_DATA_MD} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from '../mdClass';

export class StatusMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: STATUS_INDICATOR_DATA): STATUS_INDICATOR_DATA_MD {
        const obj: STATUS_INDICATOR_DATA_MD = {
            styles: {
                icon: StatusMdLogic.getIcon(data),
                colors: StatusMdLogic.getColors(data),
            },
        };
        return obj;
    }


    private static getIcon = (data: STATUS_INDICATOR_DATA): string => {
        let res;
        let isAll = true, isAny = false;
        for (const key in data) {
            if (data[key].status === CONNECTION_STATUS.connected) {
                isAny = true;
            } else if (data[key].status !== CONNECTION_STATUS.connected) {
                isAll = false;
            }
        }

        if (isAll && isAny) {
            res = '../../../../../assets/connectionGreen.png';
        }
        else if (isAny) {
            res = '../../../../../assets/connectionYellow.png';
        }
        else {
            res = '../../../../../assets/connectionRed.png';
        }
        return res;
    };

    private static getColor = (status: CONNECTION_STATUS) => {
        if (status === CONNECTION_STATUS.connected) {
            return MDClass.colors.green;
        }
        else if (status === CONNECTION_STATUS.disconnected) {
            return MDClass.colors.red;
        }
        else {
            return MDClass.colors.black;
        }
    }
    private static getColors = (data: STATUS_INDICATOR_DATA) => {
        const res = {
            webserver: StatusMdLogic.getColor(data.webserver.status),
            internet: StatusMdLogic.getColor(data.internet.status),
            repositories: StatusMdLogic.getColor(data.repositories.status),
            tmm: StatusMdLogic.getColor(data.tmm.status),
            thales: StatusMdLogic.getColor(data.thales.status),
        };
        return res;
    };


}
