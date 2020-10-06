import {Request, Response} from 'express';
import {ASYNC_RESPONSE, MEDIA_DATA, MEDIA_TYPE} from '../../../../../classes/typings/all.typings';

const path = require('path');
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const services = require('./../../../../../../../../config/services.json');


const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;
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



export class FileManager {


    private static instance: FileManager = new FileManager();

    private constructor() {

    }



    // ----------------------
    private upload = (request, response: Response) => {
        const res: ASYNC_RESPONSE<MEDIA_DATA> = {success: false};

        upload(request, response, (err) => {
            if (request.files === undefined || request.files.length === 0) {
                res.description = 'No file selected';
                response.status(400).send(res);
            } else if (err) {
                res.description = `Could not upload file. ${err}`;
                response.status(500).send(res);
            } else {
                const id = request.files[0].filename;
                res.success = true;

                if (request.files[0].mimetype.indexOf('image') !== -1) {
                    res.data = {
                        id: id,
                        type:  MEDIA_TYPE.image,
                        url: `${url_FS}/api/file/${id}`,
                        thumbnail: `${url_FS}/api/file/${id}`,
                    };
                    response.status(200).send(res);
                } else if (request.files[0].mimetype.indexOf('video') !== -1) {
                    const thumbnailName = `${id}.png`;
                    this.saveThumbnail(id, thumbnailName)
                        .finally(() => {
                            res.data = {
                                id: id,
                                type:  MEDIA_TYPE.video,
                                url: `${url_VideoStreamService}/${id}`,
                                thumbnail: `${url_FS}/api/file/${thumbnailName}`,
                            };
                            response.status(200).send(res);
                        });
                }
            }
        });
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
    private remove = (mediaData: MEDIA_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            fs.unlink(path.join(uploadsPath, `${mediaData.id}`), (err) => {
                if (err) {
                    res.data = `Could not delete file. ${err}`;
                } else {
                    res.success = true;
                }

                if (mediaData.type === MEDIA_TYPE.video) {
                    const thumbnailName = `${mediaData.id}.png`;
                    fs.unlink(path.join(uploadsPath, thumbnailName), (err1) => {
                        if (err1) {
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

    // region API uncions
    public static upload = FileManager.instance.upload;
    public static remove = FileManager.instance.remove;
    public static getFile = FileManager.instance.getFile;
    // endregion API uncions

}
