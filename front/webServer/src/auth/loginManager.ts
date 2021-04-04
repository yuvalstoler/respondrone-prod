import {Request, Response} from 'express';
// import {SocketIO} from '../../websocket/socket.io';
// import {Login} from '../../../../../classes/dataClasses/site/login';
import {ASYNC_RESPONSE, CREDENTIALS, FR_DATA_UI, MAP, USER_DATA_UI} from '../../../../classes/typings/all.typings';
import {RequestManager} from '../AppService/restConnections/requestManager';
import {AUTH_API} from '../../../../classes/dataClasses/api/api_enums';
import {SocketIO} from "../websocket/socket.io";


const jsonfile = require('jsonfile');
// const file = require('path').join(__dirname, './../../../../../../../../site.json');

const jwt = require('jsonwebtoken');

const projConf = require('./../../../../../../../config/projConf.json');
const secret = projConf.secret;
const expireIn = projConf.expireIn;

// const User = {
//     name: projConf.name,
//     password: projConf.password
// };

const tokens: MAP<string> = {};

export class LoginManager {

    private static instance: LoginManager = new LoginManager();


    private constructor() {
    }

    private listen = (router) => {
        for (const path in this.routers) {
            if (this.routers.hasOwnProperty(path)) {
                router.use('/' + path, this.routers[path]);
            }
        }
    };


    public validateLogin = (login: CREDENTIALS): Promise<ASYNC_RESPONSE> => {
        const resData: ASYNC_RESPONSE = {success: false, data: undefined};
        return new Promise((resolve, reject) => {
            RequestManager.requestToAuthService(AUTH_API.login, login)
                .then((result: ASYNC_RESPONSE<USER_DATA_UI>) => {
                   resolve(result);
                })
                .catch((data) => {
                    reject(data);
                });
        });
    };

    private sendDataToUI = (): void => {
        SocketIO.emit('webServer_logout', false);
    };

    // private login = (loginData) => {
    //     const res = {
    //         json:
    //             {
    //                 isAuth: false,
    //                 success: false,
    //                 message: 'Authentication failed',
    //                 token: undefined
    //             }
    //     };
    //     if (loginData.name === User.name && loginData.password === User.password) {
    //
    //         const token = jwt.sign({
    //             exp: expireIn,
    //             data: {name: loginData.name, password: loginData.password}
    //         }, secret);
    //         tokens[token] = User.name;
    //         res.json = {
    //             isAuth: true,
    //             success: true,
    //             message: 'Authentication success',
    //             token: token,
    //             // until: new Date(decoded.exp * 1000).toISOString()
    //         };
    //         return res;
    //     } else {
    //         res.json.message = 'Authentication failed. Wrong password or name.';
    //         return res;
    //     }
    //
    //
    // };

    routers: {} = {};

    public static listen = LoginManager.instance.listen;
    public static validateLogin = LoginManager.instance.validateLogin;
    public static sendDataToUI = LoginManager.instance.sendDataToUI;
}
