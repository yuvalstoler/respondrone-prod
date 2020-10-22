import {
    LOCATION_TYPE,
    PRIORITY,
    REPORT_DATA_MD,
    REPORT_DATA_UI,
    TABLE_DATA_MD
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class ReportMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: REPORT_DATA_UI): REPORT_DATA_MD {
        const obj: REPORT_DATA_MD = {
            styles: {
                icon: this.getPriorityIcon(data).data,
                selectedIcon: this.getPriorityIcon(data).data
            },
            tableData: ReportMdLogic.tableData(data)
        };
        return obj;
    }


    private static getPriorityIcon = (data: REPORT_DATA_UI): TABLE_DATA_MD => {
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


    private static tableData = (data: REPORT_DATA_UI) => {
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
            priority: ReportMdLogic.getPriorityIcon(data),
            link: {
                type: 'matIcon',
                data: data.events.length > 0 ? 'link' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,
            map: {
                type: 'matIcon',
                data: data.locationType !== LOCATION_TYPE.none ? 'location_on' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,
            attachment: {
                type: 'matIcon',
                data: data.media.length > 0 ? 'attach_file' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD
        };
        return res;
    };

}
