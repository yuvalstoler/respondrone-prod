import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');

import { Report } from '../../../../../classes/dataClasses/report/report';

import {
    DBS_API,
    MWS_API,
    REPORT_API,
    RS_API
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    ID_OBJ,
    MAP,
    REPORT_DATA

} from '../../../../../classes/typings/all.typings';
import { UpdateListenersManager } from '../updateListeners/updateListenersManager';


export class ReportManager {


    private static instance: ReportManager = new ReportManager();


    reports: Report[] = [];

    private constructor() {
        this.initAllReports();
    }

    private initAllReports = () => {
        this.getReportsFromDBS()
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                //    todo send to listeners
                UpdateListenersManager.updateReportListeners();
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                setTimeout(() => {

                    this.initAllReports();
                }, 5000);
            });
        //    todo like AMS NFZ (or perimeter)

    }

    private getReportsFromDBS = (): Promise<ASYNC_RESPONSE<REPORT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(REPORT_API.readAllReport, {})
                .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                    if ( data.success ) {
                        this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getReportsFromRS', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                    //todo logger
                    console.log('error getReportsFromRS', JSON.stringify(data));
                    reject(data);
                });
        });
        //get StaticNfz From AMS

    };

    private getReportsDATA = (idObj: ID_OBJ): REPORT_DATA[] => {
        const res: REPORT_DATA[] = [];
        if ( idObj ) {
            const found = this.reports.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJsonForSave());
            }
        }
        else {
            this.reports.forEach((report: Report) => {
                res.push(report.toJsonForSave());
            });
        }
        return res;
    };

    private getReport = (idObj: ID_OBJ): Report => {
        let res: Report;
        if ( idObj ) {
            res = this.reports.find(element => element.id === idObj.id);
        }

        return res;
    };

    private createReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {



            const res: ASYNC_RESPONSE = {success: false};
            const newReport: Report = new Report(reportData);


            RequestManager.requestToDBS(REPORT_API.createReport, newReport.toJsonForSave())
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const report: Report = this.reports.find(element => element.id === data.data.id);
                        if (report) {
                            report.setValues(data.data);
                        } else {
                            this.reports.push(new Report(data.data));
                        }

                        UpdateListenersManager.updateReportListeners();
                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    console.log(data);
                    reject(data);
                });




        });
    }

    private createReportFromMGW = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {



            const res: ASYNC_RESPONSE = {success: false};
            const newReport: Report = new Report(reportData);


            RequestManager.requestToDBS(REPORT_API.createReport, newReport.toJsonForSave())
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const newReportCreated: Report = new Report(data.data);
                        this.reports.push(newReportCreated);
                        UpdateListenersManager.updateReportListeners();


                        //todo start get media process

                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    console.log(data);
                    reject(data);
                });



        });
    }

    private updateReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const report: Report = this.getReport({id: reportData.id});
            //todo save - send to DBS
            res.success = true;
            //    todo send to RS
            resolve(res);
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
            this.reports.forEach((report: Report) => {
                res.data.push(report.toJsonForSave());
            });
            resolve(res);
        });
    }
    private deleteReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToDBS(REPORT_API.deleteReport, reportIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success ) {
                        const index = this.reports.findIndex(element => element.id === data.data.id);
                        if (index !== -1) {
                            this.reports.splice(index, 1);
                        }
                        UpdateListenersManager.updateReportListeners();

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
            RequestManager.requestToDBS(REPORT_API.deleteAllReport, {})
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


    // region API uncions
    public static getReports = ReportManager.instance.getReportsDATA;
    public static getReport = ReportManager.instance.getReportsDATA;

    public static createReport = ReportManager.instance.createReport;
    public static createReportFromMGW = ReportManager.instance.createReportFromMGW;
    public static updateReport = ReportManager.instance.updateReport;

    public static readReport = ReportManager.instance.readReport;
    public static readAllReport = ReportManager.instance.readAllReport;
    public static deleteReport = ReportManager.instance.deleteReport;
    public static deleteAllReport = ReportManager.instance.deleteAllReport;


    // endregion API uncions

}
