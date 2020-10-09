import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');

import { Report } from '../../../../../classes/dataClasses/report/report';

import {
    REPORT_API,
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ, ID_TYPE, LINKED_REPORT_DATA,
    REPORT_DATA, REPORT_DATA_UI

} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {EventManager} from '../event/eventManager';
import {ReportMdLogic} from '../../../../../classes/modeDefineTSSchemas/reports/reportMdLogic';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';


export class ReportManager {


    private static instance: ReportManager = new ReportManager();


    reports: Report[] = [];

    private constructor() {
        this.getReportsFromRS();

    }

    private getReportsFromRS = () => {
        //get StaticNfz From AMS
        RequestManager.requestToRS(REPORT_API.readAllReport, {})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                if ( data.success ) {
                    this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(data.data);
                }
                else {
                    //todo logger
                    console.log('error getReportsFromRS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                //todo logger
                console.log('error getReportsFromRS', JSON.stringify(data));
            });
    };
    private getReports = (): REPORT_DATA[] => {
        const res: REPORT_DATA[] = [];
        this.reports.forEach((report: Report) => {
            res.push(report.toJsonForSave());
        });
        return res;
    }
    private getLinkedReports = (ids: ID_TYPE[]): LINKED_REPORT_DATA[] => {
        const res: LINKED_REPORT_DATA[] = [];
        this.reports.forEach((report: Report) => {
            if (ids.indexOf(report.id) !== -1) {
                const data = report.toJsonLinked();
                res.push(data);
            }
        });
        return res;
    }

    private updateAllReports = (reportData: REPORT_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(reportData);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }
    private createReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            reportData.id = DataUtility.generateID();
            reportData.time = Date.now();
            const newReport: Report = new Report(reportData);

            const newReportDataJson: REPORT_DATA = newReport.toJsonForSave();
            res.data = newReportDataJson;
            res.success = true;
            //    todo send to RS
            RequestManager.requestToRS(REPORT_API.createReport, newReportDataJson)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                });

            // resolve(res);

        });
    }

    private readReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const findedReport: Report = this.reports.find((report: Report) => {
                return report.id === reportIdData.id;
            });
            if ( findedReport ) {
                res.success = true;
                res.data = findedReport;
            }
            resolve(res);
        });
    }
    private readAllReport = (requestData): Promise<ASYNC_RESPONSE<REPORT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            // this.reports.forEach((report: Report) => {
            //     res.data.push(report.toJsonForSave());
            // });
            res.data = this.getDataForUI();
            resolve(res);
        });
    }
    private deleteReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToRS(REPORT_API.deleteReport, reportIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }
    private deleteAllReport = (): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToRS(REPORT_API.deleteAllReport, {})
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;

                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }


    private getDataForUI = (): REPORT_DATA_UI[] => {
        const res: REPORT_DATA_UI[] = [];
        this.reports.forEach((report: Report) => {
            const reportDataUI: REPORT_DATA_UI = report.toJsonForUI();
            reportDataUI.events = EventManager.getLinkedEvents(report.eventIds);
            reportDataUI.modeDefine = ReportMdLogic.validate(reportDataUI);

            res.push(reportDataUI);
        });
        return res;
    };

    private sendDataToUI = (): void => {
        const jsonForSend: REPORT_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_reportsData', jsonForSend);
    };

    // region API uncions

    public static getReports = ReportManager.instance.getReports;

    public static updateAllReports = ReportManager.instance.updateAllReports;
    public static createReport = ReportManager.instance.createReport;
    public static readReport = ReportManager.instance.readReport;
    public static readAllReport = ReportManager.instance.readAllReport;
    public static deleteReport = ReportManager.instance.deleteReport;
    public static deleteAllReport = ReportManager.instance.deleteAllReport;

    public static getLinkedReports = ReportManager.instance.getLinkedReports;


    // endregion API uncions

}
