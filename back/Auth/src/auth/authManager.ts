import {Request, Response} from 'express';
const jwt = require('jsonwebtoken');

import {Logger} from '../logger/Logger';
import {ASYNC_RESPONSE, ID_OBJ, MAP, USER_DATA, USER_DATA_UI} from '../../../../classes/typings/all.typings';
import {RequestManager} from '../AppService/restConnections/requestManager';
import {DBS_API} from '../../../../classes/dataClasses/api/api_enums';
import {DataUtility} from '../../../../classes/applicationClasses/utility/dataUtility';

const services = require('./../../../../../../../config/services.json');

const tokens: MAP<string> = {};
const secret = services.webServer.secret;
const expireIn = services.webServer.expireIn;
const User: USER_DATA = {
    name: services.webServer.name,
    password: services.webServer.password,
    id: services.webServer.id,
    chatPassword: services.webServer.chatPassword
};




export class AuthManager {
    private static instance: AuthManager = new AuthManager();


    constructor() {
    }

    // ----------------------
    private login = (req: Request, res: Response) => {
        const resp: ASYNC_RESPONSE<USER_DATA_UI> = {success: false};
        if (req.method === 'POST') {
            if (req.body.name && req.body.password) {
                RequestManager.requestToDBS(DBS_API.readUserByCredentials, req.body)
                    .then((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                        if ((userRes.success && userRes.data !== undefined) || (req.body.name === User.name && req.body.password === User.password)) {
                            const token = jwt.sign({expiresIn: expireIn, data: userRes.data || User}, secret);
                            tokens[token] = User.name;

                            resp.success = true;
                            resp.data = {
                                id: userRes.data ? userRes.data.id : User.id,
                                name: userRes.data ? userRes.data.name : User.name,
                                token: token,
                                chatPassword: userRes.data ? userRes.data.chatPassword : User.chatPassword,
                            };
                            res.json(resp);
                        }
                        else {
                            resp.description = 'Authentication failed. Wrong password or name.';
                            res.json(resp);
                        }
                    })
                    .catch((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                        resp.description = 'Authentication failed. Wrong password or name.';
                        res.json(resp);
                    });
            }
            else if (req.body.token) {
                this.verifyToken(req.body.token, (checkRes: ASYNC_RESPONSE<USER_DATA>) => {
                    if (checkRes.success && checkRes.data) {
                        const idObj: ID_OBJ = {id: checkRes.data.id};
                        RequestManager.requestToDBS(DBS_API.readUser, idObj)
                            .then((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                                if ((userRes.success && userRes.data !== undefined) || (checkRes.data.name === User.name && checkRes.data.password === User.password)) {
                                    const token = jwt.sign({expiresIn: expireIn, data: userRes.data || User}, secret);
                                    tokens[token] = User.name;

                                    resp.success = true;
                                    resp.data = {
                                        id: userRes.data ? userRes.data.id : User.id,
                                        name: userRes.data ? userRes.data.name : User.name,
                                        token: token,
                                        chatPassword: userRes.data ? userRes.data.chatPassword : User.chatPassword,
                                    };
                                    res.json(resp);
                                }
                                else {
                                    resp.description = 'Authentication failed.';
                                    res.json(resp);
                                }
                            })
                            .catch((userRes: ASYNC_RESPONSE<USER_DATA>) => {
                                resp.description = 'Authentication failed.';
                                res.json(resp);
                            });
                    }
                    else {
                        resp.description = 'Authentication failed';
                        res.json(resp);
                    }
                });
            }
            else {
                resp.description = 'Authentication failed';
                res.json(resp);
            }
        }
        else {
            res.status(405).json({error: 'Method Not Allowed'});
        }

    };
    // ----------------------
    private verifyToken = (token: string, cb: Function) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                cb({success: false});
            }
            else {
                cb({success: true, data: decoded.data});
            }
        });
    };
    // ----------------------
    private update = (token: string): string => {
        if (tokens.hasOwnProperty(token)) {
            const tokenNew = jwt.sign({
                expiresIn: expireIn,
                data: {name: User.name, password: User.password}
            }, secret);
            tokens[tokenNew] = User.name;
            return (tokenNew);
        }
        else {
            return undefined;
        }
    };
    // ----------------------
    private checkToken = (token: string, cb: Function) => {
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
    // ----------------------
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
    // ----------------------
    private check = (req: Request, res: Response) => {
        const resp: ASYNC_RESPONSE = {success: false};
        if (req.body.token) {
            this.verifyToken(req.body.token, (checkRes: ASYNC_RESPONSE<USER_DATA>) => {
                res.send(checkRes);
            });
        }
        else {
            resp.description = 'Missing field token';
            res.send(resp);
        }
    }

    public static login = AuthManager.instance.login;
    public static update = AuthManager.instance.update;
    public static check = AuthManager.instance.check;
    public static createUser = AuthManager.instance.createUser;
}

