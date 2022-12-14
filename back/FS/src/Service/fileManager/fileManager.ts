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
    FILE_FS_DATA,
    MEDIA_TYPE
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';


const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;
const uploadsPath = path.join(__dirname, '../../../../../../uploads');
if ( !fs.existsSync(uploadsPath) ) {
    fs.mkdirSync(uploadsPath);
}

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

const filePath2 = require('path').join(__dirname, './../../../../../../../../logo2.png');

export class FileManager {


    private static instance: FileManager = new FileManager();

    private constructor() {

    }


    // ----------------------
    // private uploadFile = (request, response: Response) => {
    //     const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};
    //
    //     upload(request, response, (err) => {
    //         if ( request.files === undefined || request.files.length === 0 ) {
    //             res.description = 'No file selected';
    //             response.status(400).send(res);
    //         }
    //         else if ( err ) {
    //             res.description = `Could not upload file. ${err}`;
    //             response.status(500).send(res);
    //         }
    //         else {
    //             const id = request.files[0].filename;
    //             res.success = true;
    //
    //             if ( request.files[0].mimetype.indexOf('image') !== -1 ) {
    //                 res.data = {
    //                     id: id,
    //                     type: MEDIA_TYPE.image,
    //                     url: `${url_FS}/api/file/${id}`,
    //                     thumbnail: `${url_FS}/api/file/${id}`,
    //                 };
    //                 response.status(200).send(res);
    //             }
    //             else if ( request.files[0].mimetype.indexOf('video') !== -1 ) {
    //                 const thumbnailName = `${id}.png`;
    //                 this.saveThumbnail(id, thumbnailName)
    //                     .finally(() => {
    //                         res.data = {
    //                             id: id,
    //                             type: MEDIA_TYPE.video,
    //                             url: `${url_VideoStreamService}/${id}`,
    //                             thumbnail: `${url_FS}/api/file/${thumbnailName}`,
    //                         };
    //                         response.status(200).send(res);
    //                     });
    //             }
    //         }
    //     });
    // }

    private uploadFileTest = (request, response: Response) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};

        upload(request, response, (err) => {
            if ( request.files === undefined || request.files.length === 0 ) {
                res.description = 'No file selected';
                response.status(400).send(res);
            }
            else if ( err ) {
                res.description = `Could not upload file. ${err}`;
                response.status(500).send(res);
            }
            else {
                const id = request.files[0].filename;
                res.success = true;

                if ( request.files[0].mimetype.indexOf('image') !== -1 ) {
                    res.data = {
                        id: id,
                        type: MEDIA_TYPE.image,
                        url: `/api/file/${id}`,
                        thumbnail: `/api/file/${id}`,

                        fullUrl: `${url_FS}/api/file/${id}`,
                        fullThumbnail: `${url_FS}/api/file/${id}`
                    };
                    response.status(200).send(res);
                }
                else if ( request.files[0].mimetype.indexOf('video') !== -1 ) {
                    const thumbnailName = `${id}.png`;
                    this.saveThumbnail(id, thumbnailName)
                        .finally(() => {
                            res.data = {
                                id: id,
                                type: MEDIA_TYPE.video,
                                url: `/api/file/${id}`,
                                thumbnail: `/api/file/${thumbnailName}`,

                                fullUrl: `${url_VideoStreamService}/api/file/${id}`,
                                fullThumbnail: `${url_FS}/api/file/${thumbnailName}`,
                            };
                            response.status(200).send(res);
                        });
                }
                else {
                    res.description = 'incorrect mimetype ' + request.files[0].mimetype;
                    response.status(200).send(res);
                }
            }
        });
    }

    private uploadFileFromServer = (request, response: Response) => {
        const res: ASYNC_RESPONSE<FILE_FS_DATA> = {success: false};
        request.pipe(fs.createWriteStream(filePath2));
        response.send({success: true});

    }
    private getFileFromTest = (request, response: Response) => {
        const requestBody = request.body;
        const stream = fs.createReadStream(requestBody.filePath);
        response.send(stream);
    }
    // ---------------------
    private saveThumbnail = (id: string, thumbnailName: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ffmpeg(`${uploadsPath}/${id}`)
                    .screenshots({
                        count: 1,
                        folder: uploadsPath,
                        filename: thumbnailName
                    })
                    .on('end', () => {
                        console.log('screenshot end', id);
                        resolve({});
                    })
                    .on('error', (err1) => {
                        console.log('screenshot fail', id, err1);
                        resolve({});
                    });
            }, 1000);
        });
    }
    // ----------------------
    private removeFile = (mediaData: FILE_FS_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            fs.unlink(path.join(uploadsPath, `${mediaData.id}`), (err) => {
                if ( err ) {
                    res.data = `Could not delete file. ${err}`;
                }
                else {
                    res.success = true;
                }

                if ( mediaData.type === MEDIA_TYPE.video ) {
                    const thumbnailName = `${mediaData.id}.png`;
                    fs.unlink(path.join(uploadsPath, thumbnailName), (err1) => {
                        if ( err1 ) {
                            console.log('error deleting thumbnail', mediaData.id);
                        }
                    });
                }
                resolve(res);
            });
        });
    }
    // ----------------------
    private getFile = (request: Request, response: Response) => {
        fs.readFile(path.join(uploadsPath, `${request.params.id}`), (err, data) => {
            if ( err ) {
                fs.readFile(path.join(uploadsPath, `One_black_Pixel.png`), (err1, data1) => {
                    if ( err1 ) {
                        response.status(503).send({success: false, data: 'internal server error'});
                    }
                    else {
                        response.writeHead(200, {'Content-Type': 'image/jpg'});
                        response.write(data1);
                        response.end();
                    }
                });
            }
            else {
                response.writeHead(200, {'Content-Type': 'image/jpg'});
                response.write(data);
                response.end();
            }
        });
    }
    // ----------------------
    private getFileForSave = (request: Request, response: Response) => {
        const id = request.body.id;
        if ( id ) {
            const formData = {
                files: fs.createReadStream(path.join(uploadsPath, `${id}`))
            };
            RequestManager.uploadFileToCCG(formData);
            response.send({success: true});

            // const form = new FormData();
            // form.append('files', fs.createReadStream(path.join(uploadsPath, `${id}`)));
            // response.setHeader('x-Content-Type', 'multipart/form-data; boundary=' + form._boundary);
            // response.setHeader('Content-Type', 'text/plain');
            // form.pipe(response);

        }
        else {
            response.send({success: false, data: 'Missing id'});
        }
    }
    // ---------------------------

    // region API uncions
    // public static uploadFile = FileManager.instance.uploadFile;
    public static uploadFileTEST = FileManager.instance.uploadFileFromServer;
    public static removeFile = FileManager.instance.removeFile;
    public static getFile = FileManager.instance.getFile;
    public static getFileForSave = FileManager.instance.getFileForSave;
    public static getFileFromTest = FileManager.instance.getFileFromTest;
    public static uploadFileTest = FileManager.instance.uploadFileTest;



    // endregion API uncions

}
