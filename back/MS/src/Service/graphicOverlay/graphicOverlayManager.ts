import {
    ASYNC_RESPONSE, COLLECITON_VERSION_TYPE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    GRAPHIC_OVERLAY_DATA,
    GRAPHIC_OVERLAY_DATA_REP, MISSION_REQUEST_DATA, REP_ARR_KEY
} from "../../../../../classes/typings/all.typings";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {DBS_API, GraphicOverlayRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import * as _ from 'lodash';
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
import {RepositoryManager} from "../repositoryManager/repositoryManager";
import {GraphicOverlay} from "../../../../../classes/dataClasses/graphicOverlay/graphicOverlay";

const pollingInterval = 5000;


export class GraphicOverlayManager {


    private static instance: GraphicOverlayManager = new GraphicOverlayManager();


    graphicOverlays: GraphicOverlay[] = [];

    private constructor() {
        this.initAllGraphicOverlays();
    }
    // -----------------------
    private initAllGraphicOverlays = () => {
        this.getGraphicOverlaysFromDBS()
            .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                this.startUpdateGraphicOverlays();
                UpdateListenersManager.updateGraphicOverlayListeners();
            })
            .catch((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                setTimeout(() => {
                    this.initAllGraphicOverlays();
                }, 5000);
            });
    }
    // -----------------------
    private getGraphicOverlaysFromDBS = (): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllGraphicOverlay, {})
                .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                    if ( data.success ) {
                        this.graphicOverlays = Converting.Arr_GRAPHIC_OVERLAY_DATA_to_Arr_GraphicOverlay(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getGraphicOverlaysFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                    //todo logger
                    console.log('error getGraphicOverlaysFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
    };
    // -----------------------
    private startUpdateGraphicOverlays = () => {

        setInterval(() => {
            const collectionVersion = RepositoryManager.getCollectionVersion(COLLECITON_VERSION_TYPE.GraphicOverlay);
            if (collectionVersion !== undefined) {
                RequestManager.requestToGraphicOverlayRep(`${GraphicOverlayRep_API.getLastGraphicOverlays}/${collectionVersion}`,{})
                    .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA_REP>) => {
                        const repData = data.data;
                        if (repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.GraphicOverlay)) {
                            if (repData.collectionVersion !== collectionVersion) {
                                if (repData.collectionVersion === 0) { // if collection is reset
                                    this.deleteAllGraphicOverlays();
                                }
                                else {
                                    const promiseArr = [];
                                    let promise;

                                    repData[REP_ARR_KEY.GraphicOverlay].forEach((missionData: GRAPHIC_OVERLAY_DATA) => {
                                        if (missionData.lastAction === LAST_ACTION.Insert) {
                                            const newGraphicOverlay = new GraphicOverlay(missionData);
                                            promise = this.saveGraphicOverlayInDB(newGraphicOverlay.toJson());
                                            promiseArr.push(promise)
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Update) {
                                            const existingGraphicOverlay: GraphicOverlay = this.getGraphicOverlayById(missionData.id);
                                            if (existingGraphicOverlay) {
                                                existingGraphicOverlay.setValues(missionData);
                                                promise = this.saveGraphicOverlayInDB(existingGraphicOverlay.toJson());
                                                promiseArr.push(promise)
                                            }
                                        }
                                        else if (missionData.lastAction === LAST_ACTION.Delete) {
                                            promise = this.deleteGraphicOverlayFromDB({id: missionData.id});
                                            promiseArr.push(promise)
                                        }
                                    });

                                    Promise.all(promiseArr)
                                        .then((data) => {
                                            RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.GraphicOverlay, repData.collectionVersion);
                                        })
                                        .catch((data) => {
                                            console.log('promiseAll failed', JSON.stringify(data))
                                        })
                                }
                            }
                        }
                        else {
                            console.log('error getLastGraphicOverlays', JSON.stringify(data));
                        }
                    })
                    .catch((err) => {
                        console.log('error getLastGraphicOverlays',JSON.stringify(err));
                    });
            }
        }, pollingInterval);
    }
    // -----------------------
    private readAllGraphicOverlay = (requestData): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]> = {success: true, data: []};
            this.graphicOverlays.forEach((data: GraphicOverlay) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }
    // -----------------------
    private getGraphicOverlays = (idObj: ID_OBJ = undefined): GRAPHIC_OVERLAY_DATA[] => {
        const res: GRAPHIC_OVERLAY_DATA[] = [];
        if ( idObj ) {
            const found = this.graphicOverlays.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJson());
            }
        }
        else {
            this.graphicOverlays.forEach((mission: GraphicOverlay) => {
                res.push(mission.toJson());
            });
        }
        return res;
    };
    // ---------------------------
    private getGraphicOverlayById = (missionId: ID_TYPE): GraphicOverlay => {
        return this.graphicOverlays.find(element => element.id === missionId);
    }
    // --------------------------
    private deleteGraphicOverlayFromDB = (idObj: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.deleteGraphicOverlay, idObj)
                .then((data: ASYNC_RESPONSE) => {
                    if (data.success) {
                        const index = this.graphicOverlays.findIndex(element => element.id === idObj.id);
                        if (index !== -1) {
                            this.graphicOverlays.splice(index, 1);
                        }
                        UpdateListenersManager.updateGraphicOverlayListeners();
                    }
                    else {
                        console.log('error saveGraphicOverlayInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    console.log('error saveGraphicOverlayInDB', JSON.stringify(data));
                    reject(data);
                })
        })

    }
    // --------------------------
    private saveGraphicOverlayInDB = (missionData: GRAPHIC_OVERLAY_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.createGraphicOverlay, missionData)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    if (data.success) {
                        let mission: GraphicOverlay = this.getGraphicOverlayById(missionData.id);
                        if ( mission ) {
                            mission.setValues(data.data);
                        }
                        else {
                            mission = new GraphicOverlay(missionData);
                            this.graphicOverlays.push(mission)
                        }
                        UpdateListenersManager.updateGraphicOverlayListeners();
                    }
                    else {
                        console.log('error saveGraphicOverlayInDB', JSON.stringify(data));
                    }
                    resolve(data);
                })
                .catch((data) => {
                    console.log('error saveGraphicOverlayInDB', JSON.stringify(data));
                    reject(data);
                });
        });
    }
    // -----------------------
    private deleteAllGraphicOverlays = () => {
        RequestManager.requestToDBS(DBS_API.deleteAllGraphicOverlay, {})
            .then((data) => {
                console.log('all graphicOverlays deleted');
                this.graphicOverlays = [];
                RepositoryManager.updateCollectionVersion(COLLECITON_VERSION_TYPE.GraphicOverlay, 0);
            })
            .catch((data) => {});
    }


    // region API uncions
    public static readAllGraphicOverlay = GraphicOverlayManager.instance.readAllGraphicOverlay;
    public static getGraphicOverlays = GraphicOverlayManager.instance.getGraphicOverlays;


    // endregion API uncions

}
