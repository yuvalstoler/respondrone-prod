import {Converting} from '../../../../../classes/applicationClasses/utility/converting';
import {Report} from '../../../../../classes/dataClasses/report/report';

import {MS_API, RS_API, TS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    FILE_FS_DATA,
    ID_OBJ,
    ID_TYPE,
    LINKED_REPORT_DATA,
    MEDIA_TYPE,
    MISSION_DATA,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_REQUEST_DATA_UI,
    MISSION_TYPE,
    OSCC_TASK_ACTION,
    REPORT_DATA,
    REPORT_DATA_UI
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {EventManager} from '../event/eventManager';
import {ReportMdLogic} from '../../../../../classes/modeDefineTSSchemas/reports/reportMdLogic';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {CommRelayMissionRequest} from "../../../../../classes/dataClasses/missionRequest/commRelayMissionRequest";
import {ServoingMissionRequest} from "../../../../../classes/dataClasses/missionRequest/servoingMissionRequest";
import {ScanMissionRequest} from "../../../../../classes/dataClasses/missionRequest/scanMissionRequest";
import {ObservationMissionRequest} from "../../../../../classes/dataClasses/missionRequest/observationMissionRequest";
import {FollowPathMissionRequest} from "../../../../../classes/dataClasses/missionRequest/followPathMissionRequest";
import {DeliveryMissionRequest} from "../../../../../classes/dataClasses/missionRequest/deliveryMissionRequest";
import {MissionRequestMdLogic} from "../../../../../classes/modeDefineTSSchemas/missionRequest/missionRequestMdLogic";

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class MissionRequestManager {


    private static instance: MissionRequestManager = new MissionRequestManager();


    missionRequests: MissionRequest[] = [];

    private constructor() {
        this.getMissionRequestsFromMS();

    }

    private getMissionRequestsFromMS = () => {
        RequestManager.requestToMS(MS_API.readAllMissionRequest, {})
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                if ( data.success ) {
                    this.missionRequests = Converting.Arr_MISSION_REQUEST_DATA_to_Arr_MissionRequest(data.data);
                }
                else {
                    //todo logger
                    console.log('error getReportsFromRS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getReportsFromRS', JSON.stringify(data));
            });
    };
    private getMissionRequests = (): MISSION_REQUEST_DATA[] => {
        const res: MISSION_REQUEST_DATA[] = [];
        this.missionRequests.forEach((mission: MissionRequest) => {
            res.push(mission.toJsonForSave());
        });
        return res;
    }

    private missionRequestAction = (data: MISSION_REQUEST_ACTION_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToMS(MS_API.missionRequestAction, data)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;

                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    };

    // private updateAllReports = (reportData: REPORT_DATA[]): Promise<ASYNC_RESPONSE> => {
    //     return new Promise((resolve, reject) => {
    //         const res: ASYNC_RESPONSE = {success: false};
    //         this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(reportData);
    //         res.success = true;
    //         this.sendDataToUI();
    //         EventManager.sendDataToUI();
    //         resolve(res);
    //
    //     });
    // }
    private createMissionRequest = (data: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToMS(MS_API.createMissionRequest, data)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });
        });
    }

    // private readReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
    //     return new Promise((resolve, reject) => {
    //         const res: ASYNC_RESPONSE = {success: false};
    //
    //         const findedReport: Report = this.reports.find((report: Report) => {
    //             return report.id === reportIdData.id;
    //         });
    //         if ( findedReport ) {
    //             res.success = true;
    //             res.data = findedReport;
    //         }
    //         resolve(res);
    //     });
    // }
    private readAllMissionRequest = (requestData): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            // this.reports.forEach((report: Report) => {
            //     res.data.push(report.toJsonForSave());
            // });
            res.data = this.getDataForUI();
            resolve(res);
        });
    }
    // private deleteReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
    //     return new Promise((resolve, reject) => {
    //         const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
    //         RequestManager.requestToRS(RS_API.deleteReport, reportIdData)
    //             .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
    //                 res.data = data.data;
    //                 res.success = data.success;
    //                 if ( data.success ) {
    //                     resolve(res);
    //                 }
    //                 else {
    //                     reject(res);
    //                 }
    //             })
    //             .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
    //                 console.log(data);
    //                 reject(data);
    //             });
    //     });
    // }
    // private deleteAllReport = (): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
    //     return new Promise((resolve, reject) => {
    //         const res: ASYNC_RESPONSE = {success: false};
    //         RequestManager.requestToRS(RS_API.deleteAllReport, {})
    //             .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
    //                 res.data = data.data;
    //                 res.success = data.success;
    //                 res.description = data.description;
    //
    //                 if ( data.success ) {
    //                     resolve(res);
    //                 }
    //                 else {
    //                     reject(res);
    //                 }
    //             })
    //             .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
    //                 console.log(data);
    //                 reject(data);
    //             });
    //     });
    // }


    private getDataForUI = (): MISSION_REQUEST_DATA_UI[] => {
        const res: MISSION_REQUEST_DATA_UI[] = [];
        this.missionRequests.forEach((missionRequest: MissionRequest) => {
            const missionRequestDataUI: MISSION_REQUEST_DATA_UI = missionRequest.toJsonForUI();
            missionRequestDataUI.modeDefine = MissionRequestMdLogic.validate(missionRequestDataUI);

            res.push(missionRequestDataUI);
        });
        return res;
    };

    private updateAllMissionRequests = (data: MISSION_REQUEST_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.missionRequests = Converting.Arr_MISSION_REQUEST_DATA_to_Arr_MissionRequest(data);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }


    private sendDataToUI = (): void => {
        const jsonForSend: MISSION_REQUEST_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_missionRequests', jsonForSend);
    };

    // region API uncions

    public static getMissionRequests = MissionRequestManager.instance.getMissionRequests;
    public static createMissionRequest = MissionRequestManager.instance.createMissionRequest;
    public static readAllMissionRequest = MissionRequestManager.instance.readAllMissionRequest;
    public static updateAllMissionRequests = MissionRequestManager.instance.updateAllMissionRequests;
    public static missionRequestAction = MissionRequestManager.instance.missionRequestAction;

    // public static updateAllReports = MissionRequestManager.instance.updateAllReports;
    // public static readReport = MissionRequestManager.instance.readReport;
    // public static deleteReport = MissionRequestManager.instance.deleteReport;
    // public static deleteAllReport = MissionRequestManager.instance.deleteAllReport;

    public static sendDataToUI = MissionRequestManager.instance.sendDataToUI;


    // endregion API uncions

}
