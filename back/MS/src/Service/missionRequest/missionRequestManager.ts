import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    LAST_ACTION,
    MISSION_REQUEST_ACTION_OBJ,
    MISSION_REQUEST_DATA,
    MISSION_TYPE, REP_ARR_KEY,
    REPORT_DATA,
    TMM_RESPONSE
} from "../../../../../classes/typings/all.typings";
import {
    CommRelayMissionRep_API,
    DBS_API,
    DeliveryMissionRep_API,
    MS_API,
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

    private startUpdateMissionRequests = () => {
        /*        const observation: MISSION_REQUEST_DATA = {
            id: 'a1',
            version: 0,
            lastAction: LAST_ACTION.Insert,
            description: 'aaa',
            comments: [{source:'aa',text:'aa', time:0}],
            createdBy: '',
            time: 0,
            idView: '1111',
            missionType: MISSION_TYPE.Observation,
            missionStatus: MISSION_STATUS_UI.Pending,
            observationMissionRequest: {
                altitudeOffset: 0,
                observationAzimuth: 0,
                observationPoint: {lat:30, lon:30,alt:0},
                status: MISSION_STATUS.Pending,
                droneId: 'ssdsd'
            }
        }
        const scan: MISSION_REQUEST_DATA = {
            id: 'a2',
            version: 0,
            lastAction: LAST_ACTION.Insert,
            description: 'bbb',
            comments: [{source:'aa',text:'aa', time:0}],
            createdBy: '',
            time: 0,
            idView: '2222',
            missionType: MISSION_TYPE.Scan,
            missionStatus: MISSION_STATUS_UI.Pending,
            scanMissionRequest: {
                droneId: 'dfdf',
                cameraFOV: 4,
                overlapPrecent: 5,
                polygon: {coordinates: []},
                scanAngle: 4,
                scanSpeed: SCAN_SPEED.High,
                status: MISSION_STATUS.Pending
            }
        }
        this.missionRequests.push(new ObservationMissionRequest(observation));
        this.missionRequests.push(new ScanMissionRequest(scan));
        setTimeout(() => {
            UpdateListenersManager.updateMissionRequestListeners();
        }, 5000);*/

        setInterval(() => {
            this.missionTypes.forEach((missionType: MISSION_TYPE) => {
                const request = this.sendGetMissionRequest(missionType, {});
                if (request) {
                    request
                        .then((data: ASYNC_RESPONSE<{ collectionVersion: number, id: string }>) => {
                            const repData = data.data;
                            if (data.success && repData.hasOwnProperty('collectionVersion')) {
                                if (RepositoryManager.getCollectionVersion(missionType) !== undefined
                                    && repData.collectionVersion !== RepositoryManager.getCollectionVersion(missionType)
                                    && repData.hasOwnProperty(REP_ARR_KEY[missionType])) {
                                    const promiseArr = []
                                    repData[REP_ARR_KEY[missionType]].forEach((missionData: MISSION_REQUEST_DATA) => {
                                        if (missionData.lastAction === LAST_ACTION.Insert) {
                                            let missionRequest: MissionRequest = this.missionRequests.find(element => element.id === missionData.id);
                                            if ( missionRequest ) {
                                                missionRequest.setValues(data.data);
                                            }
                                            else {
                                                missionRequest = this.newMissionRequestClass(missionType, missionData);
                                                this.missionRequests.push(missionRequest)
                                            }

                                            const promise = RequestManager.requestToDBS(DBS_API.createMissionRequest, missionRequest.toJsonForSave());
                                            promiseArr.push(promise)
                                            promise
                                                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                    if ( data.success ) {

                                                    }
                                                    else {
                                                        console.log(data);
                                                    }
                                                })
                                                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                    console.log(data);
                                                });

                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Update) {
                                            const missionRequest = this.missionRequests.find(element => element.id === missionData.id);
                                            if (missionRequest) {
                                                missionRequest.setValues(missionData)

                                                const promise = RequestManager.requestToDBS(DBS_API.createMissionRequest, missionRequest.toJsonForSave());
                                                promiseArr.push(promise)
                                                promise
                                                    .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                        if ( data.success ) {

                                                        }
                                                        else {
                                                            console.log(data);
                                                        }
                                                    })
                                                    .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                        console.log(data);
                                                    });
                                            }
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Delete) {
                                            const index = this.missionRequests.findIndex(element => element.id === missionData.id);
                                            if (index !== -1) {
                                                this.missionRequests.splice(index, 1)
                                                const promise = RequestManager.requestToDBS(DBS_API.deleteMissionRequest, {id: missionData.id});
                                                promiseArr.push(promise)
                                                promise
                                                    .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                        if ( data.success ) {

                                                        }
                                                        else {
                                                            console.log(data);
                                                        }
                                                    })
                                                    .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                                        console.log(data);
                                                    });
                                            }
                                        }
                                    })
                                    Promise.all(promiseArr)
                                        .then((data) => {
                                            RepositoryManager.updateCollectionVersion(missionType, repData.collectionVersion);
                                            UpdateListenersManager.updateMissionRequestListeners();
                                        })
                                        .catch((data) => {
                                            console.log('promiseAll failed', JSON.stringify(data))
                                        })
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

                        RequestManager.requestToDBS(DBS_API.createMissionRequest, newMissionRequest.toJsonForSave())
                            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                                res.data = data.data;
                                res.success = data.success;
                                res.description = data.description;
                                if ( data.success ) {
                                    // const missionRequest: MissionRequest = this.missionRequests.find(element => element.id === data.data.id);
                                    // if ( missionRequest ) {
                                    //     missionRequest.setValues(data.data);
                                    // }
                                    // else {
                                        const missionRequest = this.newMissionRequestClass(missionRequestData.missionType, data.data);
                                        if (missionRequest) {
                                            this.missionRequests.push(missionRequest);
                                        }
                                    // }

                                    UpdateListenersManager.updateMissionRequestListeners();
                                }
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
            this.saveMissionInDB(newMissionRequest)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const missionRequest = this.newMissionRequestClass(missionRequestData.missionType, data.data);
                        if (missionRequest) {
                            this.missionRequests.push(missionRequest);
                        }

                        UpdateListenersManager.updateMissionRequestListeners();
                    }
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
    private updateRepository = (missionRequest: MissionRequest) => {
        return new Promise((resolve, reject) => {
            let url;
            let promise;

            const dataForRep = missionRequest.toJsonForRep();
            switch (missionRequest.missionType) {
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
        });
    }

    private readAllMissionRequest = (requestData): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            this.missionRequests.forEach((data: MissionRequest) => {
                res.data.push(data.toJsonForSave());
            });
            resolve(res);
        });
    }


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

    private missionRequestAction = (data: MISSION_REQUEST_ACTION_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};


            RequestManager.requestToObservationMissionRep(MS_API.missionRequestAction, data)
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
    // --------------------------
    private deleteMissionFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return RequestManager.requestToDBS(DBS_API.deleteMissionRequest, idObj)
    }
    // --------------------------
    private saveMissionInDB = (newMissionRequest: MissionRequest): Promise<ASYNC_RESPONSE> => {
        return RequestManager.requestToDBS(DBS_API.createMissionRequest, newMissionRequest.toJsonForSave())
    }



    // region API uncions
    public static createMissionRequestFromMGW = MissionRequestManager.instance.createMissionRequestFromMGW;
    public static createMissionRequest = MissionRequestManager.instance.createMissionRequest;
    public static readAllMissionRequest = MissionRequestManager.instance.readAllMissionRequest;
    public static getMissionRequests = MissionRequestManager.instance.getMissionRequests;
    public static missionRequestAction = MissionRequestManager.instance.missionRequestAction;


    // endregion API uncions

}
