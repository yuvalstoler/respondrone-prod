import {
    TASK_DATA_UI,
    LOCATION_TYPE,
    PRIORITY,
    TABLE_DATA_MD, TASK_DATA_MD
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class TaskMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: TASK_DATA_UI): TASK_DATA_MD {
        const obj: TASK_DATA_MD = {
            styles: {},
            tableData: TaskMdLogic.tableData(data)
        };
        return obj;
    }


    private static getPriorityIcon = (data: TASK_DATA_UI): TABLE_DATA_MD => {
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


    private static tableData = (data: TASK_DATA_UI) => {
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
            priority: TaskMdLogic.getPriorityIcon(data),
            assignees: {
                type: 'text',
                data: data.assignees.length > 0 ? '' + data.assignees.length : ''
            } as TABLE_DATA_MD,
            map: {
                type: 'matIcon',
                data: data.geographicInstructions.length !== 0 ? 'location_on' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,

        };
        return res;
    };

}
