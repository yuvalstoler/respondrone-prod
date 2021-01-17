const request = require('request');
const _ = require('lodash');

import {
    API_GENERAL,
} from '../../../../../classes/dataClasses/api/api_enums';


import {
    ASYNC_RESPONSE,
    MAP
} from '../../../../../classes/typings/all.typings';
// for webServer
const services = require('./../../../../../../../../config/services.json');
const projConf = require('./../../../../../../../../config/projConf.json');


const url_DBS = services.DBS.protocol + '://' + services.DBS.host + ':' + services.DBS.port;
const url_WS = services.webServer.protocol + '://' + services.webServer.host + ':' + services.webServer.port;
const url_TMM = services.TMM.protocol + '://' + services.TMM.host + (services.TMM.port ? ':' + services.TMM.port : '');
const url_FRS = services.FRS.protocol + '://' + services.FRS.host + ':' + services.FRS.port;

const url_CommRelayMissionRep = services.CommRelayMissionRep.protocol + '://' + services.CommRelayMissionRep.host + ':' + services.CommRelayMissionRep.port;
const url_PatrolMissionRep = services.PatrolMissionRep.protocol + '://' + services.PatrolMissionRep.host + ':' + services.PatrolMissionRep.port;
const url_ObservationMissionRep = services.ObservationMissionRep.protocol + '://' + services.ObservationMissionRep.host + ':' + services.ObservationMissionRep.port;
const url_ScanMissionRep = services.ScanMissionRep.protocol + '://' + services.ScanMissionRep.host + ':' + services.ScanMissionRep.port;
const url_ServoingMissionRep = services.ServoingMissionRep.protocol + '://' + services.ServoingMissionRep.host + ':' + services.ServoingMissionRep.port;
const url_DeliveryMissionRep = services.DeliveryMissionRep.protocol + '://' + services.DeliveryMissionRep.host + ':' + services.DeliveryMissionRep.port;

const url_MissionRep = services.MissionRep.protocol + '://' + services.MissionRep.host + ':' + services.MissionRep.port;
const url_MissionRouteRep = services.MissionRouteRep.protocol + '://' + services.MissionRouteRep.host + ':' + services.MissionRouteRep.port;
const url_GraphicOverlayRep = services.GraphicOverlayRep.protocol + '://' + services.GraphicOverlayRep.host + ':' + services.GraphicOverlayRep.port;
const url_NFZRep = services.NFZRep.protocol + '://' + services.NFZRep.host + ':' + services.NFZRep.port;

const timeout_AV = projConf.timeOutREST;

export class RequestManager {
    static externalServiceURLs: MAP<string> = {};
    public static requestToDBS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_DBS, API_GENERAL.general + path, bodyObj, timeout_AV);
    };
    public static requestToWS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_WS, API_GENERAL.general + path, bodyObj, timeout_AV);
    };
    public static requestToFRS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_FRS, API_GENERAL.general + path, bodyObj, timeout_AV);
    };

    public static requestToTMM = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_TMM, path, bodyObj, timeout_AV);
    };


    public static requestToCommRelayMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_CommRelayMissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToPatrolMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_PatrolMissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToObservationMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_ObservationMissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToScanMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_ScanMissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToServoingMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_ServoingMissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToDeliveryMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_DeliveryMissionRep, path, bodyObj, timeout_AV);
    };

    public static requestToMissionRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_MissionRep, path, bodyObj, timeout_AV);
    };
    public static requestToMissionRouteRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_MissionRouteRep, path, bodyObj, timeout_AV);
    };
    public static requestToGraphicOverlayRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_GraphicOverlayRep, path, bodyObj, timeout_AV);
    };
    public static requestToNFZRep = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_NFZRep, path, bodyObj, timeout_AV);
    };


    public static requestToExternalService = (serviceName: string, path: string, bodyObj: Object = {}): Promise<ASYNC_RESPONSE> => {

        if ( !RequestManager.externalServiceURLs.hasOwnProperty(serviceName) ) {
            const protocol = _.get(services, [serviceName, 'protocol']);
            const host = _.get(services, [serviceName, 'host']);
            const port = _.get(services, [serviceName, 'port']);

            const url = protocol + '://' + host + ':' + port;
            if ( protocol && host && port && RequestManager.validURL(url) ) {
                RequestManager.externalServiceURLs[serviceName] = url;
            }
        }

        return RequestManager.sendRestRequest(RequestManager.externalServiceURLs[serviceName], path, bodyObj);
    };


    public static sendRestRequest(url: string, path: string, bodyObj: Object, timeout: number = timeout_AV): Promise<ASYNC_RESPONSE> {
        return new Promise((resolve, reject) => {
            (async () => {
                const IP_ = url.split('://');
                if ( IP_.length > 1 ) {
                    // const isOn = await isReachable(IP_[1]);
                    // if (isOn) {
                    const res: ASYNC_RESPONSE = {success: false};
                    if ( RequestManager.validURL(url) ) {
                        request({
                            url: `${url}/${path}`,
                            method: 'POST',
                            json: true,
                            body: bodyObj,
                            timeout: timeout,
                        }, (error, response, body) => {

                            if ( error != null || typeof body !== 'object' ) {
                                res.data = error;
                                reject(res);
                                return null;
                            }
                            else {
                                const respBody: ASYNC_RESPONSE = response.body || {};
                                res.success = respBody.hasOwnProperty('success') ? respBody.success : !respBody.hasOwnProperty('error');
                                res.data = respBody.hasOwnProperty('data') ? respBody.data : respBody;
                                res.description = respBody.description;
                                resolve(res);
                                return null;
                            }
                        });
                    }
                    else {
                        reject(res);
                    }
                }
                else {
                    const res: ASYNC_RESPONSE = {success: false};
                    // reject({error: `cannot split ip from url ${url}`});
                    reject(res);
                }
            })();

        });

    }

    public static validURL = (string) => {
        try {
            return Boolean(new URL(string));
        } catch ( e ) {
            return false;
        }
    };


}
