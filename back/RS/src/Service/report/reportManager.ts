import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');

import { Report } from '../../../../../classes/dataClasses/report/report';

import {
    DBS_API,
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
        // this.initAllReports();
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
            RequestManager.requestToDBS(DBS_API.readAllReport, {})
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
            //todo save - send to DBS
            RequestManager.requestToDBS(DBS_API.setReport, newReport.toJsonForSave())
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    if ( data.success ) {
                        res.data = data.data;
                        res.success = true;
                        const newReportCreated: Report = new Report(data.data);
                        this.reports.push(newReportCreated);
                    }

                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {

                });

            res.data = newReport.toJsonForSave();
            res.success = true;
            //    todo send to RS

            resolve(res);

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
    // region API uncions
    public static getReports = ReportManager.instance.getReportsDATA;
    public static getReport = ReportManager.instance.getReportsDATA;

    public static createReport = ReportManager.instance.createReport;
    public static updateReport = ReportManager.instance.updateReport;


    // endregion API uncions

}
