import {
    ASYNC_RESPONSE,
    EVENT_DATA,
    FILE_DB_DATA,
    ID_OBJ,
    REPORT_DATA,
} from '../../../../../classes/typings/all.typings';
import { PerimeterModel } from '../mongo/models/perimeterModel';
import { ReportModel } from '../mongo/models/reportModel';
import { NFZStaticModel } from '../mongo/models/nfzStaticModel';
import { RouteModel } from '../mongo/models/routeModel';
import { TaskModel } from '../mongo/models/taskModel';
import { LogsModel } from "../mongo/models/LogsModel";
import {EventModel} from "../mongo/models/eventModel";
import { FileDataModel } from "../mongo/models/fileDataModel";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    Logs = new LogsModel().getSchema();
    reportModel = new ReportModel().getSchema();
    fileDataModel = new FileDataModel().getSchema();
    eventModel = new EventModel().getSchema();

    private constructor() {

    }

    // ----------------------

    // ----------------------
    private setReport = (data: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.reportModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: REPORT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readReport = (data: ID_OBJ): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.reportModel.find(data)
                .exec()
                .then((result: REPORT_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllReport = (data = {}): Promise<ASYNC_RESPONSE<REPORT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.reportModel.find(data)
                .exec()
                .then((result: REPORT_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteReport = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.reportModel
                .findOneAndDelete(data)
                .exec()
                .then((result: ID_OBJ) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteAllReport = (data = {}): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.reportModel
                .deleteMany(data)
                .exec()
                .then((result: REPORT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    // ----------------------
    private setEvent = (data: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: EVENT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readEvent = (data: ID_OBJ): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel.find(data)
                .exec()
                .then((result: EVENT_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllEvent = (data = {}): Promise<ASYNC_RESPONSE<EVENT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.eventModel.find(data)
                .exec()
                .then((result: EVENT_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteEvent = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
                .findOneAndDelete(data)
                .exec()
                .then((result: ID_OBJ) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteAllEvent = (data = {}): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
                .deleteMany(data)
                .exec()
                .then((result: EVENT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    //---------------------------------
    private createFileData = (data: FILE_DB_DATA): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: FILE_DB_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    private readFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel.find(data)
                .exec()
                .then((result: FILE_DB_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    private updateFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: FILE_DB_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    private deleteFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndDelete(data)
                .exec()
                .then((result: ID_OBJ) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    //---------------------------------


    // region API uncions

    public static setReport = DbManager.instance.setReport;
    public static readReport = DbManager.instance.readReport;
    public static readAllReport = DbManager.instance.readAllReport;
    public static deleteReport = DbManager.instance.deleteReport;
    public static deleteAllReport = DbManager.instance.deleteAllReport;

    public static setEvent = DbManager.instance.setEvent;
    public static readEvent = DbManager.instance.readEvent;
    public static readAllEvent = DbManager.instance.readAllEvent;
    public static deleteEvent = DbManager.instance.deleteEvent;
    public static deleteAllEvent = DbManager.instance.deleteAllEvent;

    public static createFileData = DbManager.instance.createFileData;
    public static readFileData = DbManager.instance.readFileData;
    public static updateFileData = DbManager.instance.updateFileData;
    public static deleteFileData = DbManager.instance.deleteFileData;


    // endregion API uncions

}
