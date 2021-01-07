import {
    ASYNC_RESPONSE,
    GIMBAL_CONTROL,
    GIMBAL_CONTROL_ACTION,
    GIMBAL_CONTROL_REQUEST_OSCC,
    GIMBAL_CONTROL_DATA_FOR_MGW,
    GIMBAL_CONTROL_OBJ,
    GIMBAL_CONTROL_REQUEST_MGW,
    GIMBAL_REQUEST_STATUS,
    GIMBAL_CONTROL_USER,
    GIMBAL_DATA,
    ID_TYPE,
    MAP,
    VIDEO_URL_KEY, GIMBAL_ACTION_OSCC
} from '../../../../../classes/typings/all.typings';
import {Gimbal} from '../../../../../classes/dataClasses/gimbal/Gimbal';
import {GimbalManager} from '../gimbal/gimbalManager';
import {FrManager} from '../fr/frManager';
import {RequestManager} from '../../AppService/restConnections/requestManager';
import {CCGW_API} from '../../../../../classes/dataClasses/api/api_enums';

const projConf = require('./../../../../../../../../config/projConf.json');
const gimbalControlRequestTimeoutSec = projConf.gimbalControlRequestTimeoutSec || 15;

export class GimbalControlManager {


    private static instance: GimbalControlManager = new GimbalControlManager();

    gimbalControls: MAP<GIMBAL_CONTROL> = {}; // key - AirVehicleId
    controlRequestTimeouts: MAP<MAP<any>> = {}; // {[airVehicleId]: {[videoUrlKey]: any}}
    sendGimbalControlInterval;

    private constructor() {
        this.sendGimbalControlData();
    }
    // ------------------
    private updateGimbalIfNeeded = (gimbalData: GIMBAL_DATA) => {
        if (!this.gimbalControls[gimbalData.droneId]) {
            this.gimbalControls[gimbalData.droneId] = {
                [VIDEO_URL_KEY.infraredVideoURL]: {
                    userId: undefined,
                    userText: GIMBAL_CONTROL_USER.Available,
                    isLocked: false
                },
                [VIDEO_URL_KEY.opticalVideoURL]: {
                    userId: undefined,
                    userText: GIMBAL_CONTROL_USER.Available,
                    isLocked: false
                }
            };
        }
    }
    // ------------------
    private removeGimbals = (updatedGimbals: MAP<Gimbal>) => {
        for (const droneId in this.gimbalControls) {
            if (!updatedGimbals[droneId]) {
                delete this.gimbalControls[droneId];
            }
        }
    }
    // ------------------
    private getGimbalControlDataByDroneId = (droneId) => {
        return this.gimbalControls[droneId];
    }
    // ------------------
    private requestGimbalControlFromMGW = (gimbalControlRequest: GIMBAL_CONTROL_REQUEST_MGW) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const obj: {gimbal: Gimbal, videoUrlKey: VIDEO_URL_KEY} = GimbalManager.getGimbalByVideoSource(gimbalControlRequest.videoSource);

            if (obj && this.gimbalControls[obj.gimbal.droneId]) {
                const droneId = obj.gimbal.droneId;
                const videoUrlKey = obj.videoUrlKey;

                const gimbalControl: GIMBAL_CONTROL_OBJ = this.gimbalControls[droneId][videoUrlKey];
                gimbalControl.request = {
                    userId: gimbalControlRequest.userId,
                    userText: FrManager.getFRNameById(gimbalControlRequest.userId),
                    status: GIMBAL_REQUEST_STATUS.InProgress
                };

                if (gimbalControl.isLocked) {
                    this.controlRequestTimeouts[droneId] = this.controlRequestTimeouts[droneId] || {};
                    if (!this.controlRequestTimeouts[droneId][videoUrlKey]) {
                        this.controlRequestTimeouts[droneId][videoUrlKey] = setTimeout(() => {
                            this.passControlToUser(gimbalControl, droneId, videoUrlKey);
                            this.sendGimbalControlData();
                        }, gimbalControlRequestTimeoutSec * 1000);
                    }
                }
                else {
                    this.passControlToUser(gimbalControl, droneId, videoUrlKey);
                }

                this.sendGimbalControlData();
                res.success = true;
            }
            else {
                res.data = 'URL doesnt exist on gimbal';
            }
            resolve(res);
        });

    }
    // ------------------
    private requestGimbalControlFromOSCC = (gimbalControlRequest: GIMBAL_CONTROL_REQUEST_OSCC) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            if (this.gimbalControls[gimbalControlRequest.airVehicleId] && this.gimbalControls[gimbalControlRequest.airVehicleId][gimbalControlRequest.videoUrlKey]) {
                const gimbalControl: GIMBAL_CONTROL_OBJ = this.gimbalControls[gimbalControlRequest.airVehicleId][gimbalControlRequest.videoUrlKey];
                switch (gimbalControlRequest.action) {
                    case GIMBAL_CONTROL_ACTION.takeControl:
                        this.passControlToOSCC(gimbalControl, gimbalControlRequest);
                        if (!(gimbalControl.request && gimbalControl.request.status === GIMBAL_REQUEST_STATUS.InProgress)) {
                            gimbalControl.request = undefined;
                        }
                        break;
                    case GIMBAL_CONTROL_ACTION.releaseControl:
                        if (gimbalControl.request && gimbalControl.request.status === GIMBAL_REQUEST_STATUS.InProgress) {
                            this.passControlToUser(gimbalControl, gimbalControlRequest.airVehicleId, gimbalControlRequest.videoUrlKey);
                        }
                        else {
                            this.makeControlAvailable(gimbalControl);
                        }
                        break;
                    case GIMBAL_CONTROL_ACTION.lockControl:
                        this.passControlToOSCC(gimbalControl, gimbalControlRequest);
                        gimbalControl.isLocked = true;
                        break;
                    case GIMBAL_CONTROL_ACTION.unlockControl:
                        if (gimbalControl.request && gimbalControl.request.status === GIMBAL_REQUEST_STATUS.InProgress) {
                            this.passControlToUser(gimbalControl, gimbalControlRequest.airVehicleId, gimbalControlRequest.videoUrlKey);
                        }
                        else {
                            this.passControlToOSCC(gimbalControl, gimbalControlRequest);
                        }
                        break;
                    case GIMBAL_CONTROL_ACTION.acceptRequestForControl:
                        if (gimbalControl.request && gimbalControl.request.status === GIMBAL_REQUEST_STATUS.InProgress) {
                            this.passControlToUser(gimbalControl, gimbalControlRequest.airVehicleId, gimbalControlRequest.videoUrlKey);
                        }
                    break;
                    case GIMBAL_CONTROL_ACTION.rejectRequestForControl:
                        if (gimbalControl.request && gimbalControl.request.status === GIMBAL_REQUEST_STATUS.InProgress) {
                            gimbalControl.request.status = GIMBAL_REQUEST_STATUS.Reject;
                            this.clearControlTimeout(gimbalControlRequest.airVehicleId, gimbalControlRequest.videoUrlKey);
                        }
                    break;
                }

                this.sendGimbalControlData();
                res.success = true;
                resolve(res);
            }
            else {
                reject(res);
            }
        });
    }
    // -----------------
    private passControlToUser = (gimbalControl: GIMBAL_CONTROL_OBJ, airVehicleId: ID_TYPE, videoUrlKey: string) => {
        gimbalControl.userId = gimbalControl.request.userId;
        gimbalControl.userText = gimbalControl.request.userText;
        gimbalControl.request.status = GIMBAL_REQUEST_STATUS.Accept;
        gimbalControl.isLocked = false;

        this.clearControlTimeout(airVehicleId, videoUrlKey);
    }
    // -----------------
    private passControlToOSCC = (gimbalControl: GIMBAL_CONTROL_OBJ, gimbalControlRequest: GIMBAL_CONTROL_REQUEST_OSCC) => {
        gimbalControl.userId = gimbalControlRequest.userId;
        gimbalControl.userText = gimbalControlRequest.userName;
        gimbalControl.isLocked = false;
    }
    // -----------------
    private makeControlAvailable = (gimbalControl: GIMBAL_CONTROL_OBJ) => {
        gimbalControl.userId = undefined;
        gimbalControl.userText = GIMBAL_CONTROL_USER.Available;
        gimbalControl.isLocked = false;
    }
    // ------------------
    private clearControlTimeout = (airVehicleId: ID_TYPE, videoUrlKey: string) => {
        if (this.controlRequestTimeouts[airVehicleId]) {
            clearTimeout(this.controlRequestTimeouts[airVehicleId][videoUrlKey]);
            delete this.controlRequestTimeouts[airVehicleId][videoUrlKey];
        }
    }
    // ------------------
    private getGimbalControlDataForMobile = () => {
        const data: GIMBAL_CONTROL_DATA_FOR_MGW = {};
        for (const droneId in this.gimbalControls) {
            if (this.gimbalControls[droneId]) {
                for (const videoUrlKey in this.gimbalControls[droneId]) {
                    if (this.gimbalControls[droneId][videoUrlKey].request !== undefined) {
                        data[this.gimbalControls[droneId][videoUrlKey].request.userId] = {
                            videoSource: GimbalManager.getVideoUrl(droneId, VIDEO_URL_KEY[videoUrlKey]),
                            isLocked: this.gimbalControls[droneId][videoUrlKey].isLocked,
                            status: this.gimbalControls[droneId][videoUrlKey].request.status
                        };
                    }
                }
            }
        }
        console.log(data);
        return data;
    }
    // ------------------
    private sendGimbalControlData = () => {
        const dataForMobile = this.getGimbalControlDataForMobile();
        RequestManager.requestToCCG(CCGW_API.updateGimbalControlData, dataForMobile)
            .then((res: ASYNC_RESPONSE) => {
                if (res && res.success) {
                   this.stopSendGimbalControlInterval();
                }
                else {
                    this.startSendGimbalControlInterval();
                }
            })
            .catch((res) => {
                this.startSendGimbalControlInterval();
            });
    }
    // ------------------
    private getGimbalControlData = (body): Promise<ASYNC_RESPONSE<GIMBAL_CONTROL_DATA_FOR_MGW>> => {
        return new Promise((resolve, reject) => {
            const dataForMobile = this.getGimbalControlDataForMobile();
            const res = {success: true, data: dataForMobile};
            resolve(res);
        });
    }
    // ------------------
    private startSendGimbalControlInterval = () => {
        if (!this.sendGimbalControlInterval) {
            this.sendGimbalControlInterval = setInterval(() => {
                this.sendGimbalControlData();
            }, 1000);
        }
    }
    // ------------------
    private stopSendGimbalControlInterval = () => {
        clearInterval(this.sendGimbalControlInterval);
        this.sendGimbalControlInterval = undefined;
    }
    // ------------------
    private isAllowAction = (userId: ID_TYPE, droneId: ID_TYPE, videoUrlKey: string) => {
        return (this.gimbalControls[droneId] && this.gimbalControls[droneId][videoUrlKey].userId === userId);
    }


    // region API uncions
    public static updateGimbalIfNeeded = GimbalControlManager.instance.updateGimbalIfNeeded;
    public static removeGimbals = GimbalControlManager.instance.removeGimbals;
    public static getGimbalControlDataByDroneId = GimbalControlManager.instance.getGimbalControlDataByDroneId;
    public static requestGimbalControlFromMGW = GimbalControlManager.instance.requestGimbalControlFromMGW;
    public static requestGimbalControlFromOSCC = GimbalControlManager.instance.requestGimbalControlFromOSCC;
    public static getGimbalControlData = GimbalControlManager.instance.getGimbalControlData;
    public static isAllowAction = GimbalControlManager.instance.isAllowAction;


    // endregion API uncions

}
