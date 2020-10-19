import {
    EVENT_DATA,
    REPORT_DATA,
    TASK_DATA
} from '../../typings/all.typings';
import { Report } from '../../dataClasses/report/report';
import {Event} from "../../dataClasses/event/event";
import { Task } from "../../dataClasses/task/task";



export class Converting {

    public static Arr_REPORT_DATA_to_Arr_Report = (reportDataArr: REPORT_DATA[]): Report[] => {
        const res: Report[] = [];
        //    todo data vaidation
        if ( Array.isArray(reportDataArr) ) {
            reportDataArr.forEach((reportData: REPORT_DATA) => {
                res.push(new Report(reportData));
            });
        }
        return res;
    }

    public static Arr_TASK_DATA_to_Arr_Task = (taskDataArr: TASK_DATA[]): Task [] => {
        const res: Task[] = [];
        //    todo data vaidation
        if ( Array.isArray(taskDataArr) ) {
            taskDataArr.forEach((taskData: TASK_DATA) => {
                res.push(new Task(taskData));
            });
        }
        return res;
    }

    public static Arr_EVENT_DATA_to_Arr_Event = (eventDataArr: EVENT_DATA[]): Event[] => {
        const res: Event[] = [];
        //    todo data vaidation
        if ( Array.isArray(eventDataArr) ) {
            eventDataArr.forEach((eventData: EVENT_DATA) => {
                res.push(new Event(eventData));
            });
        }
        return res;
    }


    public static base64_to_Buffer = (base64: string): Buffer => {
        return new Buffer(base64, "base64");
    }

    public static Buffer_to_base64 = (buffer: Buffer): string => {
        return buffer.toString('base64');
    }



}
