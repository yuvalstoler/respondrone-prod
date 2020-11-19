import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {MS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    MISSION_ACTION_OPTIONS, MISSION_REQUEST_ACTION,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_REQUEST_DATA_UI,
    MISSION_STATUS_UI,
    REPORT_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
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
                    console.log('error getMissionRequestsFromMS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getMissionRequestsFromMS', JSON.stringify(data));
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

    private updateMissionInDB = (data: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToMS(MS_API.updateMissionInDB, data)
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
            missionRequestDataUI.actionOptions = missionRequest.actionOptions = this.getActionOptions(missionRequestDataUI);

            res.push(missionRequestDataUI);
        });
        return res;
    };

    private getActionOptions = (data: MISSION_REQUEST_DATA_UI): MISSION_ACTION_OPTIONS => {
        const res: MISSION_ACTION_OPTIONS = {};

        if (data.missionStatus === MISSION_STATUS_UI.New) {
            res[MISSION_REQUEST_ACTION.Accept] = true;
            res[MISSION_REQUEST_ACTION.Reject] = true;
        }
        else if (data.missionStatus === MISSION_STATUS_UI.Pending) {
            res[MISSION_REQUEST_ACTION.Cancel] = true;
        }
        else if (data.missionStatus === MISSION_STATUS_UI.WaitingForApproval) {
            res[MISSION_REQUEST_ACTION.Approve] = true;
            res[MISSION_REQUEST_ACTION.Reject] = true;
            res[MISSION_REQUEST_ACTION.Cancel] = true;
        }
        else if (data.missionStatus === MISSION_STATUS_UI.Approve) {
            res[MISSION_REQUEST_ACTION.Cancel] = true;
        }
        else if (data.missionStatus === MISSION_STATUS_UI.InProgress) {
            res[MISSION_REQUEST_ACTION.Complete] = true;
            res[MISSION_REQUEST_ACTION.Cancel] = true;
        }
        return res;
    }

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
    public static updateMissionInDB = MissionRequestManager.instance.updateMissionInDB;

    // public static updateAllReports = MissionRequestManager.instance.updateAllReports;
    // public static readReport = MissionRequestManager.instance.readReport;
    // public static deleteReport = MissionRequestManager.instance.deleteReport;
    // public static deleteAllReport = MissionRequestManager.instance.deleteAllReport;

    public static sendDataToUI = MissionRequestManager.instance.sendDataToUI;


    // endregion API uncions

}
