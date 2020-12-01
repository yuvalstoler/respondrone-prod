import {
    ASYNC_RESPONSE,
    COLLECITON_VERSION_TYPE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    MISSION_REQUEST_DATA,
    MISSION_ROUTE_DATA,
    MISSION_ROUTE_DATA_REP,
    REP_ARR_KEY,
} from "../../../../../classes/typings/all.typings";
import {MissionRoute} from "../../../../../classes/dataClasses/missionRoute/missionRoute";
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {DBS_API, MissionRouteRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import {MissionRequestManager} from "../missionRequest/missionRequestManager";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
import {RepositoryManager} from "../repositoryManager/repositoryManager";
import {Mission} from "../../../../../classes/dataClasses/mission/mission";

const pollingInterval = 5000;

export class MissionRouteManager {


    private static instance: MissionRouteManager = new MissionRouteManager();


    missionRoutes: MissionRoute[] = [];

    private constructor() {
        this.initAllMissionRoutes();
    }
    // -----------------------
    private initAllMissionRoutes = () => {
        this.getMissionRoutesFromDBS()
            .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                this.startUpdateMissionRoutes();
                UpdateListenersManager.updateMissionRouteListeners();
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                setTimeout(() => {
                    this.initAllMissionRoutes();
                }, 5000);
            });
    }
    // -----------------------
    private getMissionRoutesFromDBS = (): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllMissionRoute, {})
                .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                    if ( data.success ) {
                        this.missionRoutes = Converting.Arr_MISSION_ROUTE_DATA_to_Arr_MissionRoute(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getMissionRoutesFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                    //todo logger
                    console.log('error getMissionRoutesFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
    };
    // -----------------------
    private startUpdateMissionRoutes = () => {

        setInterval(() => {
            const collectionVersion = RepositoryManager.getCollectionVersion(COLLECITON_VERSION_TYPE.MissionRoute);
            if (collectionVersion !== undefined) {
                RequestManager.requestToMissionRouteRep(`${MissionRouteRep_API.getLastMissionRoutes}/${collectionVersion}`,{})
                    .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA_REP>) => {
                        const repData = data.data;
                        if (data.success && repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.MissionRoute)) {
                            if (repData.collectionVersion !== collectionVersion) {
                                if (repData.collectionVersion === 0) { // if collection is reset
                                   this.deleteAllMissions();
                                }
                                else {
                                    const promiseArr = [];
                                    let promise;
                                    repData[REP_ARR_KEY.MissionRoute].forEach((missionData: MISSION_ROUTE_DATA) => {
                                        if (missionData.lastAction === LAST_ACTION.Insert || missionData.lastAction === LAST_ACTION.Update) {
                                            const existingMission = this.getMissionRouteById(missionData.id);
                                            if (existingMission) {
                                                const missionRouteForSave = new MissionRoute(existingMission.toJson());
                                                missionRouteForSave.setValues(missionData);
                                                promise = this.saveMissionInDB(missionRouteForSave.toJson());
                                                promiseArr.push(promise);
                                            }
                                            else {
                                                const newMission = new MissionRoute(missionData);
                                                newMission.time = Date.now();
                                                promise = this.saveMissionInDB(newMission.toJson());
                                                promiseArr.push(promise)
                                            }
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Delete) {
                                            promise = this.deleteMissionFromDB({id: missionData.id});
                                            promiseArr.push(promise)
                                        }
                                    })
                                    Promise.all(promiseArr)
                                        .then((data) => {
                                            RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.MissionRoute, repData.collectionVersion);
                                        })
                                        .catch((data) => {
                                            console.log('promiseAll failed', JSON.stringify(data))
                                        })
                                }

                            }
                        }
                        else {
                            console.log('error getLastMissionRoutes', JSON.stringify(data));
                        }
                    })
                    .catch((err) => {
                        console.log('error getLastMissionRoutes', JSON.stringify(err));
                    });
            }
        }, pollingInterval)
    }
    // -----------------------
    private readAllMissionRoute = (requestData): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]> = {success: true, data: []};
            this.missionRoutes.forEach((data: MissionRoute) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }
    // -----------------------
    private getMissionRoutes = (idObj: ID_OBJ = undefined): MISSION_ROUTE_DATA[] => {
        const res: MISSION_ROUTE_DATA[] = [];
        if ( idObj ) {
            const found = this.missionRoutes.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJson());
            }
        }
        else {
            this.missionRoutes.forEach((mission: MissionRoute) => {
                res.push(mission.toJson());
            });
        }
        return res;
    };
    // -----------------------
    private getMissionRouteById = (missionId: ID_TYPE) => {
        return this.missionRoutes.find(element => element.id === missionId)
    }
    // -----------------------
    private onApproveMissionRoute = () => {
        // TODO change
        setTimeout(() => {
            UpdateListenersManager.updateMissionRouteListeners();
        }, 1000);
    }
    // --------------------------
    private deleteMissionFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.deleteMissionRoute, idObj)
                .then((data: ASYNC_RESPONSE) => {
                    if (data.success) {
                        const index = this.missionRoutes.findIndex(element => element.id === idObj.id);
                        if (index !== -1) {
                            this.missionRoutes.splice(index, 1);
                        }
                        UpdateListenersManager.updateMissionRouteListeners();
                    }
                    else {
                        console.log('error saveMissionRouteInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    console.log('error saveMissionRouteInDB', JSON.stringify(data));
                    reject(data);
                })
        })

    }
    // --------------------------
    private saveMissionInDB = (missionRouteData: MISSION_ROUTE_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.createMissionRoute, missionRouteData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    if (data.success) {
                        let missionRoute: MissionRoute = this.getMissionRouteById(missionRouteData.id);
                        if ( missionRoute ) {
                            missionRoute.setValues(data.data);
                        }
                        else {
                            missionRoute = new MissionRoute(missionRouteData);
                            this.missionRoutes.push(missionRoute)
                        }
                        UpdateListenersManager.updateMissionRouteListeners();
                        MissionRequestManager.onUpdateMissionRoute(missionRoute)
                    }
                    else {
                        console.log('error saveMissionRouteInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data) => {
                    console.log('error saveMissionRouteInDB', JSON.stringify(data));
                    reject(data);
                });
        });
    }
    // ------------------------------
    private deleteAllMissions = () => {
        RequestManager.requestToDBS(DBS_API.deleteAllMissionRoute, {})
            .then((data) => {
                console.log('all missionRoutes deleted');
                this.missionRoutes = [];
                RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.MissionRoute, 0);
            })
            .catch((data) => {});
    }

    // region API uncions
    public static readAllMissionRoute = MissionRouteManager.instance.readAllMissionRoute;
    public static getMissionRoutes = MissionRouteManager.instance.getMissionRoutes;
    public static getMissionRouteById = MissionRouteManager.instance.getMissionRouteById;
    public static onApproveMissionRoute = MissionRouteManager.instance.onApproveMissionRoute;


    // endregion API uncions

}
