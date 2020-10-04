const request = require('request');
const _ = require('lodash');

import {ASYNC_RESPONSE, MAP} from '../../../../../classes/typings/all.typings';
const services = require('./../../../../../../../../config/services.json');

const url_webService =   services.webService.protocol + '://' +   services.webService.host + ':' +   services.webService.port;
const url_routeService = services.routeService.protocol + '://' + services.routeService.host + ':' + services.routeService.port;
const url_droneService = services.droneService.protocol + '://' + services.droneService.host + ':' + services.droneService.port;
const timeout = services.webService.timeOutREST_OfResponseFromDrone || 10000;

export class RequestManager {

    static externalServiceURLs: MAP<string> = {
        webService: url_webService,
        routeService: url_routeService,
        droneService: url_droneService,

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

    public static requestToWebService = (path: string, bodyObj: Object = {}) => {
        return RequestManager.sendRestRequest(url_webService, path, bodyObj);
    };
    public static requestToRouteService = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequestPromise(url_routeService, path, bodyObj);
    };

    public static requestToFCS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequestPromise(url_droneService, path, bodyObj);
    };


    public static sendRestRequest(url, path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
        return new Promise((resolve, reject) => {
            request({
                url: `${url}/${path}`,
                method: 'POST',
                json: true,
                body: bodyObj,
                timeout: timeout,
            }, (error, response, body) => {
                if ( error != null ) {
                    reject({error: error});
                    return null;
                }
                else {
                    resolve(response.body);
                    return null;
                }
            });
        });

    }


    public static sendRestRequestPromise(url: string, path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
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
                                const respBody = response.body || {};
                                res.success = respBody.hasOwnProperty('success') ? respBody.success : !respBody.hasOwnProperty('error');
                                res.data = respBody.hasOwnProperty('data') ? respBody.data : respBody;
                                resolve(res);
                                return null;
                            }
                        });
                    }
                    else {
                        reject(res);
                    }
                    // } else {
                    //     const res: ASYNC_RESPONSE = {success: false};
                    //     res.description = `port close ${url}`;
                    //     reject(res);
                    // }
                }
                else {
                    const res: ASYNC_RESPONSE = {success: false};
                    reject({error: `cannot split ip from url ${url}`});
                    reject(res);
                }
            })();

        });

    }

    public static validURL = (string) => {
        try {
            return Boolean(new URL(string));
        }
        catch (e) {
            return false;
        }
    };

}
