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

    fileIds = {};
    isInterval;
    interval;

    private constructor() {
        this.requestToDownloadFilesInterval();
    }


    // ----------------------
    private requestToDownloadFiles = (requestData: IDs_OBJ ) => {
        const res: ASYNC_RESPONSE<MEDIA_DATA> = {success: false};
        RequestManager.requestToCCG('/getFile', requestData)
            .then((data: ASYNC_RESPONSE) => {
                if (data.success) {
                    this.isInterval = false;
                    this.fileIds = {};
                    console.log('success');
                }
                else {
                    Object.assign(this.fileIds, requestData.ids);
                    this.isInterval = true;
                }
            })
            .catch((data: ASYNC_RESPONSE) => {
                Object.assign(this.fileIds, requestData.ids);
                this.isInterval = true;
            });

    }

    private getDownloadStatus = (requestData: IDs_OBJ) => {
        const res: ASYNC_RESPONSE<MEDIA_DATA> = {success: false};


    }

    private requestToDownloadFilesInterval = () => {
        setInterval(() => {
            if (this.isInterval) {
                const ids: IDs_OBJ = {ids: Object.values(this.fileIds)};
                this.requestToDownloadFiles(ids);
            }
        }, 5000);
    }


    // ---------------------------

    // region API uncions
    public static requestToDownloadFiles = DownloadManager.instance.requestToDownloadFiles;
    public static getDownloadStatus = DownloadManager.instance.getDownloadStatus;



    // endregion API uncions

}
