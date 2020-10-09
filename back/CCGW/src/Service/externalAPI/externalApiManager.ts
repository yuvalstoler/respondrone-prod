import { RequestManager } from "../../AppService/restConnections/requestManager";

const _ = require('lodash');

import {
    ASYNC_RESPONSE,
    REPORT_DATA,

} from '../../../../../classes/typings/all.typings';
import { RS_API } from "../../../../../classes/dataClasses/api/api_enums";


export class ExternalApiManager {


    private static instance: ExternalApiManager = new ExternalApiManager();


    private constructor() {

    }

    private createReportFromMGW = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            // const res: ASYNC_RESPONSE = {success: false};
            //    todo send to RS
            RequestManager.requestToRS(RS_API.createReportFromMGW, reportData)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    resolve(data);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    reject(data);
                });

            // resolve(res);

        });
    }



    // region API uncions

    public static createReportFromMGW = ExternalApiManager.instance.createReportFromMGW;


    // endregion API uncions

}
