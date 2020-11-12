import {
    AV_DATA_REP,
    EVENT_DATA,
    FR_DATA, GIMBAL_DATA, MISSION_DATA,
    MISSION_REQUEST_DATA,
    MISSION_REQUEST_DATA_UI, MISSION_ROUTE_DATA,
    MISSION_TYPE,
    REPORT_DATA,
    TASK_DATA
} from '../../typings/all.typings';
import {Report} from '../../dataClasses/report/report';
import {Event} from "../../dataClasses/event/event";
import {Task} from "../../dataClasses/task/task";
import {FR} from "../../dataClasses/fr/FR";
import {AirVehicle} from "../../dataClasses/airVehicle/airVehicle";
import {CommRelayMissionRequest} from "../../dataClasses/missionRequest/commRelayMissionRequest";
import {MissionRequest} from "../../dataClasses/missionRequest/missionRequest";
import {ServoingMissionRequest} from "../../dataClasses/missionRequest/servoingMissionRequest";
import {ScanMissionRequest} from "../../dataClasses/missionRequest/scanMissionRequest";
import {ObservationMissionRequest} from "../../dataClasses/missionRequest/observationMissionRequest";
import {FollowPathMissionRequest} from "../../dataClasses/missionRequest/followPathMissionRequest";
import {DeliveryMissionRequest} from "../../dataClasses/missionRequest/deliveryMissionRequest";
import {Mission} from "../../dataClasses/mission/mission";
import {MissionRoute} from "../../dataClasses/missionRoute/missionRoute";
import {Gimbal} from "../../dataClasses/gimbal/Gimbal";


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

    public static Arr_FR_DATA_to_Arr_FR = (dataArr: FR_DATA[]): FR[] => {
        const res: FR[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: FR_DATA) => {
                res.push(new FR(data));
            });
        }
        return res;
    }

    public static Arr_AV_DATA_to_Arr_AV = (dataArr: AV_DATA_REP[]): AirVehicle[] => {
        const res: AirVehicle[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: AV_DATA_REP) => {
                res.push(new AirVehicle(data));
            });
        }
        return res;
    }

    public static Arr_MISSION_DATA_to_Arr_Mission = (dataArr: MISSION_DATA[]): Mission[] => {
        const res: Mission[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: MISSION_DATA) => {
                res.push(new Mission(data));
            });
        }
        return res;
    }

    public static Arr_MISSION_ROUTE_DATA_to_Arr_MissionRoute = (dataArr: MISSION_ROUTE_DATA[]): MissionRoute[] => {
        const res: MissionRoute[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: MISSION_ROUTE_DATA) => {
                res.push(new MissionRoute(data));
            });
        }
        return res;
    }
    //Arr_GIMBAL_DATA_to_Arr_Gimbal
    public static Arr_GIMBAL_DATA_to_Arr_Gimbal = (dataArr: GIMBAL_DATA[]): Gimbal[] => {
        const res: Gimbal[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: GIMBAL_DATA) => {
                res.push(new Gimbal(data));
            });
        }
        return res;
    }

    public static Arr_MISSION_REQUEST_DATA_to_Arr_MissionRequest = (dataArr: MISSION_REQUEST_DATA[]): MissionRequest[] => {
        const res: MissionRequest[] = [];
        //    todo data vaidation
        if ( Array.isArray(dataArr) ) {
            dataArr.forEach((data: MISSION_REQUEST_DATA) => {
                switch (data.missionType) {
                    case MISSION_TYPE.CommRelay:
                        res.push(new CommRelayMissionRequest(data));
                        break;
                    case MISSION_TYPE.Servoing:
                        res.push(new ServoingMissionRequest(data));
                        break;
                    case MISSION_TYPE.Scan:
                        res.push(new ScanMissionRequest(data));
                        break;
                    case MISSION_TYPE.Observation:
                        res.push(new ObservationMissionRequest(data));
                        break;
                    case MISSION_TYPE.Patrol:
                        res.push(new FollowPathMissionRequest(data));
                        break;
                    case MISSION_TYPE.Delivery:
                        res.push(new DeliveryMissionRequest(data));
                        break;
                }

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
