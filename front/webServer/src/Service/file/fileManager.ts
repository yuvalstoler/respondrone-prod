const _ = require('lodash');

import {
    FS_API,
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    FILE_FS_DATA,
} from '../../../../../classes/typings/all.typings';


export class FileManager {


    private static instance: FileManager = new FileManager();


    private constructor() {
    }

    private uploadFile = (request, response) => {
        RequestManager.uploadFileToFS(request, response);
    };


    private removeFile = (obj: FILE_FS_DATA) => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToFS(FS_API.removeFile, obj)
                .then((data: ASYNC_RESPONSE) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    resolve(data);
                });
        });
    };


    // region API uncions

    public static uploadFile = FileManager.instance.uploadFile;
    public static removeFile = FileManager.instance.removeFile;


    // endregion API uncions

}
