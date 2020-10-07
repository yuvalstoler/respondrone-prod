const request = require('request');
import {Request, Response} from 'express';

import {
    AMS_API,
    ES_API, FS_API,
    RS_API
} from '../../../../../classes/dataClasses/api/api_enums';


import { ASYNC_RESPONSE } from '../../../../../classes/typings/all.typings';
// for webServer
const services = require('./../../../../../../../../config/services.json');
const projConf = require('./../../../../../../../../config/projConf.json');


const url_ES = services.ES.protocol + '://' + services.ES.host + ':' + services.ES.port;

const url_RS = services.RS.protocol + '://' + services.RS.host + ':' + services.RS.port;
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;

const timeout_AV = projConf.timeOutREST;
const timeout_File = 10 * 60 * 1000; // TODO ??


export class RequestManager {


    public static requestToES = (path: string, bodyObj: object): Promise<ASYNC_RESPONSE> => {
        return  RequestManager.sendRestRequest(url_ES, ES_API.general + path, bodyObj, timeout_AV);
    }

    public static requestToRS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_RS, RS_API.general + path, bodyObj, timeout_AV);
    };

    public static requestToFS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
        return RequestManager.sendRestRequest(url_FS, FS_API.general + path, bodyObj, timeout_AV);
    };
    public static uploadFileToFS = (req: Request, res: Response) => {
        return RequestManager.uploadFile(req, res, url_FS, FS_API.general + FS_API.uploadFile);
    };



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

    public static uploadFile(req: Request, res: Response, url: string, path: string, timeout: number = timeout_File) {

        const options = {
            url: `${url}/${path}`,
            method: 'POST',
            json: true,
            headers: req.headers,
            // timeout: timeout,
        };
        const httpReq = request(options)
            .on('response', (resMessage)  => {
                resMessage.pipe(res);
                // console.log(response.statusCode) // 200
                // console.log(response.headers['content-type']) // 'image/png'
            });

        req.pipe(httpReq);
    }

    public static validURL = (string) => {
        try {
            return Boolean(new URL(string));
        } catch ( e ) {
            return false;
        }
    };


}
