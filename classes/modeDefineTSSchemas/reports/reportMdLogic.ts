import {LOCATION_TYPE, PRIORITY, REPORT_DATA_MD, REPORT_DATA_UI, TABLE_DATA_MD} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class ReportMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: REPORT_DATA_UI): REPORT_DATA_MD {
        const obj: REPORT_DATA_MD = {
            styles: {},
            tableData: ReportMdLogic.tableData(data)
        };
        return obj;
    }


    private static getPriorityIcon = (data: REPORT_DATA_UI): TABLE_DATA_MD => {
        let res: TABLE_DATA_MD = {type: 'matIcon', data: '', color: ''};
        if (data.priority === PRIORITY.high) {
            res.data = 'warning';
            res.color = MDClass.colors.red;
        } else if (data.priority === PRIORITY.middle) {
            res.data = 'remove_circle';
            res.color = MDClass.colors.orange;
        } else if (data.priority === PRIORITY.low) {
            res.data = 'error';
            res.color = MDClass.colors.darkBlue;
        }
        return res;
    };


    private static tableData = (data: REPORT_DATA_UI) => {
        let res = {
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
