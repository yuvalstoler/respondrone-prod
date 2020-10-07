const request = require('request');
import {Request, Response} from 'express';

import {
    CCG_API
} from '../../../../../classes/dataClasses/api/api_enums';


import { ASYNC_RESPONSE } from '../../../../../classes/typings/all.typings';
// for webServer
const services = require('./../../../../../../../../config/services.json');
const projConf = require('./../../../../../../../../config/projConf.json');

const timeout_AV = projConf.timeOutREST;
const timeout_File = 10 * 60 * 1000; // TODO ??

const url_CCG = services.CCG.protocol + '://' + services.CCG.host + ':' + services.CCG.port;

export class RequestManager {


    public static requestToCCG = (path: string, bodyObj: object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_CCG, CCG_API.general + path, bodyObj, timeout_AV);
    }
    public static uploadFileToCCG = (req: Request, res: Response, formData: object) => {
        return RequestManager.uploadFile(req, res, url_CCG, CCG_API.general + CCG_API.uploadFileToMG, formData);
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

    public static uploadFile(req, res, url, path, formData, timeout: number = timeout_File) {
        request({
            url: `${url}/${path}`,
            method: 'POST',
            formData: formData,
            json: true
            // timeout: timeout,
        }, (error, resp, body) => {
            if (error || !body || body.error) {
                res.send({success: false, data: error});
            } else {
                res.send(body);
            }
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
