import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {MS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    COMM_RELAY_TYPE,
    FR_DATA_UI,
    ID_OBJ,
    ID_TYPE,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_REQUEST_DATA_UI,
    MISSION_TYPE,
    REP_OBJ_KEY,
    REPORT_DATA,
    TARGET_TYPE
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {MissionRequest} from '../../../../../classes/dataClasses/missionRequest/missionRequest';
import {MissionRequestMdLogic} from '../../../../../classes/modeDefineTSSchemas/missionRequest/missionRequestMdLogic';
import {AirVehicleManager} from '../airVehicle/airVehicleManager';
import {MissionRouteManager} from '../missionRoute/missionRouteManager';
import {FrManager} from '../fr/frManager';

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
    };

    private getMissionsFollowingFR = (frId: ID_TYPE): MISSION_REQUEST_DATA[] => {
        const res = [];
        this.missionRequests.forEach((mission: MissionRequest) => {
            const missionData: MISSION_REQUEST_DATA = mission.toJsonForSave();
            if (missionData.missionType === MISSION_TYPE.Servoing && missionData.servoingMissionRequest
                && missionData.servoingMissionRequest.targetType === TARGET_TYPE.FR && missionData.servoingMissionRequest.targetId === frId) {
                res.push(missionData);
            } else if (missionData.missionType === MISSION_TYPE.CommRelay && missionData.commRelayMissionRequest
                && missionData.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Follow && missionData.commRelayMissionRequest.missionData.FRs
                && missionData.commRelayMissionRequest.missionData.FRs.indexOf(frId) !== -1) {
                res.push(missionData);
            }
        });
        return res;
    };

    private missionRequestAction = (missionData: MISSION_REQUEST_ACTION_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToMS(MS_API.missionRequestAction, missionData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;

                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        console.log('error missionRequestAction', JSON.stringify(data));
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log('error missionRequestAction', JSON.stringify(data));
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

    private createMissionRequest = (missionData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToMS(MS_API.createMissionRequest, missionData)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });
        });
    };

    private updateMissionInDB = (missionData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToMS(MS_API.updateMissionInDB, missionData)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });
        });
    };

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
    };

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
            const airVehicle = AirVehicleManager.getAVById(missionRequest[REP_OBJ_KEY[missionRequest.missionType]].droneId);
            let frs: FR_DATA_UI[] = [];
            if (missionRequest.missionType === MISSION_TYPE.CommRelay && missionRequestDataUI.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Follow) {
                frs = FrManager.getFRsByIds(missionRequestDataUI.commRelayMissionRequest.missionData.FRs || []);
            } else if (missionRequest.missionType === MISSION_TYPE.Servoing) {
                frs = FrManager.getFRsByIds([missionRequestDataUI.servoingMissionRequest.targetId]);
            }
            missionRequestDataUI.modeDefine = MissionRequestMdLogic.validate(missionRequestDataUI, airVehicle, frs);

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
            MissionRouteManager.sendDataToUI();
            resolve(res);

        });
    };

    private getMissionRequestById = (missionId: ID_TYPE) => {
        return this.missionRequests.find(element => element.id === missionId);
    };

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
    public static getMissionRequestById = MissionRequestManager.instance.getMissionRequestById;

    // public static updateAllReports = MissionRequestManager.instance.updateAllReports;
    // public static readReport = MissionRequestManager.instance.readReport;
    // public static deleteReport = MissionRequestManager.instance.deleteReport;
    // public static deleteAllReport = MissionRequestManager.instance.deleteAllReport;

    public static sendDataToUI = MissionRequestManager.instance.sendDataToUI;
    public static getMissionsFollowingFR = MissionRequestManager.instance.getMissionsFollowingFR;


    // endregion API uncions

}
