import {
    ASYNC_RESPONSE,
    REP_ARR_KEY,
    DISCOVERY_DATA,
    DISCOVERY_DATA_REP,
    REP_OBJ_KEY,
    STATUS_INDICATOR_DATA, CONNECTION_STATUS, DISCOVERY_NAME, DISCOVERY_STATUS
} from '../../../../../classes/typings/all.typings';
import {RequestManager} from '../../AppService/restConnections/requestManager';
import {DBS_API, DiscoveryRep_API, GraphicOverlayRep_API} from '../../../../../classes/dataClasses/api/api_enums';
import * as _ from 'lodash';
import {UpdateListenersManager} from '../updateListeners/updateListenersManager';
import {Converting} from '../../../../../classes/applicationClasses/utility/converting';
import {RepositoryManager} from '../repositoryManager/repositoryManager';
import {GraphicOverlay} from '../../../../../classes/dataClasses/graphicOverlay/graphicOverlay';

const pollingInterval = 5000;


export class DiscoveryManager {


    private static instance: DiscoveryManager = new DiscoveryManager();


    discovery: DISCOVERY_DATA[] = [];
    statusIndicatorData: STATUS_INDICATOR_DATA = {
        // webserver: {status: CONNECTION_STATUS.NA, description: ''},
        // internet: {status: CONNECTION_STATUS.NA, description: ''},
        repositories: {status: CONNECTION_STATUS.NA, description: ''},
        tmm: {status: CONNECTION_STATUS.NA, description: ''},
        thales: {status: CONNECTION_STATUS.NA, description: ''},
    };

    private constructor() {
        this.initDiscovery();
    }
    // -----------------------
    private initDiscovery = () => {
        this.startUpdateDiscovery();
    }
    // -----------------------
    private startUpdateDiscovery = () => {
        setInterval(() => {
            RequestManager.requestToDiscoveryRep(`${DiscoveryRep_API.getAllDiscovery}`, {})
                .then((data: ASYNC_RESPONSE<DISCOVERY_DATA_REP>) => {
                    const repData = data.data;
                    if (data.success && data.data && data.data.hasOwnProperty(REP_ARR_KEY.Discovery)) {
                        this.discovery = data.data[REP_ARR_KEY.Discovery] || [];
                        this.updateStatusIndicatorData(this.discovery);
                        UpdateListenersManager.updateDiscoveryListeners();
                    }

                })
                .catch((err) => {
                    console.log('error getDiscovery', JSON.stringify(err));
                });
        }, pollingInterval);
    }
    // -----------------------
    private updateStatusIndicatorData = (discoveryData: DISCOVERY_DATA[]) => {
        if (discoveryData.length > 0) {
            const disconnectedRepositories = {};
            discoveryData.forEach((discoveryObj: DISCOVERY_DATA) => {
                if (discoveryObj.name === DISCOVERY_NAME.tmm) {
                    if (discoveryObj.status !== DISCOVERY_STATUS.Ok) {
                        this.statusIndicatorData.tmm.status = CONNECTION_STATUS.disconnected;
                        this.statusIndicatorData.tmm.description = discoveryObj.status;
                    }
                    else if (discoveryObj.keepAliveStatus !== DISCOVERY_STATUS.Ok) {
                        this.statusIndicatorData.tmm.status = CONNECTION_STATUS.disconnected;
                        this.statusIndicatorData.tmm.description = 'No keep alive';
                    }
                    else {
                        this.statusIndicatorData.tmm.status = CONNECTION_STATUS.connected;
                        this.statusIndicatorData.tmm.description = '';
                    }
                }
                else if (discoveryObj.name === DISCOVERY_NAME.thales) {
                    if (discoveryObj.status !== DISCOVERY_STATUS.Ok) {
                        this.statusIndicatorData.thales.status = CONNECTION_STATUS.disconnected;
                        this.statusIndicatorData.thales.description = discoveryObj.status;
                    }
                    else if (discoveryObj.keepAliveStatus !== DISCOVERY_STATUS.Ok) {
                        this.statusIndicatorData.thales.status = CONNECTION_STATUS.disconnected;
                        this.statusIndicatorData.thales.description = 'No keep alive';
                    }
                    else {
                        this.statusIndicatorData.thales.status = CONNECTION_STATUS.connected;
                        this.statusIndicatorData.thales.description = '';
                    }
                }
                else if (DISCOVERY_NAME[discoveryObj.name]) {
                    if (discoveryObj.status !== DISCOVERY_STATUS.Ok) {
                        disconnectedRepositories[discoveryObj.name] = discoveryObj.status;
                    }
                    else if (discoveryObj.keepAliveStatus !== DISCOVERY_STATUS.Ok) {
                        disconnectedRepositories[discoveryObj.name] = 'No keep alive';
                    }
                }
            });

            this.statusIndicatorData.repositories.status = Object.keys(disconnectedRepositories).length > 0 ? CONNECTION_STATUS.disconnected : CONNECTION_STATUS.connected;
            this.statusIndicatorData.repositories.description = '';
            for (const key in disconnectedRepositories) {
                if (disconnectedRepositories.hasOwnProperty(key)) {
                    this.statusIndicatorData.repositories.description += `${key}:${disconnectedRepositories[key]}\n`;
                }
            }
        }
    }
    // -----------------------
    private readAllStatuses = (requestData): Promise<ASYNC_RESPONSE<STATUS_INDICATOR_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<STATUS_INDICATOR_DATA> = {success: true, data: this.statusIndicatorData};
            resolve(res);
        });
    }
    // -----------------------
    private getDiscoveryData = (): STATUS_INDICATOR_DATA => {
        const res: STATUS_INDICATOR_DATA = this.statusIndicatorData;
        return res;
    };


    // region API uncions
    public static readAllStatuses = DiscoveryManager.instance.readAllStatuses;
    public static getDiscoveryData = DiscoveryManager.instance.getDiscoveryData;


    // endregion API uncions

}
