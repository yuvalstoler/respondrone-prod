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
    private upload = (request, response: Response) => {
        FileManager.upload(request, response);
    }
    // ----------------------
    private remove = (request, response: Response) => {
        let res: ASYNC_RESPONSE = {success: false};

        const mediaData = _.get(request, 'body.data');
        if (mediaData) {
            FileManager.remove(mediaData)
                .then((data: ASYNC_RESPONSE) => {
                    res = data;
                    response.send(res);
                })
                .catch((err) => {
                    res.data = err;
                    response.send(res);
                });
        } else {
            res.data = 'Missing id';
            response.send(res);
        }

    }
    // ----------------------
    private getFile = (request: Request, response: Response) => {
        FileManager.getFile(request, response);
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
