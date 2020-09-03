import {EntityModel} from '../mongo/models/entityModel';
import {ENTITY_DATA, ID_TYPE} from '../../classes/all.typings';
import {LogModel} from "../mongo/models/logModel";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    entityModel: any;
    logModel: any;

    collectionVersion: number;


    private constructor() {
        this.entityModel = new EntityModel().getSchema();
        this.logModel = new LogModel().getSchema();
    }

    // ============ Entity ==============
    private insert = (data: ENTITY_DATA): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.entityModel(data)
                .save()
                .then(result => {
                    if (result) {
                        const obj = result.toObject();
                        resolve(obj);
                    } else {
                        reject(result);
                    }
                } )
                .catch(error => {
                    console.log(error);
                    reject(error);
                } );
        });
    };
    // ----------------------
    private update = (id: ID_TYPE, data: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.entityModel
                .findOneAndUpdate({id: id}, data, {new: true})
                .exec()
                .then(result => {
                    if (result) {
                        const obj = result.toObject();
                        resolve(obj);
                    } else {
                        reject(result);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                } );
        });
    };
    // ----------------------
    private requests = (data: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.entityModel
                .find(data)
                .exec()
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    };


    // ========= Collection version =======
    private initCollectionVersion = (): void => {
        this.entityModel
            .findOne()
            .sort({collectionVersion : -1})
            .limit(1)
            .exec()
            .then((result) => {
                if (result) {
                    const obj = result.toObject();
                    this.updateCollectionVersion(obj.collectionVersion);
                }
                else {
                    this.updateCollectionVersion(0);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    // ----------------------
    private updateCollectionVersion = (newVersion: number) => {
        if (Number.isFinite(newVersion)) {
            this.collectionVersion = newVersion;
            console.log('collectionVersion:', this.collectionVersion);
        }
    };
    // ----------------------
    private getCollectionVersion = (): number => {
        return this.collectionVersion;
    };
    // ----------------------
    private createCollectionVersion = (): number => {
        return Date.now();
    };


    // =============== Logs ==================
    private saveLog = (data: any): void => {
        this.logModel(data)
            .save()
            .then(result => {
            })
            .catch(error => {
                console.log(error);
            } );
    };


    // region API uncions

    public static insert = DbManager.instance.insert;
    public static requests = DbManager.instance.requests;
    public static update = DbManager.instance.update;
    public static initCollectionVersion = DbManager.instance.initCollectionVersion;
    public static getCollectionVersion = DbManager.instance.getCollectionVersion;
    public static updateCollectionVersion = DbManager.instance.updateCollectionVersion;
    public static createCollectionVersion = DbManager.instance.createCollectionVersion;
    public static saveLog = DbManager.instance.saveLog;


    // endregion API uncions

}
