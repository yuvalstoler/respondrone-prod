import {
    ASYNC_RESPONSE, COLLECITON_VERSION_TYPE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    NFZ_DATA,
    NFZ_DATA_REP, REP_ARR_KEY,
} from "../../../../../classes/typings/all.typings";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {DBS_API, NFZRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import * as _ from 'lodash';
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
import {RepositoryManager} from "../repositoryManager/repositoryManager";
import {NFZ} from "../../../../../classes/dataClasses/nfz/nfz";

const pollingInterval = 5000;


export class NFZManager {


    private static instance: NFZManager = new NFZManager();


    nfzs: NFZ[] = [];

    private constructor() {
        this.initAllNFZs();
    }
    // -----------------------
    private initAllNFZs = () => {
        this.getNFZsFromDBS()
            .then((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                this.startUpdateNFZs();
                UpdateListenersManager.updateNFZListeners();
            })
            .catch((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                setTimeout(() => {
                    this.initAllNFZs();
                }, 5000);
            });
    }
    // -----------------------
    private getNFZsFromDBS = (): Promise<ASYNC_RESPONSE<NFZ_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllNFZ, {})
                .then((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                    if ( data.success ) {
                        this.nfzs = Converting.Arr_NFZ_DATA_to_Arr_NFZ(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getNFZsFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                    //todo logger
                    console.log('error getNFZsFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
    };
    // -----------------------
    private startUpdateNFZs = () => {

        setInterval(() => {
            const collectionVersion = RepositoryManager.getCollectionVersion(COLLECITON_VERSION_TYPE.NFZ);
            if (collectionVersion !== undefined) {
                RequestManager.requestToNFZRep(`${NFZRep_API.getLastNFZs}/${collectionVersion}`,{})
                    .then((data: ASYNC_RESPONSE<NFZ_DATA_REP>) => {
                        const repData = data.data;
                        if (repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.NFZ)) {
                            if (repData.collectionVersion !== collectionVersion) {
                                if (repData.collectionVersion === 0) { // if collection is reset
                                    this.deleteAllNFZs();
                                }
                                else {
                                    const promiseArr = [];
                                    let promise;

                                    repData[REP_ARR_KEY.NFZ].forEach((missionData: NFZ_DATA) => {
                                        if (missionData.lastAction === LAST_ACTION.Insert || missionData.lastAction === LAST_ACTION.Update) {
                                            const existingNFZ: NFZ = this.getNFZById(missionData.id);
                                            if (existingNFZ) {
                                                const nfzForSave = new NFZ(existingNFZ.toJson())
                                                nfzForSave.setValues(missionData);
                                                promise = this.saveNFZInDB(nfzForSave.toJson());
                                                promiseArr.push(promise)
                                            }
                                            else {
                                                const newNFZ = new NFZ(missionData);
                                                promise = this.saveNFZInDB(newNFZ.toJson());
                                                promiseArr.push(promise)
                                            }
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Delete) {
                                            promise = this.deleteNFZFromDB({id: missionData.id});
                                            promiseArr.push(promise)
                                        }
                                    });

                                    Promise.all(promiseArr)
                                        .then((data) => {
                                            RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.NFZ, repData.collectionVersion);
                                        })
                                        .catch((data) => {
                                            console.log('promiseAll failed', JSON.stringify(data))
                                        })
                                }
                            }
                        }
                        else {
                            console.log('error getLastNFZs', JSON.stringify(data));
                        }
                    })
                    .catch((err) => {
                        console.log('error getLastNFZs',JSON.stringify(err));
                    });
            }
        }, pollingInterval);
    }
    // -----------------------
    private readAllNFZ = (requestData): Promise<ASYNC_RESPONSE<NFZ_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<NFZ_DATA[]> = {success: true, data: []};
            this.nfzs.forEach((data: NFZ) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }
    // -----------------------
    private getNFZs = (idObj: ID_OBJ = undefined): NFZ_DATA[] => {
        const res: NFZ_DATA[] = [];
        if ( idObj ) {
            const found = this.nfzs.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJson());
            }
        }
        else {
            this.nfzs.forEach((mission: NFZ) => {
                res.push(mission.toJson());
            });
        }
        return res;
    };
    // ---------------------------
    private getNFZById = (missionId: ID_TYPE): NFZ => {
        return this.nfzs.find(element => element.id === missionId);
    }
    // --------------------------
    private deleteNFZFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.deleteNFZ, idObj)
                .then((data: ASYNC_RESPONSE) => {
                    if (data.success) {
                        const index = this.nfzs.findIndex(element => element.id === idObj.id);
                        if (index !== -1) {
                            this.nfzs.splice(index, 1);
                        }
                        UpdateListenersManager.updateNFZListeners();
                    }
                    else {
                        console.log('error saveNFZInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    console.log('error saveNFZInDB', JSON.stringify(data));
                    reject(data);
                })
        })

    }
    // --------------------------
    private saveNFZInDB = (missionData: NFZ_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.createNFZ, missionData)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    if (data.success) {
                        let mission: NFZ = this.getNFZById(missionData.id);
                        if ( mission ) {
                            mission.setValues(data.data);
                        }
                        else {
                            mission = new NFZ(missionData);
                            this.nfzs.push(mission)
                        }
                        UpdateListenersManager.updateNFZListeners();
                    }
                    else {
                        console.log('error saveNFZInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data) => {
                    console.log('error saveNFZInDB', JSON.stringify(data));
                    reject(data);
                });
        });
    }
    // -----------------------
    private deleteAllNFZs = () => {
        RequestManager.requestToDBS(DBS_API.deleteAllNFZ, {})
            .then((data) => {
                console.log('all nfzs deleted');
                this.nfzs = [];
                RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.NFZ, 0);
            })
            .catch((data) => {});
    }


    // region API uncions
    public static readAllNFZ = NFZManager.instance.readAllNFZ;
    public static getNFZs = NFZManager.instance.getNFZs;


    // endregion API uncions

}
