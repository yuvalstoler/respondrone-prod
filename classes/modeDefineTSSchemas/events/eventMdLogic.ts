import {LOCATION_TYPE, PRIORITY, EVENT_DATA_MD, EVENT_DATA_UI, TABLE_DATA_MD} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class EventMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: EVENT_DATA_UI): EVENT_DATA_MD {
        const obj: EVENT_DATA_MD = {
            styles: {
                icon: this.getPriorityIcon(data).data,
                selectedIcon: this.getPriorityIcon(data).data,
            },
            tableData: EventMdLogic.tableData(data)
        };
        return obj;
    }


    private static getPriorityIcon = (data: EVENT_DATA_UI): TABLE_DATA_MD => {
        let res: TABLE_DATA_MD = {type: 'image', data: '', color: ''};
        if (data.priority === PRIORITY.high) {
            res.data = '../../../../../assets/priorityHigh.png';
        } else if (data.priority === PRIORITY.middle) {
            res.data = '../../../../../assets/priorityMiddle.png';
        } else if (data.priority === PRIORITY.low) {
            res.data = '../../../../../assets/priorityLow.png';
        }
        return res;
    };


    private static tableData = (data: EVENT_DATA_UI) => {
        let res = {
            id: {
                type: 'text',
                data: data.idView
            } as TABLE_DATA_MD,
            time: {
                type: 'date',
                data: data.time
            } as TABLE_DATA_MD,
            message: {
                type: 'text',
                data: data.comments.length > 0 ? '' + data.comments.length : ''
            } as TABLE_DATA_MD,
            priority: EventMdLogic.getPriorityIcon(data),
            link: {
                type: 'matIcon',
                data: data.reports.length > 0 ? 'link' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,
            map: {
                type: 'matIcon',
                data: data.locationType !== LOCATION_TYPE.none ? 'location_on' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD
        };
        return res;
    };

}
