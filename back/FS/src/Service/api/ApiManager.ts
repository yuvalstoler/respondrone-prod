import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';
const path = require('path');
const _ = require('lodash');
import {IRest} from '../../../../../classes/dataClasses/interfaces/IRest';
import {FS_API} from '../../../../../classes/dataClasses/api/api_enums';
import {ASYNC_RESPONSE} from '../../../../../classes/typings/all.typings';
const multer = require('multer');
const fs = require('fs');
const services = require('./../../../../../../../../config/services.json');


const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const uploadsPath = '../../../../uploads';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadsPath);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    // limits: { fileSize: maxSize },
}).any('userFiles');



export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();

    private constructor() {

    }

    // ----------------------
    public listen = (router: core.Router): boolean => {
        for (const path1 in this.routers) {
            if ( this.routers.hasOwnProperty(path1) ) {
                router.use(path1, this.routers[path1]);
            }
        }
        return true;
    }



    // ----------------------
    private upload = (request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};

        upload(request, response, (err) => {
            if (request.files === undefined || request.files.length === 0) {
                res.data = 'No file selected';
                response.status(400).send(res);
            } else if (err) {
                res.data = `Could not upload file. ${err}`;
                response.status(500).send(res);
            } else {
                const id = request.files[0].filename;
                let type: 'image' | 'video';
                if (request.files[0].mimetype === 'image/jpeg') {
                    type = 'image';
                } else if (request.files[0].mimetype === 'video/mp4') {
                    type = 'video';
                }

                res.success = true;
                res.data = {
                    id: id,
                    type: type,
                    url: `${url_FS}/api/file/${id}`
                };
                response.status(200).send(res);
            }

        });
    }
    // ----------------------
    private remove = (request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};

        const id = _.get(request, 'body.id');
        if (id) {
            fs.unlink(path.join(uploadsPath, `${id}`), (err) => {
                if (err) {
                    res.data = `Could not delete file. ${err}`;
                    response.status(500).send(res);
                } else {
                    res.success = true;
                    response.send(res);
                }
            });
        } else {
            response.send({success: false, data: 'no id'});
        }
    }
    // ----------------------
    private getFile = (request: Request, response: Response) => {
        fs.readFile(path.join(uploadsPath, `${request.params.id}`), (err, data) => {
            if (err) {
                fs.readFile(path.join(uploadsPath, `One_black_Pixel.png`), (err1, data1) => {
                    if (err1) {
                        response.status(503).send({success: false, data: 'internal server error'});
                    } else {
                        response.writeHead(200, {'Content-Type': 'image/jpg'});
                        response.write(data1);
                        response.end();
                    }
                });
            } else {
                response.writeHead(200, {'Content-Type': 'image/jpg'});
                response.write(data);
                response.end();
            }
        });
    }

    // ---------------------------

    routers = {
        [FS_API.uploadFile]: this.upload,
        [FS_API.removeFile]: this.remove,
        [FS_API.file]: this.getFile
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;
    // endregion API uncions

}
