import {
    EVENT_DATA,
    REPORT_DATA
} from '../../typings/all.typings';
import { Report } from '../../dataClasses/report/report';
import {EventClass} from "../../dataClasses/event/event";



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

    public static Arr_EVENT_DATA_to_Arr_Event = (eventDataArr: EVENT_DATA[]): EventClass[] => {
        const res: EventClass[] = [];
        //    todo data vaidation
        if ( Array.isArray(eventDataArr) ) {
            eventDataArr.forEach((eventData: EVENT_DATA) => {
                res.push(new EventClass(eventData));
            });
        }
        return res;
    }
}