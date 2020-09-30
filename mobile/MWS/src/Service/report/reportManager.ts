const _ = require('lodash');

import { Report } from '../../../../../classes/dataClasses/report/report';

import {
    RS_API
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    REPORT_DATA

} from '../../../../../classes/typings/all.typings';


export class ReportManager {


    private static instance: ReportManager = new ReportManager();


    reports: Report[] = [];

    private constructor() {
        this.getReportsFromRS();

    }

    private getReportsFromRS = () => {
        //get StaticNfz From AMS
        RequestManager.requestToRS(RS_API.getAllReports, {})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                if ( data.success ) {
                    this.reports = this.Arr_REPORT_DATA_to_Arr_Report(data.data);
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
    private newReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            const newReport: Report = new Report(reportData);
            res.data = newReport.toJsonForSave();
            res.success = true;
            //    todo send to RS

            resolve(res);

        });
    }

    private Arr_REPORT_DATA_to_Arr_Report = (reportDataArr: REPORT_DATA[]): Report[] => {
        const res: Report[] = [];
        //    todo data vaidation
        if ( Array.isArray(reportDataArr) ) {
            reportDataArr.forEach((reportData: REPORT_DATA) => {
                res.push(new Report(reportData));
            });
        }
        return res;
    }

    // region API uncions
    public static getReports = ReportManager.instance.getReports;
    public static newReport = ReportManager.instance.newReport;


    // endregion API uncions

}
