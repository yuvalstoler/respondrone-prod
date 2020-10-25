import { RequestManager } from '../../AppService/restConnections/requestManager';

const _ = require('lodash');


import {
    ASYNC_RESPONSE,
    FILE_DB_DATA,
    FILE_GW_DATA,
    ID_OBJ,
    REPORT_DATA, TASK_DATA,
    UPDATE_FILE_STATUS,

} from '../../../../../classes/typings/all.typings';
import {
    MG_API,

} from '../../../../../classes/dataClasses/api/api_enums';


export class InternalApiManager {


    private static instance: InternalApiManager = new InternalApiManager();

    private fileById = (fileId: ID_OBJ): Promise<ASYNC_RESPONSE<FILE_GW_DATA>> => {

        return RequestManager.requestToMG(MG_API.getFileById, fileId);

    }
    private updateFileStatus = (fileStatus: UPDATE_FILE_STATUS): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return RequestManager.requestToMG(MG_API.updateFileStatus, fileStatus);
    }

    private createTask = (task: TASK_DATA): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return RequestManager.requestToMG(MG_API.createTask_in_OSCC, task);
    }

    private constructor() {

    }


    // region API uncions


    public static fileById = InternalApiManager.instance.fileById;
    public static updateFileStatus = InternalApiManager.instance.updateFileStatus;
    public static createTask = InternalApiManager.instance.createTask;

    // endregion API uncions

}
