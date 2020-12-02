import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    MISSION_REQUEST_ACTION,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_STATUS,
    MISSION_STATUS_UI,
    MISSION_TYPE,
    REP_ARR_KEY,
    REP_OBJ_KEY,
    REPORT_DATA,
    ROUTE_STATUS,
    SOURCE_TYPE,
    TMM_RESPONSE
} from "../../../../../classes/typings/all.typings";
import {
    CommRelayMissionRep_API,
    DBS_API,
    DeliveryMissionRep_API,
    ObservationMissionRep_API,
    PatrolMissionRep_API,
    ScanMissionRep_API,
    ServoingMissionRep_API,
    TMM_API
} from "../../../../../classes/dataClasses/api/api_enums";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
import {DataUtility} from "../../../../../classes/applicationClasses/utility/dataUtility";
import {CommRelayMissionRequest} from "../../../../../classes/dataClasses/missionRequest/commRelayMissionRequest";
import {ServoingMissionRequest} from "../../../../../classes/dataClasses/missionRequest/servoingMissionRequest";
import {ScanMissionRequest} from "../../../../../classes/dataClasses/missionRequest/scanMissionRequest";
import {ObservationMissionRequest} from "../../../../../classes/dataClasses/missionRequest/observationMissionRequest";
import {FollowPathMissionRequest} from "../../../../../classes/dataClasses/missionRequest/followPathMissionRequest";
import {DeliveryMissionRequest} from "../../../../../classes/dataClasses/missionRequest/deliveryMissionRequest";
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {RepositoryManager} from "../repositoryManager/repositoryManager";
import {MissionRoute} from "../../../../../classes/dataClasses/missionRoute/missionRoute";
import {MissionRouteManager} from "../missionRoute/missionRouteManager";

const pollingInterval = 5000;


export class MissionRequestManager {


    private static instance: MissionRequestManager = new MissionRequestManager();

    missionRequests: MissionRequest[] = [];
    missionTypes: MISSION_TYPE[] = [MISSION_TYPE.CommRelay, MISSION_TYPE.Patrol, MISSION_TYPE.Scan, MISSION_TYPE.Observation, MISSION_TYPE.Servoing] // Object.values(MISSION_TYPE);

    private constructor() {
        this.initAllMissionRequests();
    }

    private initAllMissionRequests = () => {
        this.getMissionRequestsFromDBS()
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                this.startUpdateMissionRequests();
                //    todo send to listeners
                UpdateListenersManager.updateMissionRequestListeners();
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                setTimeout(() => {

                    this.initAllMissionRequests();
                }, 5000);
            });
    }
    // ------------------
    private startUpdateMissionRequests = () => {
        setInterval(() => {
            this.missionTypes.forEach((missionType: MISSION_TYPE) => {
                const request = this.sendGetMissionRequest(missionType, {});
                if (request) {
                    request
                        .then((data: ASYNC_RESPONSE<{ collectionVersion: number, id: string }>) => {
                            const repData = data.data;
                            if (data.success && repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY[missionType])) {
                                if (repData.collectionVersion !== RepositoryManager.getCollectionVersion(missionType)) {
                                    if (repData.collectionVersion === 0) { // if collection is reset
                                        this.deleteAllMissions(missionType);
                                    }
                                    else {
                                        const promiseArr = [];
                                        let promise;

                                        repData[REP_ARR_KEY[missionType]].forEach((missionData: MISSION_REQUEST_DATA) => {
                                            switch (missionData.lastAction) {
                                                case LAST_ACTION.Insert:
                                                case LAST_ACTION.Update: {
                                                    const missionRequest = this.getMissionRequestById(missionData.id);
                                                    if (missionRequest) {
                                                        const missionForSave = this.newMissionRequestClass(missionRequest.missionType, missionRequest.toJsonForSave());
                                                        delete missionData.missionType;
                                                        missionForSave.setValues(missionData);
                                                        this.checkIfToUpdateStatus(missionForSave);
                                                        promise = this.saveMissionInDB(missionForSave.toJsonForSave());
                                                        promiseArr.push(promise)
                                                    }
                                                    break;
                                                }
                                                case LAST_ACTION.Delete: {
                                                    promise = this.deleteMissionFromDB({id: missionData.id});
                                                    promiseArr.push(promise)
                                                    break;
                                                }
                                            }
                                        })
                                        Promise.all(promiseArr)
                                            .then((data) => {
                                                RepositoryManager.updateCollectionVersion(missionType, repData.collectionVersion);
                                            })
                                            .catch((data) => {
                                                console.log('promiseAll failed', JSON.stringify(data))
                                            })
                                    }
                                }
                            }
                            else {
                                console.log('error getLastMissions', missionType, JSON.stringify(repData));
                            }
                        })
                        .catch((err) => {
                            console.log('error getLastMissions', missionType ,JSON.stringify(err));
                        });
                }
            });
        }, pollingInterval)
    }
    // ------------------
    private checkIfToUpdateStatus = (missionRequest: MissionRequest) => {
        if (missionRequest[REP_OBJ_KEY[missionRequest.missionType]].status === MISSION_STATUS.Completed
            && missionRequest.missionStatus !== MISSION_STATUS_UI.Completed) {
                missionRequest.missionStatus = MISSION_STATUS_UI.Completed;
        }

        if (missionRequest[REP_OBJ_KEY[missionRequest.missionType]].status === MISSION_STATUS.Cancelled
            && missionRequest.missionStatus !== MISSION_STATUS_UI.Cancelled) {
            missionRequest.missionStatus = MISSION_STATUS_UI.Cancelled;
        }

        if (missionRequest[REP_OBJ_KEY[missionRequest.missionType]].status === MISSION_STATUS.InProgress
            && missionRequest.missionStatus === MISSION_STATUS_UI.WaitingForApproval) {
            missionRequest.missionStatus = MISSION_STATUS_UI.Approved;
            MissionRouteManager.onApproveMissionRoute()
        }
        if (missionRequest[REP_OBJ_KEY[missionRequest.missionType]].status === MISSION_STATUS.InProgress
            && missionRequest.missionStatus === MISSION_STATUS_UI.Approved) {
            missionRequest.missionStatus = MISSION_STATUS_UI.InProgress;
            MissionRouteManager.onApproveMissionRoute()
        }
    }
    // ------------------
    private getMissionRequestsFromDBS = (): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllMissionRequest, {})
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                    if ( data.success ) {
                        this.missionRequests = Converting.Arr_MISSION_REQUEST_DATA_to_Arr_MissionRequest(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getMissionRequestsFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                    //todo logger
                    console.log('error getMissionRequestsFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
    };
    // ------------------
    private createMissionRequest = (missionRequestData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const newMissionRequest: MissionRequest = this.newMissionRequestClass(missionRequestData.missionType, missionRequestData);
            this.sendToTMM(newMissionRequest)
                .then((data: ASYNC_RESPONSE<TMM_RESPONSE>) => {
                    const TMMResponse: TMM_RESPONSE = data.data;
                    if (TMMResponse.success && TMMResponse.entityId) {
                        newMissionRequest.id = TMMResponse.entityId;
                        newMissionRequest.time = missionRequestData.time || Date.now();
                        newMissionRequest.idView = missionRequestData.idView || DataUtility.generateIDForView();

                        this.saveMissionInDB(newMissionRequest.toJsonForSave())
                            .then((result: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                res.data = result.data;
                                res.success = result.success;
                                res.description = result.description;
                                resolve(res);
                            })
                            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                console.log(data);
                                reject(data);
                            });
                    }
                    else {
                        console.log('failed response from TMM', JSON.stringify(TMMResponse))
                    }

                })
                .catch((data) => {
                    console.log('failed send to TMM', JSON.stringify(data))
                })
        });
    }
    // ------------------
    private createMissionRequestFromMGW = (missionRequestData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            missionRequestData.missionStatus = MISSION_STATUS_UI.New
            missionRequestData.source = SOURCE_TYPE.MRF;
            missionRequestData.id = DataUtility.generateID();
            missionRequestData.time = missionRequestData.time || Date.now();
            missionRequestData.idView = missionRequestData.idView || DataUtility.generateIDForView();

            const newMissionRequest: MissionRequest = this.newMissionRequestClass(missionRequestData.missionType, missionRequestData);
            this.saveMissionInDB(newMissionRequest.toJsonForSave())
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }
    // ------------------
    private sendGetMissionRequest = (missionType: MISSION_TYPE, data: any): Promise<ASYNC_RESPONSE> => {
        const collectionVersion = RepositoryManager.getCollectionVersion(missionType);
        if (collectionVersion !== undefined) {
            switch (missionType) {
                case MISSION_TYPE.CommRelay:
                    return RequestManager.requestToCommRelayMissionRep(`${CommRelayMissionRep_API.getLastCommRelayMissionRequests}/${collectionVersion}`,{})
                    break;
                case MISSION_TYPE.Scan:
                    return RequestManager.requestToScanMissionRep(`${ScanMissionRep_API.getLastScanMissionRequests}/${collectionVersion}`,{})
                    break;
                case MISSION_TYPE.Observation:
                    return RequestManager.requestToObservationMissionRep(`${ObservationMissionRep_API.getLastObservationMissionRequests}/${collectionVersion}`,{})
                    break;
                case MISSION_TYPE.Patrol:
                    return RequestManager.requestToPatrolMissionRep(`${PatrolMissionRep_API.getLastFollowPathMissionRequests}/${collectionVersion}`,{})
                    break;
                case MISSION_TYPE.Servoing:
                    return RequestManager.requestToServoingMissionRep(`${ServoingMissionRep_API.getLastServoingMissionRequests}/${collectionVersion}`,{})
                    break;
                case MISSION_TYPE.Delivery:
                    return RequestManager.requestToDeliveryMissionRep(`${DeliveryMissionRep_API.getLastDeliveryMissionRequests}/${collectionVersion}`,{})
                    break;
                default:
                    return undefined;
            }
        }
    }
    // ------------------
    private newMissionRequestClass = (type: MISSION_TYPE, data: MISSION_REQUEST_DATA): MissionRequest => {
        let newMissionRequest: MissionRequest;
        switch (type) {
            case MISSION_TYPE.CommRelay:
                newMissionRequest = new CommRelayMissionRequest(data);
                break;
            case MISSION_TYPE.Servoing:
                newMissionRequest = new ServoingMissionRequest(data);
                break;
            case MISSION_TYPE.Scan:
                newMissionRequest = new ScanMissionRequest(data);
                break;
            case MISSION_TYPE.Observation:
                newMissionRequest = new ObservationMissionRequest(data);
                break;
            case MISSION_TYPE.Patrol:
                newMissionRequest = new FollowPathMissionRequest(data);
                break;
            case MISSION_TYPE.Delivery:
                newMissionRequest = new DeliveryMissionRequest(data);
                break;
        }
        return newMissionRequest;
    }
    // ------------------
    private sendToTMM = (missionRequest: MissionRequest) => {
        return new Promise((resolve, reject) => {
            let url;
            const dataForTMM = missionRequest.toJsonForTMM();

            switch (missionRequest.missionType) {
                case MISSION_TYPE.CommRelay:
                    url = TMM_API.commRelayMissionRequest;
                    break;
                case MISSION_TYPE.Servoing:
                    url = TMM_API.servoingMissionRequest;
                    break;
                case MISSION_TYPE.Scan:
                    url = TMM_API.scanMissionRequest;
                    break;
                case MISSION_TYPE.Observation:
                    url = TMM_API.observationMissionRequest;
                    break;
                case MISSION_TYPE.Patrol:
                    url = TMM_API.followPathMissionRequest;
                    break;
                case MISSION_TYPE.Delivery:
                    url = TMM_API.deliveryMissionRequest;
                    break;
            }

            RequestManager.requestToTMM(url, dataForTMM)
                .then((data: ASYNC_RESPONSE<TMM_RESPONSE>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<TMM_RESPONSE>) => {
                    reject(data);
                });

            // const data = {success: true, data: {success: true, description: '', entityId: '' + Date.now()}} // TODO change
            // resolve(data);
        });
    }
    // ------------------
    private updateRepository = (missionType: MISSION_TYPE, dataForRep: any): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            let url;
            let promise;

            switch (missionType) {
                case MISSION_TYPE.CommRelay:
                    url = CommRelayMissionRep_API.updateCommRelayMissionRequest;
                    promise = RequestManager.requestToCommRelayMissionRep(url, dataForRep);
                    break;
                case MISSION_TYPE.Scan:
                    url = ScanMissionRep_API.updateScanMissionRequest;
                    promise = RequestManager.requestToScanMissionRep(url, dataForRep);
                    break;
                case MISSION_TYPE.Observation:
                    url = ObservationMissionRep_API.updateObservationMission;
                    promise = RequestManager.requestToObservationMissionRep(url, dataForRep);
                    break;
                case MISSION_TYPE.Patrol:
                    url = PatrolMissionRep_API.updateFollowPathMissionRequest;
                    promise = RequestManager.requestToPatrolMissionRep(url, dataForRep);
                    break;
                case MISSION_TYPE.Servoing:
                    url = ServoingMissionRep_API.updateServoingMissionRequest;
                    promise = RequestManager.requestToServoingMissionRep(url, dataForRep)
                    break;
                case MISSION_TYPE.Delivery:
                    url = DeliveryMissionRep_API.updateDeliveryMissionRequest;
                    promise = RequestManager.requestToDeliveryMissionRep(url, dataForRep);
                    break;
            }
            if (promise) {
                promise
                    .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                        resolve(data);
                    })
                    .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                        resolve(data);
                    });
            }
            else {
                reject({success: false, description: 'Incorrect mission type'});
            }
        });
    }
    // ------------------
    private readAllMissionRequest = (requestData): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            this.missionRequests.forEach((data: MissionRequest) => {
                res.data.push(data.toJsonForSave());
            });
            resolve(res);
        });
    }
    // ------------------
    private getMissionRequests = (idObj: ID_OBJ = undefined): MISSION_REQUEST_DATA[] => {
        const res: MISSION_REQUEST_DATA[] = [];
        if ( idObj ) {
            const found = this.missionRequests.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJsonForSave());
            }
        }
        else {
            this.missionRequests.forEach((missionRequest: MissionRequest) => {
                res.push(missionRequest.toJsonForSave());
            });
        }
        return res;
    };
    // ------------------
    private getMissionRequestById = (missionRequestId: ID_TYPE): MissionRequest => {
        return this.missionRequests.find(element => element.id === missionRequestId)
    }
    // ------------------
    private missionRequestAction = (data: MISSION_REQUEST_ACTION_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const missionRequest = this.getMissionRequestById(data.missionRequestId);
            const missionRequestData: MISSION_REQUEST_DATA = missionRequest.toJsonForSave();
            if (missionRequest) {
                if (missionRequest.missionStatus === MISSION_STATUS_UI.New) {
                    switch (data.action) {
                        case MISSION_REQUEST_ACTION.Accept: {
                            missionRequestData.missionStatus = MISSION_STATUS_UI.Pending;
                            missionRequestData[REP_OBJ_KEY[missionRequest.missionType]].droneId = data.avIds[0];
                            this.createMissionRequest(missionRequestData)
                                .then((data) => {
                                    if (data.success) {
                                        this.deleteMissionFromDB({id: missionRequest.id})
                                        resolve(data);
                                    }
                                    else {
                                        resolve(data);
                                    }
                                });
                            break;
                        }
                        case MISSION_REQUEST_ACTION.Reject: {
                            this.deleteMissionFromDB({id: missionRequest.id})
                                .then((data: ASYNC_RESPONSE) => {
                                    resolve(data)
                                })
                                .catch((data: ASYNC_RESPONSE) => {
                                    reject(data)
                                });
                            break;
                        }
                    }
                }
                else {
                    let  missionDataForRep = missionRequest.toJsonForRep();
                    switch (data.action) {
                        case MISSION_REQUEST_ACTION.Approve: {
                            missionDataForRep.lastAction = LAST_ACTION.Update;
                            missionDataForRep[REP_OBJ_KEY[missionRequest.missionType]].status = MISSION_STATUS.InProgress;
                            break;
                        }
                        case MISSION_REQUEST_ACTION.Complete: {
                            missionDataForRep.lastAction = LAST_ACTION.Update;
                            missionDataForRep[REP_OBJ_KEY[missionRequest.missionType]].status = MISSION_STATUS.Completed;
                            break;
                        }
                        case MISSION_REQUEST_ACTION.Reject:
                        case MISSION_REQUEST_ACTION.Cancel: {
                            missionDataForRep.lastAction = LAST_ACTION.Update;
                            missionDataForRep[REP_OBJ_KEY[missionRequest.missionType]].status = MISSION_STATUS.Cancelled;
                            break;
                        }
                    }

                    this.updateRepository(missionRequest.missionType, missionDataForRep)
                        .then((data: ASYNC_RESPONSE) => {
                            resolve(data);
                        })
                        .catch((data) => {
                            reject(data);
                        });
                }
            }
            else {
                res.description = 'mission doesn\'t exist';
                reject(res);
            }
        });
    };
    // --------------------------
    private deleteMissionFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.deleteMissionRequest, idObj)
                .then((data: ASYNC_RESPONSE) => {
                    if (data.success) {
                        const index = this.missionRequests.findIndex(element => element.id === idObj.id);
                        if (index !== -1) {
                            this.missionRequests.splice(index, 1);
                        }
                        UpdateListenersManager.updateMissionRequestListeners();
                    }
                    else {
                        console.log('error saveMissionInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    console.log('error saveMissionInDB', JSON.stringify(data));
                    reject(data);
                })
        })

    }
    // --------------------------
    private saveMissionInDB = (missionRequestData: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.createMissionRequest, missionRequestData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    if (data.success) {
                        let missionRequest: MissionRequest = this.getMissionRequestById(missionRequestData.id);
                        if ( missionRequest ) {
                            missionRequest.setValues(data.data);
                        }
                        else {
                            missionRequest = this.newMissionRequestClass(missionRequestData.missionType, missionRequestData);
                            if (missionRequest) {
                                this.missionRequests.push(missionRequest);
                            }
                        }
                        UpdateListenersManager.updateMissionRequestListeners();
                    }
                    else {
                        console.log('error saveMissionInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data) => {
                    console.log('error saveMissionInDB', JSON.stringify(data));
                    reject(data);
                });
        });
    }
    // --------------------------
    private updateMissionInDB = (missionRequestData: MISSION_REQUEST_DATA) => {
       return this.saveMissionInDB(missionRequestData);
    };
    // --------------------------
    private onUpdateMissionRoute = (missionRoute: MissionRoute) => {
        console.log("onUpdateMissionRoute", JSON.stringify(missionRoute));
        const missionRequest: MissionRequest = this.getMissionRequestById(missionRoute.requestId);
        if (missionRequest) {
            if (missionRequest.missionStatus === MISSION_STATUS_UI.Pending) {
                const missionRequestData = missionRequest.toJsonForSave()
                missionRequestData.missionStatus = MISSION_STATUS_UI.WaitingForApproval;
                this.saveMissionInDB(missionRequestData);
            }
            if ((missionRequest.missionStatus === MISSION_STATUS_UI.Approved || missionRequest.missionStatus === MISSION_STATUS_UI.Pending) && missionRoute.status === ROUTE_STATUS.Active) {
                const missionRequestData: MISSION_REQUEST_DATA = missionRequest.toJsonForSave();
                missionRequestData.missionStatus = MISSION_STATUS_UI.InProgress;
                this.saveMissionInDB(missionRequestData);
            }
        }
        else {
            console.log("onUpdateMissionRoute missionRequest")
        }
    }
    // --------------------------
    private onRemoveMissionRoute = (missionRoute: MissionRoute) => {
        const missionRequest: MissionRequest = this.getMissionRequestById(missionRoute.requestId);
        if (missionRequest && missionRequest.missionStatus === MISSION_STATUS_UI.WaitingForApproval) {
            const missionRequestData = missionRequest.toJsonForSave()
            missionRequestData.missionStatus = MISSION_STATUS_UI.Pending;
            this.saveMissionInDB(missionRequestData);
        }
    }
    // --------------------------
    private deleteAllMissions = (missionType: MISSION_TYPE) => {
        RequestManager.requestToDBS(DBS_API.deleteAllMissionRequest, {})
            .then((data) => {
                console.log('all missionRequests deleted');
                this.missionRequests = [];
                RepositoryManager.updateCollectionVersion(missionType, 0);
            })
            .catch((data) => {});
    }


    // region API uncions
    public static createMissionRequestFromMGW = MissionRequestManager.instance.createMissionRequestFromMGW;
    public static createMissionRequest = MissionRequestManager.instance.createMissionRequest;
    public static updateMissionInDB = MissionRequestManager.instance.updateMissionInDB;
    public static readAllMissionRequest = MissionRequestManager.instance.readAllMissionRequest;
    public static getMissionRequests = MissionRequestManager.instance.getMissionRequests;
    public static missionRequestAction = MissionRequestManager.instance.missionRequestAction;
    public static getMissionRequestById = MissionRequestManager.instance.getMissionRequestById;
    public static onUpdateMissionRoute = MissionRequestManager.instance.onUpdateMissionRoute;


    // endregion API uncions

}
