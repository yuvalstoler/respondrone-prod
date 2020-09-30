import {Request, Response} from 'express';
const jwt = require('jsonwebtoken');

import {Logger} from '../logger/Logger';
import { MAP } from "../../../../classes/typings/all.typings";


const services = require('./../../../../../../../config/services.json');

const secret = services.MWS.secret;
const expireIn = services.MWS.expireIn;
const User = {
    name: services.MWS.name,
    password: services.MWS.password
};
const tokens: MAP<string> = {};
const t = jwt.sign({
    exp: expireIn,
    data: {name: User.name, password: User.password}
}, secret);

Logger.logValues('JWT', [t]);

export class AuthRouter {

    public login = (req: Request, res: Response) => {
        if (req.method === 'POST') {
            if (req.body.name && req.body.password) {
                if (req.body.name === User.name && req.body.password === User.password) {

                    const token = jwt.sign({
                        exp: expireIn,
                        data: {name: req.body.name, password: req.body.password}
                    }, secret);

                    tokens[token] = User.name;

                    res.json({
                        isAuth: true,
                        success: true,
                        message: 'Authentication success',
                        token: token,
                        // until: new Date(decoded.exp * 1000).toISOString()
                    });

                }
                else {
                    res.json(
                        {
                            success: false,
                            message: 'Authentication failed. Wrong password or name.'
                        }
                    );
                }
            }
            else {
                res.json({
                    isAuth: false,
                    success: false,
                    message: 'Authentication failed'
                });
            }
        }
        else {
            res.status(405).json({error: 'Method Not Allowed'});
        }

    };

    public update = (token: string): string => {
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

    public check = (token: string, cb: Function) => {
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
}

