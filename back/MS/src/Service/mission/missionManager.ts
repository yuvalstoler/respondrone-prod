import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import {
    ASYNC_RESPONSE,
    ID_OBJ,
    ID_TYPE,
    LAST_ACTION,
    MISSION_DATA,
    MISSION_DATA_REP, REP_ARR_KEY
} from "../../../../../classes/typings/all.typings";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {MissionRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import * as _ from 'lodash';

const pollingInterval = 5000;


export class MissionManager {


    private static instance: MissionManager = new MissionManager();


    missions: Mission[] = [];
    collectionVersion = 0;

    private constructor() {
        this.startUpdateMissions();
    }

    private startUpdateMissions = () => {
        /*const aa: MISSION_DATA = {
            version:0,
            lastAction: LAST_ACTION.Insert,
            description: '',
            id: 'aaa',
            missionType: MISSION_TYPE.Observation,
            requestId: 'bbb',
            status: MISSION_STATUS.Pending,
            missionMapOverlay: {
                areas: [
                    {
                        coordinates: [
                            {
                                lon: 33.717,
                                lat: 27.86,
                                alt: 0
                            },
                            {
                                lon: 34.1619,
                                lat: 27.785,
                                alt: 0
                            },
                            {
                                lon: 34.096,
                                lat: 28.212,
                                alt: 0
                            },
                            {
                                lon: 33.717,
                                lat: 27.86,
                                alt: 0
                            }
                        ]
                    },
                    {
                        coordinates: [
                            {
                                lon: 34.354,
                                lat: 27.698,
                                alt: 0
                            },
                            {
                                lon: 34.552,
                                lat: 27.615,
                                alt: 0
                            },
                            {
                                lon: 34.623,
                                lat: 27.7127,
                                alt: 0
                            },
                            {
                                lon: 34.354,
                                lat: 27.698,
                                alt: 0
                            }
                        ]
                    }
                ],
                point: {
                    lon: 33.0,
                    lat: 28.2,
                    alt: 0
                }
            }
        }
        this.missions.push(new Mission(aa));
        setTimeout(() => {
            UpdateListenersManager.updateMissionListeners();
        }, 5000);*/

        setInterval(() => {
            RequestManager.requestToMissionRep(`${MissionRep_API.getLastMissions}/${this.collectionVersion}`,{})
                .then((data: ASYNC_RESPONSE<MISSION_DATA_REP>) => {
                    const repData = data.data;
                    if (repData.hasOwnProperty('collectionVersion') && repData.hasOwnProperty(REP_ARR_KEY.Mission)) {
                        this.collectionVersion = repData.collectionVersion;
                        repData[REP_ARR_KEY.Mission].forEach((missionData: MISSION_DATA) => {
                            if (missionData.lastAction === LAST_ACTION.Insert) {
                                const newMission = new Mission(missionData);
                                this.missions.push(newMission)
                            }
                            else if (missionData.lastAction === LAST_ACTION.Update) {
                                const existingMission = this.missions.find(element => element.id === missionData.id);
                                if (existingMission) {
                                    existingMission.setValues(missionData)
                                }
                            }
                            else if (missionData.lastAction === LAST_ACTION.Delete) {
                                const index = this.missions.findIndex(element => element.id === missionData.id);
                                if (index !== -1) {
                                   this.missions.splice(index, 1);
                                }
                            }
                        })
                    }
                    else {
                        console.log('error getLastMissions', JSON.stringify(data));
                    }
                })
                .catch((err) => {
                    console.log('error getLastMissions',JSON.stringify(err));
                });
        }, pollingInterval);
    }

    private readAllMission = (requestData): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<MISSION_DATA[]> = {success: true, data: []};
            this.missions.forEach((data: Mission) => {
                res.data.push(data.toJson());
            });
            resolve(res);
        });
    }

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


    // region API uncions
    public static readAllMission = MissionManager.instance.readAllMission;
    public static getMissions = MissionManager.instance.getMissions;


    // endregion API uncions

}
