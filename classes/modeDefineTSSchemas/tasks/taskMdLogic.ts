import {
    PRIORITY,
    TABLE_DATA_MD,
    TASK_ACTION,
    TASK_ACTION_OPTIONS,
    TASK_DATA_MD,
    TASK_DATA_UI,
    TASK_STATUS
} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class TaskMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: TASK_DATA_UI): TASK_DATA_MD {
        const obj: TASK_DATA_MD = {
            styles: {
                dotColor: TaskMdLogic.getDotColor(data),
                textColor: TaskMdLogic.getTextColor(data),
            },
            tableData: TaskMdLogic.tableData(data),
            data: {
                actionOptions: TaskMdLogic.getActionOptions(data)
            }
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

    private static getDotColor = (data: TASK_DATA_UI): string => {
        let res;
        if (data.status === TASK_STATUS.pending) {
            res = MDClass.colors.lightBlue;
        } else if (data.status === TASK_STATUS.inProgress) {
            res = MDClass.colors.yellow;
        } else if (data.status === TASK_STATUS.rejected) {
            res = MDClass.colors.red;
        } else if (data.status === TASK_STATUS.completed) {
            res = MDClass.colors.green;
        } else if (data.status === TASK_STATUS.cancelled) {
            res = MDClass.colors.purple;
        }
        return res;
    };

    private static getTextColor = (data: TASK_DATA_UI): string => {
        let res;
        if (data.status === TASK_STATUS.rejected) {
            res = MDClass.colors.red;
        } else if (data.status === TASK_STATUS.completed) {
            res = MDClass.colors.grey;
        } else {
            res = MDClass.colors.black;
        }
        return res;
    };

    private static getActionOptions = (data: TASK_DATA_UI): TASK_ACTION_OPTIONS => {
        const res: TASK_ACTION_OPTIONS = {};

        if (data.status === TASK_STATUS.inProgress || data.status === TASK_STATUS.pending) {
            res[TASK_ACTION.complete] = true;
            res[TASK_ACTION.cancel] = true;
        }
        return res;
    }

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
