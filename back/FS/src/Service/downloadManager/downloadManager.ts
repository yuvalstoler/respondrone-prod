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
    MEDIA_TYPE,
    FILE_DB_DATA,
    FILE_STATUS,
    MAP
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import {
    CCGW_API,
    DBS_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { Converting } from '../../../../../classes/applicationClasses/utility/converting';


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

    fileDbDataMap: MAP<FILE_DB_DATA> = {};
    downloadFileInterval;

    private constructor() {
        this.get_fileDbDataMap_fromDB();
    }


    // ----------------------

    private requestToDownloadFile = (requestData: ID_OBJ): Promise<ASYNC_RESPONSE<FILE_GW_DATA>> => {
        return new Promise((resolve, reject) => {

            const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};
            RequestManager.requestToCCG(CCGW_API.getFileById, requestData)
                .then((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                    if ( data.success ) {
                        this.isInterval = false;
                        this.fileIds = {};
                        console.log('success');
                        //    todo .then - update listeners


                        //    todo write file and update DB

                        resolve(data);
                    }
                    else {
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE) => {
                    reject(data);
                });
        });
    }


    private saveFileFromMGW = (dileGwData: FILE_GW_DATA) => {
        //todo promise

        const buffer = Converting.base64_to_Buffer(dileGwData.byteArray);
        fs.writeFile(uploadsPath + '/' + dileGwData.fsName, buffer, (err) => {
            if ( !err ) {
                //

            }
            else {

            }

        });

    }

    private downloadFileIntervalProcess = () => {
        if ( !this.downloadFileInterval ) {
            this.downloadFileInterval = setInterval(() => {
                for ( const fileId in this.fileDbDataMap ) {
                    if ( this.fileDbDataMap.hasOwnProperty(fileId) ) {
                        if ( this.fileDbDataMap[fileId].fileStatus === FILE_STATUS.needToDownload ) {
                            this.fileDbDataMap[fileId].fileStatus = FILE_STATUS.inProcess;
                            this.requestToDownloadFile({id: fileId})
                                .then((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                                    this.saveFileFromMGW(data.data);

                                    const fieldsForUpdate: Partial<FILE_DB_DATA> = {
                                        fileName: data.data.fileName,
                                        fileStatus: FILE_STATUS.downloaded,
                                        fsName: data.data.fsName,
                                        fsPath: data.data.fsPath,
                                        type: data.data.type,
                                    };

                                    this.fileDbDataMap[fileId].fileStatus = FILE_STATUS.downloaded;
                                    const fileDbData: FILE_DB_DATA = this.prepare_FILE_DB(fileId, fieldsForUpdate);
                                    RequestManager.requestToDBS(DBS_API.saveFileData, fileDbData)
                                        .then((dataDBS: ASYNC_RESPONSE<FILE_DB_DATA>) => {

                                        })
                                        .catch((dataDBS: ASYNC_RESPONSE<FILE_DB_DATA>) => {

                                        });

                                })
                                .catch((data: ASYNC_RESPONSE<FILE_GW_DATA>) => {
                                    this.fileDbDataMap[fileId].fileStatus = FILE_STATUS.needToDownload;
                                });
                        }
                        else {

                        }
                    }
                }
            }, 1000);
        }
    }

    private requestToDownloadFiles = (requestData: IDs_OBJ) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};

        //todo save request list in DB

        requestData.ids.forEach((id: ID_TYPE) => {
            const fileDbData: FILE_DB_DATA = this.prepare_FILE_DB(id);
            RequestManager.requestToDBS(DBS_API.saveFileData, fileDbData)
                .then((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                    this.fileDbDataMap[id] = fileDbData;
                    this.downloadFileIntervalProcess();
                })
                .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {

                });
        });
    }

    private prepare_FILE_DB = (id: ID_TYPE, fieldsForUpdate: Partial<FILE_DB_DATA> = {}): FILE_DB_DATA => {
        return {
            id: id,
            fsName: '',
            fileName: '',
            fileStatus: FILE_STATUS.needToDownload,
            fsPath: '',
            type: MEDIA_TYPE.unknown,
            ...fieldsForUpdate
        };
    }
    private getFileData = (fileId: ID_OBJ) => {
        const res: ASYNC_RESPONSE<FILE_DB_DATA> = {success: false};
        if ( this.fileDbDataMap.hasOwnProperty(fileId.id) ) {
            res.success = true;
            res.data = this.fileDbDataMap[fileId.id];
        }
        return res;
    }

    private get_fileDbDataMap_fromDB = () => {
        RequestManager.requestToDBS(DBS_API.getAllFileData, {})
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA[]>) => {
                if ( data.success ) {
                    data.data.forEach((fileDbData: FILE_DB_DATA) => {
                        this.fileDbDataMap[fileDbData.id] = fileDbData;
                    });
                    this.downloadFileIntervalProcess();
                }
                else {
                    setTimeout(() => {
                        this.get_fileDbDataMap_fromDB();
                    }, 2000);

                }
            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA[]>) => {
                setTimeout(() => {
                    this.get_fileDbDataMap_fromDB();
                }, 2000);
            });
    }


    // ---------------------------

    // region API uncions
    public static requestToDownloadFiles = DownloadManager.instance.requestToDownloadFiles;
    public static requestToDownloadFile = DownloadManager.instance.requestToDownloadFile;
    public static getFileData = DownloadManager.instance.getFileData;


    // endregion API uncions

}
