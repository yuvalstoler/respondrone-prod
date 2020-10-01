import {
    ASYNC_RESPONSE,
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
import {EventClass} from "../../../../../classes/dataClasses/event/event";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    perimeterModel;
    reportModel;
    Logs;
    nfzStaticModel;
    routeModel;
    taskModel;
    eventModel;


    private constructor() {
        this.perimeterModel = new PerimeterModel().getSchema();
        this.Logs = new LogsModel().getSchema();
        this.reportModel = new ReportModel().getSchema();
        this.nfzStaticModel = new NFZStaticModel().getSchema();
        this.routeModel = new RouteModel().getSchema();
        this.taskModel = new TaskModel().getSchema();
        this.eventModel = new EventModel().getSchema();
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
    private  readAllEvents = (): Promise<ASYNC_RESPONSE<EventClass[]>> => {
        return new Promise(((resolve, reject) => {
            this.eventModel.find()
                .exec()
                .then(result => {
                    // all event in result
                }).catch(error => {
                // error getting events
            })
        }))
    }

    // region API uncions

    public static setReport = DbManager.instance.setReport;
    public static readReport = DbManager.instance.readReport;
    public static readAllReport = DbManager.instance.readAllReport;
    public static deleteReport = DbManager.instance.deleteReport;
    public static deleteAllReport = DbManager.instance.deleteAllReport;


    public static readAllEvents = DbManager.instance.readAllEvents;


    // endregion API uncions

}
