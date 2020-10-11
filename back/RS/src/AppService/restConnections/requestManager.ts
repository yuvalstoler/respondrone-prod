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
const url_MWS = services.MWS.protocol + '://' + services.MWS.host + ':' + services.MWS.port;
const url_WS = services.webServer.protocol + '://' + services.webServer.host + ':' + services.webServer.port;

const timeout_AV = projConf.timeOutREST;

export class RequestManager {
    static externalServiceURLs: MAP<string> = {};
    public static requestToDBS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_DBS, API_GENERAL.general + path, bodyObj, timeout_AV);
    };
    public static requestToMWS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_MWS, API_GENERAL.general + path, bodyObj, timeout_AV);
    };
    public static requestToWS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_WS, API_GENERAL.general + path, bodyObj, timeout_AV);
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
