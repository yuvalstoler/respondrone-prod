// import {NextFunction, Request, Response} from 'express';
// import {AMS_API} from '../../../../../classes/dataClasses/api/api_enums';
// const _ = require('lodash');
// const express = require('express');
//
// const router = express.Router();
// const productRouter = express.Router();
//
//
// export class RestManager {
//     app;
//     // server;
//
//
//     // this object contain path and routers for different classes
//     routers: {} = {
//         [AMS_API.general]: express.Router(),
//     };
//
//
//     constructor(_app) {
//         this.app = _app;
//         this.listen();
//     };
//
//     private listen(): any {
//         for (const path in this.routers) {
//             if ( this.routers.hasOwnProperty(path) ) {
//                 this.app.use(path, this.routers[path]);
//             }
//         }
//
//     };
//
//     private sendresponse(res: Response, data) {
//         if ( data && data.error ) {
//             res.status(503).send({error: data.error});
//         }
//         else {
//             res.status(200).send(data);
//         }
//         return null;
//     };
//
//
// }
