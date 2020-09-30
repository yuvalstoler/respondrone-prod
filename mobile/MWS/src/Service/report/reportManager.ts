import { Report } from '../../../../../classes/dataClasses/report/report';

const _ = require('lodash');

import {
    AMS_API,
    RS_API
} from '../../../../../classes/dataClasses/api/api_enums';

import { RequestManager } from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    REPORT_DATA

} from '../../../../../classes/typings/all.typings';
import { SocketIO } from '../../websocket/socket.io';


export class ReportManager {


    private static instance: ReportManager = new ReportManager();

    private socketClient_Server: SocketIO;

    private setSocketIO_Server = (socketIO: SocketIO) => {
        this.socketClient_Server = socketIO;
    };


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
    public static setSocketIO_Server = ReportManager.instance.setSocketIO_Server;



    // endregion API uncions

}
