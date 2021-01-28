import {MissionRequestModel} from '../mongo/models/missionRequestModel';

const _ = require('lodash');

import {
    ASYNC_RESPONSE, COLLECTION_VERSIONS, CREDENTIALS,
    EVENT_DATA,
    FILE_DB_DATA, GRAPHIC_OVERLAY_DATA,
    ID_OBJ, MISSION_DATA, MISSION_REQUEST_DATA, MISSION_ROUTE_DATA, NFZ_DATA,
    REPORT_DATA,
    TASK_DATA, USER_DATA,
} from '../../../../../classes/typings/all.typings';
import { ReportModel } from '../mongo/models/reportModel';
import { TaskModel } from '../mongo/models/taskModel';
import { LogsModel } from '../mongo/models/LogsModel';
import { EventModel } from '../mongo/models/eventModel';

import { FileDataModel } from '../mongo/models/fileDataModel';
import {CollectionVersionModel} from '../mongo/models/collectionVersionModel';
import {MissionModel} from '../mongo/models/MissionModel';
import {MissionRouteModel} from '../mongo/models/MissionRouteModel';
import {GraphicOverlayModel} from '../mongo/models/GraphicOverlayModel';
import {NFZModel} from '../mongo/models/NFZModel';
import {UserModel} from '../mongo/models/userModel';


export class DbManager {

    private static instance: DbManager = new DbManager();

    Logs = new LogsModel().getSchema();
    reportModel = new ReportModel().getSchema();
    fileDataModel = new FileDataModel().getSchema();
    eventModel = new EventModel().getSchema();
    taskModel = new TaskModel().getSchema();
    missionRequestModel = new MissionRequestModel().getSchema();
    missionRouteModel = new MissionRouteModel().getSchema();
    missionModel = new MissionModel().getSchema();
    graphicOverlayModel = new GraphicOverlayModel().getSchema();
    nfzModel = new NFZModel().getSchema();
    collectionVersionModel = new CollectionVersionModel().getSchema();
    userModel = new UserModel().getSchema();

    private constructor() {

    }

    // ----------------------

    // region report ----------------------
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
    // endregion ----------------------

    // region event ----------------------
    private setEvent = (data: EVENT_DATA): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: EVENT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readEvent = (data: ID_OBJ): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel.find(data)
                .exec()
                .then((result: EVENT_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllEvent = (data = {}): Promise<ASYNC_RESPONSE<EVENT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.eventModel.find(data)
                .exec()
                .then((result: EVENT_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteEvent = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
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

    private deleteAllEvent = (data = {}): Promise<ASYNC_RESPONSE<EVENT_DATA>> => {
        return new Promise((resolve, reject) => {
            this.eventModel
                .deleteMany(data)
                .exec()
                .then((result: EVENT_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    // endregion ----------------------

    // region file ----------------------
    private createFileData = (data: FILE_DB_DATA): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: FILE_DB_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    private readFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel.find(data)
                .exec()
                .then((result: FILE_DB_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    private getAllFileData = (): Promise<ASYNC_RESPONSE<FILE_DB_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel.find({})
                .exec()
                .then((result: FILE_DB_DATA[]) => {
                    const obj = result;
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE<FILE_DB_DATA[]>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA[]>);
                });
        });
    };

    private updateFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: FILE_DB_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };

    private deleteFileData = (data: Partial<FILE_DB_DATA>): Promise<ASYNC_RESPONSE<FILE_DB_DATA>> => {
        return new Promise((resolve, reject) => {
            this.fileDataModel
                .findOneAndDelete(data)
                .exec()
                .then((result: ID_OBJ) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE<FILE_DB_DATA>);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE<FILE_DB_DATA>);
                });
        });
    };
    // endregion ----------------------

    // region task----------------------
    private createTask = (data: TASK_DATA): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            this.taskModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: TASK_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readTask = (data: ID_OBJ): Promise<ASYNC_RESPONSE<TASK_DATA>> => {
        return new Promise((resolve, reject) => {
            this.taskModel.find(data)
                .exec()
                .then((result: TASK_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllTask = (data = {}): Promise<ASYNC_RESPONSE<TASK_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.taskModel.find(data)
                .exec()
                .then((result: TASK_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteTask = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.taskModel
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

    private deleteAllTask = (data = {}): Promise<ASYNC_RESPONSE<TASK_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.taskModel
                .deleteMany(data)
                .exec()
                .then((result: TASK_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    //endregion -----------------------

    // region missionRequest----------------------
    private createMissionRequest = (data: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionRequestModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: MISSION_REQUEST_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readMissionRequest = (data: ID_OBJ): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionRequestModel.find(data)
                .exec()
                .then((result: MISSION_REQUEST_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllMissionRequest = (data = {}): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionRequestModel.find(data)
                .exec()
                .then((result: MISSION_REQUEST_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteMissionRequest = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.missionRequestModel
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

    private deleteAllMissionRequest = (data = {}): Promise<ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionRequestModel
                .deleteMany(data)
                .exec()
                .then((result: MISSION_REQUEST_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    //endregion -----------------------

    // region missionRoute----------------------

    private createMissionRoute = (data: MISSION_ROUTE_DATA): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionRouteModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: MISSION_ROUTE_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readMissionRoute = (data: ID_OBJ): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionRouteModel.find(data)
                .exec()
                .then((result: MISSION_ROUTE_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllMissionRoute = (data = {}): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionRouteModel.find(data)
                .exec()
                .then((result: MISSION_ROUTE_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteMissionRoute = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.missionRouteModel
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

    private deleteAllMissionRoute = (data = {}): Promise<ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionRouteModel
                .deleteMany(data)
                .exec()
                .then((result: MISSION_ROUTE_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    //endregion -----------------------

    // region mission----------------------

    private createMission = (data: MISSION_DATA): Promise<ASYNC_RESPONSE<MISSION_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: MISSION_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readMission = (data: ID_OBJ): Promise<ASYNC_RESPONSE<MISSION_DATA>> => {
        return new Promise((resolve, reject) => {
            this.missionModel.find(data)
                .exec()
                .then((result: MISSION_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllMission = (data = {}): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionModel.find(data)
                .exec()
                .then((result: MISSION_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteMission = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.missionModel
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

    private deleteAllMission = (data = {}): Promise<ASYNC_RESPONSE<MISSION_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.missionModel
                .deleteMany(data)
                .exec()
                .then((result: MISSION_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    //endregion -----------------------

    // region graphicOverlay----------------------

    private createGraphicOverlay = (data: GRAPHIC_OVERLAY_DATA): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>> => {
        return new Promise((resolve, reject) => {
            this.graphicOverlayModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: GRAPHIC_OVERLAY_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readGraphicOverlay = (data: ID_OBJ): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>> => {
        return new Promise((resolve, reject) => {
            this.graphicOverlayModel.find(data)
                .exec()
                .then((result: GRAPHIC_OVERLAY_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllGraphicOverlay = (data = {}): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.graphicOverlayModel.find(data)
                .exec()
                .then((result: GRAPHIC_OVERLAY_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteGraphicOverlay = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.graphicOverlayModel
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

    private deleteAllGraphicOverlay = (data = {}): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.graphicOverlayModel
                .deleteMany(data)
                .exec()
                .then((result: GRAPHIC_OVERLAY_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    //endregion -----------------------

    // region nfz----------------------

    private createNFZ = (data: NFZ_DATA): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: NFZ_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readNFZ = (data: ID_OBJ): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzModel.find(data)
                .exec()
                .then((result: NFZ_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllNFZ = (data = {}): Promise<ASYNC_RESPONSE<NFZ_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.nfzModel.find(data)
                .exec()
                .then((result: NFZ_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteNFZ = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.nfzModel
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

    private deleteAllNFZ = (data = {}): Promise<ASYNC_RESPONSE<NFZ_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.nfzModel
                .deleteMany(data)
                .exec()
                .then((result: NFZ_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    //endregion -----------------------

    // region user----------------------

    private createUser = (data: USER_DATA): Promise<ASYNC_RESPONSE<USER_DATA>> => {
        return new Promise((resolve, reject) => {
            this.userModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then((result: USER_DATA) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readUser = (data: CREDENTIALS | ID_OBJ): Promise<ASYNC_RESPONSE<USER_DATA>> => {
        return new Promise((resolve, reject) => {
            this.userModel.find(data)
                .exec()
                .then((result: USER_DATA) => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj || null} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllUser = (data = {}): Promise<ASYNC_RESPONSE<USER_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.userModel.find(data)
                .exec()
                .then((result: USER_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteUser = (data: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            this.userModel
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

    private deleteAllUser = (data = {}): Promise<ASYNC_RESPONSE<USER_DATA[]>> => {
        return new Promise((resolve, reject) => {
            this.userModel
                .deleteMany(data)
                .exec()
                .then((result: USER_DATA[]) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    //endregion -----------------------

    private saveRepCollectionVersions = (data: MISSION_REQUEST_DATA): Promise<ASYNC_RESPONSE<COLLECTION_VERSIONS>> => {
        return new Promise((resolve, reject) => {
            this.collectionVersionModel
                .findOneAndUpdate({}, data, {new: true, upsert: true})
                .exec()
                .then((result: COLLECTION_VERSIONS) => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private getRepCollectionVersions = (data: ID_OBJ): Promise<ASYNC_RESPONSE<COLLECTION_VERSIONS>> => {
        return new Promise((resolve, reject) => {
            this.collectionVersionModel.find(data)
                .exec()
                .then((result: COLLECTION_VERSIONS[]) => {
                    const obj = result[0];
                    resolve({success: true, data: obj === undefined ? null : obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };


    // region API uncions

    public static setReport = DbManager.instance.setReport;
    public static readReport = DbManager.instance.readReport;
    public static readAllReport = DbManager.instance.readAllReport;
    public static deleteReport = DbManager.instance.deleteReport;
    public static deleteAllReport = DbManager.instance.deleteAllReport;

    public static setEvent = DbManager.instance.setEvent;
    public static readEvent = DbManager.instance.readEvent;
    public static readAllEvent = DbManager.instance.readAllEvent;
    public static deleteEvent = DbManager.instance.deleteEvent;
    public static deleteAllEvent = DbManager.instance.deleteAllEvent;


    public static createFileData = DbManager.instance.createFileData;
    public static readFileData = DbManager.instance.readFileData;
    public static updateFileData = DbManager.instance.updateFileData;
    public static deleteFileData = DbManager.instance.deleteFileData;
    public static getAllFileData = DbManager.instance.getAllFileData;

    public static createTask = DbManager.instance.createTask;
    public static readTask = DbManager.instance.readTask;
    public static readAllTask = DbManager.instance.readAllTask;
    public static deleteTask = DbManager.instance.deleteTask;
    public static deleteAllTask = DbManager.instance.deleteAllTask;

    public static createMissionRequest = DbManager.instance.createMissionRequest;
    public static readMissionRequest = DbManager.instance.readMissionRequest;
    public static readAllMissionRequest = DbManager.instance.readAllMissionRequest;
    public static deleteMissionRequest = DbManager.instance.deleteMissionRequest;
    public static deleteAllMissionRequest = DbManager.instance.deleteAllMissionRequest;

    public static createMissionRoute = DbManager.instance.createMissionRoute;
    public static readMissionRoute = DbManager.instance.readMissionRoute;
    public static readAllMissionRoute = DbManager.instance.readAllMissionRoute;
    public static deleteMissionRoute = DbManager.instance.deleteMissionRoute;
    public static deleteAllMissionRoute = DbManager.instance.deleteAllMissionRoute;

    public static createMission = DbManager.instance.createMission;
    public static readMission = DbManager.instance.readMission;
    public static readAllMission = DbManager.instance.readAllMission;
    public static deleteMission = DbManager.instance.deleteMission;
    public static deleteAllMission = DbManager.instance.deleteAllMission;

    public static createGraphicOverlay = DbManager.instance.createGraphicOverlay;
    public static readGraphicOverlay = DbManager.instance.readGraphicOverlay;
    public static readAllGraphicOverlay = DbManager.instance.readAllGraphicOverlay;
    public static deleteGraphicOverlay = DbManager.instance.deleteGraphicOverlay;
    public static deleteAllGraphicOverlay = DbManager.instance.deleteAllGraphicOverlay;

    public static createNFZ = DbManager.instance.createNFZ;
    public static readNFZ = DbManager.instance.readNFZ;
    public static readAllNFZ = DbManager.instance.readAllNFZ;
    public static deleteNFZ = DbManager.instance.deleteNFZ;
    public static deleteAllNFZ = DbManager.instance.deleteAllNFZ;

    public static saveRepCollectionVersions = DbManager.instance.saveRepCollectionVersions;
    public static getRepCollectionVersions = DbManager.instance.getRepCollectionVersions;

    public static createUser = DbManager.instance.createUser;
    public static readUser = DbManager.instance.readUser;
    public static readAllUser = DbManager.instance.readAllUser;
    public static deleteUser = DbManager.instance.deleteUser;
    public static deleteAllUser = DbManager.instance.deleteAllUser;


    // endregion API uncions

}
