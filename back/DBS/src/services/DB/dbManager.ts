import {
    ASYNC_RESPONSE,
    ID_OBJ,
    ID_TYPE,
    LOG_DATA, LOG_DATA_BY_ID,
    NFZ_DATA,
    PERIMETER_TO_SAVE,
    ROUTE_DATA,
    SITE_ID_OBJ,
    TASK,
    WASP_TASK
} from '../../../../../classes/typings/all.typings';
import { PerimeterModel } from '../mongo/models/perimeterModel';
import { NFZDynamicModel } from '../mongo/models/nfzDynamicModel';
import { NFZStaticModel } from '../mongo/models/nfzStaticModel';
import { RouteModel } from '../mongo/models/routeModel';
import { TaskModel } from '../mongo/models/taskModel';
import { LogsModel } from "../mongo/models/LogsModel";
import {EventModel} from "../mongo/models/eventModel";
import {EventClass} from "../../../../../classes/dataClasses/event/event";

const _ = require('lodash');


export class DbManager {

    private static instance: DbManager = new DbManager();

    perimeterModel;
    nfzDynamicModel;
    Logs;
    nfzStaticModel;
    routeModel;
    taskModel;
    eventModel;


    private constructor() {
        this.perimeterModel = new PerimeterModel().getSchema();
        this.Logs = new LogsModel().getSchema();
        this.nfzDynamicModel = new NFZDynamicModel().getSchema();
        this.nfzStaticModel = new NFZStaticModel().getSchema();
        this.routeModel = new RouteModel().getSchema();
        this.taskModel = new TaskModel().getSchema();
        this.eventModel = new EventModel().getSchema();
    }

    // ----------------------
    private setPerimeter = (data: PERIMETER_TO_SAVE): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            // const _id = data._id || new (id:MongoConnector.getMongoose()).mongo.ObjectID();
            this.perimeterModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readPerimeter = (data: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.perimeterModel.find(data)
                .exec()
                .then(result => {
                    const obj = result[0];
                    resolve({success: true, data: obj || {}} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deletePerimeter = (data: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.perimeterModel
                .findOneAndDelete(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    // ----------------------
    private setNFZStatic = (data: NFZ_DATA): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzStaticModel(data)
                .save()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });

    };
    private readAllLogData = (data: LOG_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.Logs.find(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    private readLogDataById = (data: LOG_DATA_BY_ID): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.Logs.find( { airVehicleId:data.airVehicleId, timestamp: { $lte: data.endingTimestamp ,  $gte: data.startingTimestamp }})
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    private setLogData = (data: LOG_DATA): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.Logs(data)
                .save()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });

    };
    private readNFZStatic = (data: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.nfzStaticModel.find(data)
                .exec()
                .then(result => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllNFZStatic = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.nfzStaticModel.find(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteNFZStatic = (data: ID_OBJ): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzStaticModel
                .findOneAndDelete(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteAllNFZStatic = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzStaticModel
                .deleteMany(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    // ----------------------
    private setNFZDynamic = (data: NFZ_DATA): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzDynamicModel
                .findOneAndUpdate({id: data.id}, data, {new: true, upsert: true})
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readNFZDynamic = (data: ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.nfzDynamicModel.find(data)
                .exec()
                .then(result => {
                    const obj = result[0];
                    resolve({success: (obj !== undefined), data: obj} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private readAllNFZDynamic = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.nfzDynamicModel.find(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteNFZDynamic = (data: ID_OBJ): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzDynamicModel
                .findOneAndDelete(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteAllNFZDynamic = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE<NFZ_DATA>> => {
        return new Promise((resolve, reject) => {
            this.nfzDynamicModel
                .deleteMany(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    // ----------------------
    private setRoute = (data: ROUTE_DATA): Promise<ASYNC_RESPONSE<ROUTE_DATA>> => {
        return new Promise((resolve, reject) => {
            this.routeModel
                .findOneAndUpdate({routeId: data.routeId}, data, {new: true, upsert: true})
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });

    };

    private readAllRoutes = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.routeModel.find(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteRoute = (data: { routeId: ID_TYPE }): Promise<ASYNC_RESPONSE<ROUTE_DATA>> => {
        return new Promise((resolve, reject) => {
            this.routeModel
                .findOneAndDelete(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    // ----------------------
    private setTask = (data: TASK | WASP_TASK): Promise<ASYNC_RESPONSE<TASK | WASP_TASK>> => {
        return new Promise((resolve, reject) => {
            this.taskModel
                .findOneAndUpdate({taskId: data.taskId}, data, {new: true, upsert: true})
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });

    };

    private readAllTasks = (data: SITE_ID_OBJ): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            this.taskModel.find(data)
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };

    private deleteTask = (data: { taskId: ID_TYPE }): Promise<ASYNC_RESPONSE<TASK>> => {
        return new Promise((resolve, reject) => {
            this.taskModel
                .findOneAndDelete({taskId: data.taskId})
                .exec()
                .then(result => {
                    resolve({success: true, data: result} as ASYNC_RESPONSE);
                })
                .catch(error => {
                    console.log(error);
                    reject({success: false, data: error} as ASYNC_RESPONSE);
                });
        });
    };
    //---------------------------

    private  readAllEvents = (): Promise<ASYNC_RESPONSE<EventClass[]>> => {
        return new Promise(((resolve, reject) => {
            this.eventModel.find()
                .exec()
                .then(result => {
                // all event in result
            }).catch(error => {
                // error getting events
            })
        }))
    }


    // region API uncions
    public static setLogData = DbManager.instance.setLogData;
    public static readAllLogData = DbManager.instance.readAllLogData;
    public static readLogDataById = DbManager.instance.readLogDataById;
    public static setPerimeter = DbManager.instance.setPerimeter;
    public static readPerimeter = DbManager.instance.readPerimeter;
    public static deletePerimeter = DbManager.instance.deletePerimeter;


    public static setNFZStatic = DbManager.instance.setNFZStatic;
    public static readNFZStatic = DbManager.instance.readNFZStatic;
    public static readAllNFZStatic = DbManager.instance.readAllNFZStatic;
    public static deleteNFZStatic = DbManager.instance.deleteNFZStatic;
    public static deleteAllNFZStatic = DbManager.instance.deleteAllNFZStatic;

    public static setNFZDynamic = DbManager.instance.setNFZDynamic;
    public static readNFZDynamic = DbManager.instance.readNFZDynamic;
    public static readAllNFZDynamic = DbManager.instance.readAllNFZDynamic;
    public static deleteNFZDynamic = DbManager.instance.deleteNFZDynamic;
    public static deleteAllNFZDynamic = DbManager.instance.deleteAllNFZDynamic;

    public static setRoute = DbManager.instance.setRoute;
    public static readAllRoutes = DbManager.instance.readAllRoutes;
    public static deleteRoute = DbManager.instance.deleteRoute;

    public static setTask = DbManager.instance.setTask;
    public static readAllTasks = DbManager.instance.readAllTasks;
    public static deleteTask = DbManager.instance.deleteTask;

    public static readAllEvents = DbManager.instance.readAllEvents;


    // endregion API uncions

}
