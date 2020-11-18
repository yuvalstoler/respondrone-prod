import {
    ASYNC_RESPONSE,
    DISCOVERY_STATUS, ENTITY_DATA,
} from "../../classes/all.typings";
import {DbManager} from "../db/dbManager";
const _ = require('lodash');
const request = require('request');

const projConf = require("./../../../config/projConf.json");
const keepAliveInterval = _.get(projConf, 'EntityService.keepAliveInterval', 5000);

export class DiscoveryManager {
    private static instance: DiscoveryManager = new DiscoveryManager();
    private intervals = {};


    private constructor() { }

    private startCheckKeepAlive = () => {

        for (const key in this.intervals) {
            clearInterval(this.intervals[key]);
            this.intervals[key] = undefined;
        }
        this.intervals = {};

        DbManager.requests({})
            .then((data: ENTITY_DATA[]) => {
                data.forEach((obj: ENTITY_DATA) => {
                    this.checkServiceKeepAlive(obj);
                });
            })
            .catch((data) => {
                console.log('fail get data from DB');
                setTimeout(this.startCheckKeepAlive, 5000);
            });

    };
    // ---------------------
    private checkServiceKeepAlive = (obj: ENTITY_DATA) => {
        this.intervals[obj.id] = setInterval(() => {

            // const url = `http://${obj.ip}:${obj.port}`;
            const ip = obj.ip.substr(-1) === '/' ? obj.ip.substring(0, obj.ip.length - 1) : obj.ip;
            const port = (obj.port && !isNaN(Number(obj.port))) ? ':' + Number(obj.port) : '';
            const url = ip + port;

            this.sendGetRestRequestPromise(url, 'status', {})
                .then((data) => {
                    if (obj.keepAliveStatus === DISCOVERY_STATUS.Down) {
                        DbManager.update({id: obj.id}, {$set: {'keepAliveStatus': DISCOVERY_STATUS.Ok}})
                            .then((data) => {
                                Object.assign(obj, data);
                            })
                            .catch((data) => {
                                console.log('cant save keepAliveStatus ok')
                            });
                    }
                })
                .catch((data) => {
                    if (obj.keepAliveStatus === DISCOVERY_STATUS.Ok) {
                        DbManager.update({id: obj.id}, {$set: {'keepAliveStatus': DISCOVERY_STATUS.Down}})
                            .then((data) => {
                                Object.assign(obj, data);
                            })
                            .catch((data) => {
                                console.log('cant save keepAliveStatus down')
                            });
                    }
                });
        }, keepAliveInterval);
    };
    // ---------------------
    public sendPostRestRequestPromise(url: string, path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            request({
                url: `${url}/${path}`,
                method: 'POST',
                json: true,
                body: bodyObj,
                timeout: keepAliveInterval - 500,
            }, (error, response, body) => {

                if ( error != null || typeof body !== 'object' || body.error) {
                    // res.data = error;
                    reject(res);
                    return null;
                }
                else {
                    // const respBody = response.body || {};
                    res.success = true;
                    resolve(res);
                    return null;
                }
            });

        });

    }
    // ---------------------
    public sendGetRestRequestPromise(url: string, path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            request({
                url: `${url}/${path}`,
                method: 'GET',
                json: true,
                body: bodyObj,
                timeout: keepAliveInterval - 500,
            }, (error, response, body) => {

                if ( error != null || typeof body !== 'object' || body.error) {
                    // res.data = error;
                    reject(res);
                    return null;
                }
                else {
                    // const respBody = response.body || {};
                    res.success = true;
                    resolve(res);
                    return null;
                }
            });

        });

    }
    // ----------------------
    public static startCheckKeepAlive = DiscoveryManager.instance.startCheckKeepAlive;
}
