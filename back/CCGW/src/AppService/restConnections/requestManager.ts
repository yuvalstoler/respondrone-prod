const request = require('request');

import {
    API_GENERAL,
} from '../../../../../classes/dataClasses/api/api_enums';


import { ASYNC_RESPONSE } from '../../../../../classes/typings/all.typings';
// for webServer
const services = require('./../../../../../../../../config/services.json');
const projConf = require('./../../../../../../../../config/projConf.json');



const timeout_AV = projConf.timeOutREST;


const url_RS = services.RS.protocol + '://' + services.RS.host + ':' + services.RS.port;
const url_TS = services.TS.protocol + '://' + services.TS.host + ':' + services.TS.port;
const url_MG = services.MG.protocol + '://' + services.MG.host + ':' + services.MG.port;

export class RequestManager {

    public static requestToRS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_RS, API_GENERAL.general + path, bodyObj, timeout_AV);
    }
    public static requestToTS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_TS, API_GENERAL.general + path, bodyObj, timeout_AV);
    }

    public static requestToMG = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_MG, API_GENERAL.general + path, bodyObj, timeout_AV);
    }





    public static sendRestRequest(url: string, path: string, bodyObj: Object, timeout: number): Promise<ASYNC_RESPONSE> {
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
