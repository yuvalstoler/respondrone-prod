import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';
const _ = require('lodash');
import {IRest} from '../../../../../classes/dataClasses/interfaces/IRest';
import {FS_API} from '../../../../../classes/dataClasses/api/api_enums';
import {ASYNC_RESPONSE} from '../../../../../classes/typings/all.typings';
import {FileManager} from '../fileManager/fileManager';



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
    private uploadFile = (request, response: Response) => {
        FileManager.uploadFile(request, response);
    }
    // ----------------------
    private removeFile = (request, response: Response) => {
        let res: ASYNC_RESPONSE = {success: false};

        const mediaData = request.body;
        if (mediaData) {
            FileManager.removeFile(mediaData)
                .then((data: ASYNC_RESPONSE) => {
                    res = data;
                    response.send(res);
                })
                .catch((err) => {
                    res.data = err;
                    response.send(res);
                });
        } else {
            res.data = 'Missing data';
            response.send(res);
        }

    }
    // ----------------------
    private getFile = (request: Request, response: Response) => {
        FileManager.getFile(request, response);
    }
    // ----------------------
    private getFileForSave = (request: Request, response: Response) => {
        FileManager.getFileForSave(request, response);
    }
    // ---------------------------

    routers = {
        [FS_API.uploadFile]: this.uploadFile,
        [FS_API.removeFile]: this.removeFile,
        [FS_API.file]: this.getFile,
        [FS_API.getFileForSave]: this.getFileForSave,
    };

    // region API uncions
    public static listen = ApiManager.instance.listen;
    // endregion API uncions

}
