import {
    ASYNC_RESPONSE,
    ID_OBJ,
    MISSION_ROUTE_DATA,
    MISSION_REQUEST_DATA,
    LAST_ACTION,
    MISSION_TYPE,
    ROUTE_STATUS,
    MISSION_DATA_REP,
    MISSION_DATA,
    MISSION_ROUTE_DATA_REP, REP_ARR_KEY,
} from "../../../../../classes/typings/all.typings";
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {MissionRoute} from "../../../../../classes/dataClasses/missionRoute/missionRoute";
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {MissionRep_API, MissionRouteRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import * as _ from "lodash";
const pollingInterval = 5000;

export class MissionRouteManager {


    private static instance: MissionRouteManager = new MissionRouteManager();


    missionRoutes: MissionRoute[] = [];
    collectionVersion = 0;

    private constructor() {
        this.startUpdateMissionRoutes();
    }

    private startUpdateMissionRoutes = () => {
        /*       const aa: MISSION_ROUTE_DATA = {
            version:0,
            lastAction: LAST_ACTION.Insert,
            id: 'eee',
            missionType: MISSION_TYPE.Observation,
            status: ROUTE_STATUS.Active,
            requestId: 'aaa',
            missionId: 'www',
            route: [
                {
                    point:  {
                        lon: 33.810,
                        lat: 27.464,
                        alt: 0
                    },
                    velocity: 0,
                    heading: 0
                },
                {
                    point:  {
                        lon: 34.172,
                        lat: 27.357,
                        alt: 0
                    },
                    velocity: 0,
                    heading: 0
                },
                {
                    point:  {
                        lon: 34.315,
                        lat: 27.176,
                        alt: 0
                    },
                    velocity: 0,
                    heading: 0
                }
            ]
        }
        this.missionRoutes.push(new MissionRoute(aa));
        setTimeout(() => {
            UpdateListenersManager.updateMissionRouteListeners();
        }, 5000)*/

        setInterval(() => {
            RequestManager.requestToMissionRouteRep(`${MissionRouteRep_API.getLastMissionRoutes}/${this.collectionVersion}`,{})
                .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA_REP>) => {
                    const repData = data.data;
                    if (repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.MissionRoute)) {
                        this.collectionVersion = repData.collectionVersion;
                        repData[REP_ARR_KEY.MissionRoute].forEach((missionData: MISSION_ROUTE_DATA) => {
                            if (missionData.lastAction === LAST_ACTION.Insert) {
                                const newMission = new MissionRoute(missionData);
                                this.missionRoutes.push(newMission)
                            }
                            else if (missionData.lastAction === LAST_ACTION.Update) {
                                const existingMission = this.missionRoutes.find(element => element.id === missionData.id);
                                if (existingMission) {
                                    existingMission.setValues(missionData)
                                }
                            }
                            else if (missionData.lastAction === LAST_ACTION.Delete) {
                                const index = this.missionRoutes.findIndex(element => element.id === missionData.id);
                                if (index !== -1) {
                                    this.missionRoutes.splice(index, 1);
                                }
                            }
                        })
                    }
                    else {
                        console.log('error getLastMissionRoutes', JSON.stringify(data));
                    }
                })
                .catch((err) => {
                    console.log('error getLastMissionRoutes', JSON.stringify(err));
                });
        }, pollingInterval)
    }

    private readAllMissionRoute = (requestData): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]> = {success: true, data: []};
            this.missionRoutes.forEach((data: MissionRoute) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }

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

    // region API uncions
    public static readAllMissionRoute = MissionRouteManager.instance.readAllMissionRoute;
    public static getMissionRoutes = MissionRouteManager.instance.getMissionRoutes;


    // endregion API uncions

}
