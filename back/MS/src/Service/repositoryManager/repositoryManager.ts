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
    MISSION_ROUTE_DATA_REP, COLLECTION_VERSIONS,
} from "../../../../../classes/typings/all.typings";
import {MissionRequest} from "../../../../../classes/dataClasses/missionRequest/missionRequest";
import {MissionRoute} from "../../../../../classes/dataClasses/missionRoute/missionRoute";
import {UpdateListenersManager} from "../updateListeners/updateListenersManager";
import {RequestManager} from "../../AppService/restConnections/requestManager";
import {DBS_API, MissionRep_API, MissionRouteRep_API} from "../../../../../classes/dataClasses/api/api_enums";
import {Mission} from "../../../../../classes/dataClasses/mission/mission";
import * as _ from "lodash";
import {Converting} from "../../../../../classes/applicationClasses/utility/converting";
const pollingInterval = 5000;

export class RepositoryManager {


    private static instance: RepositoryManager = new RepositoryManager();


    collectionVersions: COLLECTION_VERSIONS;

    private constructor() {
        this.getCollectionVersionsFromDB()
    }

    private getCollectionVersionsFromDB = () => {
        RequestManager.requestToDBS(DBS_API.getRepCollectionVersions, {})
            .then((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                if ( data.success ) {
                    if (data.data === null) {
                        this.initCollectionVersions()
                    }
                    else {
                        this.collectionVersions = data.data;
                    }
                }
                else {
                    console.log('error getRepCollectionVersions', JSON.stringify(data));
                    setTimeout(this.getCollectionVersionsFromDB, 5000);
                }
            })
            .catch((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                console.log('error getRepCollectionVersions', JSON.stringify(data));
                setTimeout(this.getCollectionVersionsFromDB, 5000);
            });
    }
    // --------------------------
    private initCollectionVersions = () => {
        const defaultCollectionVersion: COLLECTION_VERSIONS = {
            [MISSION_TYPE.CommRelay]: 0,
            [MISSION_TYPE.Patrol]: 0,
            [MISSION_TYPE.Observation]: 0,
            [MISSION_TYPE.Scan]: 0,
            [MISSION_TYPE.Servoing]: 0,
            [MISSION_TYPE.Delivery]: 0,
        }

        RequestManager.requestToDBS(DBS_API.saveRepCollectionVersions, defaultCollectionVersion)
            .then((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                if ( data.success && data.data) {
                    this.collectionVersions = data.data;
                }
                else {
                    console.log('error initCollectionVersions', JSON.stringify(data));
                    setTimeout(this.initCollectionVersions, 5000);
                }
            })
            .catch((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                console.log('error initCollectionVersions', JSON.stringify(data));
                setTimeout(this.initCollectionVersions, 5000)
            });
    }
    // --------------------------
    private updateCollectionVersion = (key: MISSION_TYPE, value: number) => {
        if (this.collectionVersions.hasOwnProperty(key)) {
            this.collectionVersions[key] = value;

            RequestManager.requestToDBS(DBS_API.saveRepCollectionVersions, this.collectionVersions)
                .then((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                    if ( data.success ) {
                        this.collectionVersions = data.data;
                    }
                    else {
                        console.log('error getRepCollectionVersions', JSON.stringify(data));
                    }
                })
                .catch((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                    console.log('error getRepCollectionVersions', JSON.stringify(data));
                });
        }
    }
    // -----------------------
    private getCollectionVersion = (missiontype: MISSION_TYPE) => {
        return this.collectionVersions ? this.collectionVersions[missiontype] : undefined;
    }

    // region API uncions
    public static getCollectionVersion = RepositoryManager.instance.getCollectionVersion;
    public static updateCollectionVersion = RepositoryManager.instance.updateCollectionVersion;


    // endregion API uncions

}
