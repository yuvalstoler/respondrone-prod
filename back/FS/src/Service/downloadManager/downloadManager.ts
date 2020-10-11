import {
    Request,
    Response
} from 'express';

const path = require('path');
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const services = require('./../../../../../../../../config/services.json');

import {
    ASYNC_RESPONSE,
    IDs_OBJ,
    MEDIA_DATA,
    MEDIA_TYPE
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';


const uploadsPath = path.join(__dirname, '../../../../../../uploads');

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


export class DownloadManager {


    private static instance: DownloadManager = new DownloadManager();

    private constructor() {

    }


    // ----------------------
    private requestToDownloadFiles = (requestData: IDs_OBJ ) => {
        const res: ASYNC_RESPONSE<MEDIA_DATA> = {success: false};


    }

    private getDownloadStatus = (requestData: IDs_OBJ) => {
        const res: ASYNC_RESPONSE<MEDIA_DATA> = {success: false};


    }


    // ---------------------------

    // region API uncions
    public static requestToDownloadFiles = DownloadManager.instance.requestToDownloadFiles;
    public static getDownloadStatus = DownloadManager.instance.getDownloadStatus;



    // endregion API uncions

}
