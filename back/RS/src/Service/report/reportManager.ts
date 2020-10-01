import { Converting } from '../../../../../classes/applicationClasses/utility/converting';

const _ = require('lodash');

import { Report } from '../../../../../classes/dataClasses/report/report';

import {
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


    reports: MAP<Report> = {};

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
            RequestManager.requestToDBS(RS_API.getAllReports, {})
                .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                    if ( data.success ) {
                        // this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(data.data);
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

    private getReports = (idObj: ID_OBJ): REPORT_DATA[] => {
        const res: REPORT_DATA[] = [];
        if ( idObj ) {
            if ( this.reports[idObj.id] ) {

            }
        }
        else {
            // for ( let reportsId in this.reports ) {
            //     if(this.reports.)
            // }
            // ach((report: Report) => {
            //     res.push(report.toJsonForSave());
            // });
        }
        return res;
    };

    private createReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const newReport: Report = new Report(reportData);
            //todo save - send to DBS
            res.data = newReport.toJsonForSave();
            res.success = true;
            //    todo send to RS

            resolve(res);

        });
    }

    private updateReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const newReport: Report = new Report(reportData);
            //todo save - send to DBS
            res.data = newReport.toJsonForSave();
            res.success = true;
            //    todo send to RS

            resolve(res);

        });
    }
    // region API uncions
    public static getReports = ReportManager.instance.getReports;
    public static getReport = ReportManager.instance.getReports;

    public static createReport = ReportManager.instance.createReport;
    public static updateReport = ReportManager.instance.updateReport;


    // endregion API uncions

}
