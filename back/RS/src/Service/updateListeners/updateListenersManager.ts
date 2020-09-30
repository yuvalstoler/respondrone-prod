import { ReportManager } from '../report/reportManager';
import {
    ASYNC_RESPONSE,
    REPORT_DATA
} from '../../../../../classes/typings/all.typings';
import { RequestManager } from '../../AppService/restConnections/requestManager';
import { MWS_API } from '../../../../../classes/dataClasses/api/api_enums';

const _ = require('lodash');


const services = require('./../../../../../../../../config/services.json');

const listeners: string[] = services.RS.listeners;
const updateRouteListenersURL = MWS_API.general + MWS_API.updateAllReports;

export class UpdateListenersManager {


    private static instance: UpdateListenersManager = new UpdateListenersManager();

    private constructor() {
    }

    private updateReportListeners = (): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const allReportsDta: REPORT_DATA[] = ReportManager.getReports();
            const promisesArr: Promise<ASYNC_RESPONSE>[] = [];
            listeners.forEach((listener: string) => {
                console.log(Date.now(), 'start updateReportListeners: ', listener);
                const requestPromise = RequestManager.requestToExternalService(listener, updateRouteListenersURL, allReportsDta);
                promisesArr.push(requestPromise);
            });

            const res: ASYNC_RESPONSE = {success: false};
            Promise.all(promisesArr)
                .then((result: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *then* updateReportListeners');
                    res.success = true;
                    resolve(res);
                })
                .catch((error: ASYNC_RESPONSE[]) => {
                    console.log(Date.now(), 'finish *catch* updateReportListeners');
                    resolve(res);
                });
        });

    }


    // region API functions

    // public static updateListeners = UpdateListenersManager.instance.updateListeners;
    public static updateReportListeners = UpdateListenersManager.instance.updateReportListeners;


    // endregion API functions

}
