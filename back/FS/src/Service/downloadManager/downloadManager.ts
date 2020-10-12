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
    FILE_GW_DATA,
    ID_OBJ,
    ID_TYPE,
    IDs_OBJ,
    FILE_FS_DATA,
    MEDIA_TYPE
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import { CCGW_API } from "../../../../../classes/dataClasses/api/api_enums";
import { UpdateListenersManager } from "../updateListeners/updateListenersManager";


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

    private requestToDownloadFile = (requestData: ID_OBJ) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};
        RequestManager.requestToCCG(CCGW_API.getFileById, requestData)
            .then((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                if ( data.success ) {
                    this.isInterval = false;
                    this.fileIds = {};
                    console.log('success');
                //    todo write file and update DB
                //    todo update listeners
                //     UpdateListenersManager.updateFileListeners()
                }
                else {
                //   todo
                }
            })
            .catch((data: ASYNC_RESPONSE) => {
            //todo
            });

    }

    private requestToDownloadFiles = (requestData: IDs_OBJ) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};

        requestData.ids.forEach((id: ID_TYPE) => {
            this.requestToDownloadFile({id: id});
        });

        // RequestManager.requestToCCG(CCGW_API.getFileById, requestData)
        //     .then((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
        //         if ( data.success ) {
        //             this.isInterval = false;
        //             this.fileIds = {};
        //             console.log('success');
        //         }
        //         else {
        //             Object.assign(this.fileIds, requestData.ids);
        //             this.isInterval = true;
        //         }
        //     })
        //     .catch((data: ASYNC_RESPONSE) => {
        //         Object.assign(this.fileIds, requestData.ids);
        //         this.isInterval = true;
        //     });

    }

    private getDownloadStatus = (requestData: IDs_OBJ) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};


    }

    private requestToDownloadFilesInterval = () => {
        setInterval(() => {
            if ( this.isInterval ) {
                const ids: IDs_OBJ = {ids: Object.values(this.fileIds)};
                this.requestToDownloadFiles(ids);
            }
        }, 5000);
    }


    // ---------------------------

    // region API uncions
    public static requestToDownloadFiles = DownloadManager.instance.requestToDownloadFiles;
    public static requestToDownloadFile = DownloadManager.instance.requestToDownloadFile;
    public static getDownloadStatus = DownloadManager.instance.getDownloadStatus;


    // endregion API uncions

}
