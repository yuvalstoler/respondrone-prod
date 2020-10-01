import {DbManager} from '../DB/dbManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';

import {
    ASYNC_RESPONSE,
    ID_OBJ, ID_TYPE, LOG_DATA, LOG_DATA_BY_ID,
    NFZ_DATA,
    PERIMETER_TO_SAVE, ROUTE_DATA,
    SITE_ID_OBJ, TASK, WASP_TASK,
    ZIP_DATA
} from '../../../../../classes/typings/all.typings';
import {IRest} from '../../../../../classes/dataClasses/interfaces/IRest';
import {Compress} from '../../../../../classes/applicationClasses/utility/compress';
import {DBS_API} from '../../../../../classes/dataClasses/api/api_enums';




export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();

    private constructor() {
    }

    public listen = (router: core.Router): boolean => {
        for (const path in this.routers) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };


    // ----------------------
    private setPerimeter = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<NFZ_DATA>> = {success: false};

        const requestBody: ZIP_DATA<PERIMETER_TO_SAVE> = request.body;
        let requestJson: PERIMETER_TO_SAVE = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined && requestJson.id !== undefined) {
            DbManager.setPerimeter(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    } else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId/id';
            response.send(res);
        }
    };

    private getPerimeter = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.readPerimeter(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }

    };

    private deletePerimeter = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.deletePerimeter(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    // ----------------------
    private setStaticNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<NFZ_DATA>> = {success: false};

        const requestBody: ZIP_DATA = request.body;
        let requestJson: NFZ_DATA = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined && requestJson.id !== undefined) {
            DbManager.setNFZStatic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId/id';
            response.send(res);
        }
    };

    private getStaticNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.readNFZStatic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private getAllStaticNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.readAllNFZStatic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };

    private deleteStaticNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ID_OBJ>> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.deleteNFZStatic(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllStaticNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ID_OBJ>> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.deleteAllNFZStatic(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };

    // ----------------------
    private setDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<NFZ_DATA>> = {success: false};

        const requestBody: ZIP_DATA = request.body;
        let requestJson: NFZ_DATA = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined  && requestJson.allowedId !== undefined) {
            DbManager.setNFZDynamic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId or allowedId';
            response.send(res);
        }
    };

    private getDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.readNFZDynamic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private getAllDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.readAllNFZDynamic(requestJson)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };

    private deleteDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ID_OBJ>> = {success: false};

        const requestBody: ZIP_DATA<ID_OBJ> = request.body;
        let requestJson: ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.id !== undefined) {
            DbManager.deleteNFZDynamic(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllDynamicNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ID_OBJ>> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.deleteAllNFZDynamic(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };

    // ----------------------
    private setRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ROUTE_DATA>> = {success: false};

        const requestBody: ZIP_DATA = request.body;
        let requestJson: ROUTE_DATA = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined /*&& requestJson.id !== undefined*/) {
            DbManager.setRoute(requestJson)
                .then((data: ASYNC_RESPONSE<ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId/id';
            response.send(res);
        }
    };

    private getAllRoutes = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<ROUTE_DATA[]>> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.readAllRoutes(requestJson)
                .then((data: ASYNC_RESPONSE<ROUTE_DATA[]>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };

    private deleteRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<{routeId: ID_TYPE}>> = {success: false};

        const requestBody: ZIP_DATA<{routeId: ID_TYPE}> = request.body;
        let requestJson: {routeId: ID_TYPE} = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.routeId !== undefined) {
            DbManager.deleteRoute(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    // ----------------------
    private setTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<TASK | WASP_TASK>> = {success: false};

        const requestBody: ZIP_DATA = request.body;
        let requestJson: TASK | WASP_TASK = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined /*&& requestJson.id !== undefined*/) {
            DbManager.setTask(requestJson)
                .then((data: ASYNC_RESPONSE<ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId/id';
            response.send(res);
        }
    };
    private getAllTasks = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<TASK[]>> = {success: false};

        const requestBody: ZIP_DATA<SITE_ID_OBJ> = request.body;
        let requestJson: SITE_ID_OBJ = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.siteId !== undefined) {
            DbManager.readAllTasks(requestJson)
                .then((data: ASYNC_RESPONSE<TASK[]>) => {
                    res.success = data.success;
                    if ( requestBody.zip ) {
                        res.data = {zip: Compress.pack(data.data)};
                    }
                    else {
                        res.data = {json: data.data};
                    }
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field siteId';
            response.send(res);
        }
    };
    private addLog = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: LOG_DATA = request.body;
        let requestJson: LOG_DATA   = requestBody;
            DbManager.setLogData(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
    };
    private getLog = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: LOG_DATA = request.body;
        let requestJson: LOG_DATA   = requestBody;
        DbManager.readAllLogData(requestJson)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = {json: data.data};
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = {json: data.data};
                response.send(res);
            });
    };
    private getLogById = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestJson: LOG_DATA_BY_ID   = request.body;
        DbManager.readLogDataById(requestJson)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = {json: data.data};
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = {json: data.data};
                response.send(res);
            });
    };

    private deleteTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ZIP_DATA<{taskId: ID_TYPE}>> = {success: false};

        const requestBody: ZIP_DATA<{taskId: ID_TYPE}> = request.body;
        let requestJson: {taskId: ID_TYPE} = requestBody.json;
        if ( requestBody.zip ) {
            requestJson = Compress.unpack(requestBody.zip);
        }

        if (requestJson && requestJson.taskId !== undefined) {
            DbManager.deleteTask(requestJson)
                .then((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = {json: data.data};
                    response.send(res);
                });
        } else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private getAllEvents = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        DbManager.readAllEvents().then(data => {
            // get events
        }).catch(error => {
            //error getting events
        })
    }

    routers: {} = {
        [DBS_API.getAllEvents]:             this.getAllEvents,

        [DBS_API.getLogById]:               this.getLogById,
        [DBS_API.addLog]:                   this.addLog,
        [DBS_API.getLog]:                   this.getLog,

        [DBS_API.setPerimeter]:             this.setPerimeter,
        [DBS_API.getPerimeter]:             this.getPerimeter,
        [DBS_API.deletePerimeter]:          this.deletePerimeter,

        [DBS_API.setStaticNFZ]:             this.setStaticNFZ,
        [DBS_API.getStaticNFZ]:             this.getStaticNFZ,
        [DBS_API.getAllStaticNFZ]:          this.getAllStaticNFZ,
        [DBS_API.deleteStaticNFZ]:          this.deleteStaticNFZ,
        [DBS_API.deleteAllStaticNFZ]:       this.deleteAllStaticNFZ,

        [DBS_API.setDynamicNFZ]:            this.setDynamicNFZ,
        [DBS_API.getDynamicNFZ]:            this.getDynamicNFZ,
        [DBS_API.getAllDynamicNfz]:         this.getAllDynamicNFZ,
        [DBS_API.deleteDynamicNFZ]:         this.deleteDynamicNFZ,
        [DBS_API.deleteAllDynamicNfz]:      this.deleteAllDynamicNFZ,

        [DBS_API.setRoute]:                 this.setRoute,
        [DBS_API.getAllRoutes]:             this.getAllRoutes,
        [DBS_API.deleteRoute]:              this.deleteRoute,

        [DBS_API.setTask]:                  this.setTask,
        [DBS_API.getAllTasks]:              this.getAllTasks,
        [DBS_API.deleteTask]:               this.deleteTask,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
