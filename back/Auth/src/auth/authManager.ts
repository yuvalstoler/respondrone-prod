import {Request, Response} from 'express';
const jwt = require('jsonwebtoken');

import {Logger} from '../logger/Logger';
import {ASYNC_RESPONSE, LOGIN_RESPONSE, MAP, USER_DATA} from '../../../../classes/typings/all.typings';
import {RequestManager} from '../AppService/restConnections/requestManager';
import {DBS_API} from '../../../../classes/dataClasses/api/api_enums';
import {DataUtility} from '../../../../classes/applicationClasses/utility/dataUtility';


const services = require('./../../../../../../../config/services.json');

const secret = services.webServer.secret;
const expireIn = services.webServer.expireIn;
const User = {
    name: services.webServer.name,
    password: services.webServer.password
};
const tokens: MAP<string> = {};
const t = jwt.sign({
    exp: expireIn,
    data: {name: User.name, password: User.password}
}, secret);

Logger.logValues('JWT', [t]);

export class AuthManager {
    private static instance: AuthManager = new AuthManager();

    constructor() {
    }


    private login = (req: Request, res: Response) => {
        const resp: ASYNC_RESPONSE<LOGIN_RESPONSE> = {
            success: false,
            data: {
                success: false,
                isAuth: false,
                message: '',
                token: undefined
            }
        };
        if (req.method === 'POST') {
            if (req.body.name && req.body.password) {
                RequestManager.requestToDBS(DBS_API.readUser, req.body)
                    .then((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                        if ((userRes.success && userRes.data !== undefined)
                            || (req.body.name === User.name && req.body.password === User.password)) {
                            const token = jwt.sign({
                                exp: expireIn,
                                data: {name: req.body.name, password: req.body.password}
                            }, secret);

                            tokens[token] = User.name;

                            resp.success = true;
                            resp.data = {
                                isAuth: true,
                                success: true,
                                message: 'Authentication success',
                                token: token,
                                // until: new Date(decoded.exp * 1000).toISOString()
                            };
                            res.json(resp);

                        }
                        else {
                            resp.data.message = 'Authentication failed. Wrong password or name.';
                            res.json(resp);
                        }
                    })
                    .catch((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                        resp.data.message = 'Authentication failed. Wrong password or name.';
                        res.json(resp);
                    });
            }
            else {
                resp.data.message = 'Authentication failed';
                res.json(resp);
            }
        }
        else {
            res.status(405).json({error: 'Method Not Allowed'});
        }

    };

    private update = (token: string): string => {
        if (tokens.hasOwnProperty(token)) {
            const tokenNew = jwt.sign({
                exp: expireIn,
                data: {name: User.name, password: User.password}
            }, secret);
            tokens[tokenNew] = User.name;
            return (tokenNew);
        }
        else {
            return undefined;
        }
    };

    private check = (token: string, cb: Function) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                cb({success: false, message: 'token no valid'});
            }
            else {
                const tokenNew = this.update(token);
                if (tokenNew) {
                    cb({
                        success: true,
                        message: 'Authentication success',
                        token: tokenNew
                    });
                }
                else {
                    cb({success: false, message: 'token no valid'});
                }
            }
        });
    };

    private createUser = (req: Request, res: Response) => {
        const resp: ASYNC_RESPONSE = {success: false};

        const body: USER_DATA = req.body || {};
        if (body.name !== undefined && body.password !== undefined) {
            body.id = DataUtility.generateID();
            RequestManager.requestToDBS(DBS_API.createUser, body)
                .then((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                    res.send(userRes);
                })
                .catch((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                    res.send(userRes);
                });
        }
        else {
            resp.data = 'Missing name or password field';
            res.send(resp);
        }

    }

    public static login = AuthManager.instance.login;
    public static update = AuthManager.instance.update;
    public static check = AuthManager.instance.check;
    public static createUser = AuthManager.instance.createUser;
}

