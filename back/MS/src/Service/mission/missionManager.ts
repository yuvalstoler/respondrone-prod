import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import {
    ASYNC_RESPONSE, COLLECITON_VERSION_TYPE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    MISSION_DATA,
    MISSION_DATA_REP, MISSION_REQUEST_DATA, REP_ARR_KEY
} from "../../../../../classes/typings/all.typings";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {DBS_API, MissionRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import * as _ from 'lodash';
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
import {RepositoryManager} from "../repositoryManager/repositoryManager";

const pollingInterval = 5000;


export class MissionManager {


    private static instance: MissionManager = new MissionManager();


    missions: Mission[] = [];

    private constructor() {
        this.initAllMissions();
    }
    // -----------------------
    private initAllMissions = () => {
        this.getMissionsFromDBS()
            .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                this.startUpdateMissions();
                UpdateListenersManager.updateMissionListeners();
            })
            .catch((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                setTimeout(() => {
                    this.initAllMissions();
                }, 5000);
            });
    }
    // -----------------------
    private getMissionsFromDBS = (): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllMission, {})
                .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                    if ( data.success ) {
                        this.missions = Converting.Arr_MISSION_DATA_to_Arr_Mission(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getMissionsFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                    //todo logger
                    console.log('error getMissionsFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
    };
    // -----------------------
    private startUpdateMissions = () => {

        setInterval(() => {
            const collectionVersion = RepositoryManager.getCollectionVersion(COLLECITON_VERSION_TYPE.Mission);
            if (collectionVersion !== undefined) {
                RequestManager.requestToMissionRep(`${MissionRep_API.getLastMissions}/${collectionVersion}`,{})
                    .then((data: ASYNC_RESPONSE<MISSION_DATA_REP>) => {
                        const repData = data.data;
                        if (repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.Mission)) {
                            if (repData.collectionVersion !== collectionVersion) {
                                if (repData.collectionVersion === 0) { // if collection is reset
                                    this.deleteAllMissions();
                                }
                                else {
                                    const promiseArr = [];
                                    let promise;

                                    repData[REP_ARR_KEY.Mission].forEach((missionData: MISSION_DATA) => {
                                        if (missionData.lastAction === LAST_ACTION.Insert || missionData.lastAction === LAST_ACTION.Update) {
                                            const existingMission: Mission = this.getMissionById(missionData.id);
                                            if (existingMission) {
                                                const missionForSave = new Mission(existingMission.toJson())
                                                missionForSave.setValues(missionData);
                                                promise = this.saveMissionInDB(missionForSave.toJson());
                                                promiseArr.push(promise)
                                            }
                                            else {
                                                const newMission = new Mission(missionData);
                                                promise = this.saveMissionInDB(newMission.toJson());
                                                promiseArr.push(promise)
                                            }
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Delete) {
                                            promise = this.deleteMissionFromDB({id: missionData.id});
                                            promiseArr.push(promise)
                                        }
                                    });

                                    Promise.all(promiseArr)
                                        .then((data) => {
                                            RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.Mission, repData.collectionVersion);
                                        })
                                        .catch((data) => {
                                            console.log('promiseAll failed', JSON.stringify(data))
                                        })
                                }
                            }
                        }
                        else {
                            console.log('error getLastMissions', JSON.stringify(data));
                        }
                    })
                    .catch((err) => {
                        console.log('error getLastMissions',JSON.stringify(err));
                    });
            }
        }, pollingInterval);
    }
    // -----------------------
    private readAllMission = (requestData): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<MISSION_DATA[]> = {success: true, data: []};
            this.missions.forEach((data: Mission) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }
    // -----------------------
    private getMissions = (idObj: ID_OBJ = undefined): MISSION_DATA[] => {
        const res: MISSION_DATA[] = [];
        if ( idObj ) {
            const found = this.missions.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJson());
            }
        }
        else {
            this.missions.forEach((mission: Mission) => {
                res.push(mission.toJson());
            });
        }
        return res;
    };
    // ---------------------------
    private getMissionById = (missionId: ID_TYPE): Mission => {
        return this.missions.find(element => element.id === missionId);
    }
    // --------------------------
    private deleteMissionFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.deleteMission, idObj)
                .then((data: ASYNC_RESPONSE) => {
                    if (data.success) {
                        const index = this.missions.findIndex(element => element.id === idObj.id);
                        if (index !== -1) {
                            this.missions.splice(index, 1);
                        }
                        UpdateListenersManager.updateMissionListeners();
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
    private saveMissionInDB = (missionData: MISSION_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.createMission, missionData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    if (data.success) {
                        let mission: Mission = this.getMissionById(missionData.id);
                        if ( mission ) {
                            mission.setValues(data.data);
                        }
                        else {
                            mission = new Mission(missionData);
                            this.missions.push(mission)
                        }
                        UpdateListenersManager.updateMissionListeners();
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
    // -----------------------
    private deleteAllMissions = () => {
        RequestManager.requestToDBS(DBS_API.deleteAllMission, {})
            .then((data) => {
                console.log('all missions deleted');
                this.missions = [];
                RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.Mission, 0);
            })
            .catch((data) => {});
    }


    // region API uncions
    public static readAllMission = MissionManager.instance.readAllMission;
    public static getMissions = MissionManager.instance.getMissions;


    // endregion API uncions

}
