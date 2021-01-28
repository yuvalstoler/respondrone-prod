import { DbManager } from '../DB/dbManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';

import {
    ASYNC_RESPONSE, COLLECTION_VERSIONS, CREDENTIALS,
    EVENT_DATA,
    FILE_DB_DATA, GRAPHIC_OVERLAY_DATA,
    ID_OBJ,
    ID_TYPE, MISSION_DATA, MISSION_REQUEST_DATA, MISSION_ROUTE_DATA, NFZ_DATA,
    REPORT_DATA,
    TASK_DATA, USER_DATA,
} from '../../../../../classes/typings/all.typings';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {
    DBS_API
} from '../../../../../classes/dataClasses/api/api_enums';


export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();

    private constructor() {
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };


    // region report ----------------------
    private setReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};

        const requestBody: REPORT_DATA = request.body;

        if ( requestBody ) {
            DbManager.setReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;

                    res.data = data.data;

                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA[]> = {success: false};

        const requestBody = request.body;


        DbManager.readAllReport({})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                res.success = data.success;

                res.data = data.data;

                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteReport(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody = request.body;


        DbManager.deleteAllReport({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };
    // endregion ----------------------

    // region event ----------------------

    private setEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};

        const requestBody: EVENT_DATA = request.body;

        if ( requestBody ) {
            DbManager.setEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.success = data.success;

                    res.data = data.data;

                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA[]> = {success: false};

        const requestBody = request.body;


        DbManager.readAllEvent({})
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                res.success = data.success;

                res.data = data.data;

                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: ID_OBJ = request.body;


        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteEvent(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody = request.body;


        DbManager.deleteAllEvent({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };
    // endregion ----------------------

    // region file ----------------------

    private saveFileData = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const data: FILE_DB_DATA = request.body;
        DbManager.createFileData(data)
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);

            })
    }

    private readFileData = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const data: FILE_DB_DATA = request.body;
        DbManager.readFileData(data)
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);

            })
    }

    private updateFileData = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const data: Partial<FILE_DB_DATA> = request.body;

        DbManager.updateFileData(data)
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);

            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            })
    }

    private getAllFileData = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        // const data: Partial<FILE_DB_DATA> = request.body;

        DbManager.getAllFileData()
            .then((data: ASYNC_RESPONSE<FILE_DB_DATA[]>) => {
                response.send(data);

            })
            .catch((data: ASYNC_RESPONSE<FILE_DB_DATA>) => {
                response.send(data);
            })
    }

    // endregion ----------------------

    // region task ----------------------
    private createTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: false};
        const requestBody: TASK_DATA = request.body;
        if ( requestBody ) {
            DbManager.createTask(requestBody)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readTask(requestBody)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: false};
        DbManager.readAllTask({})
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteTask(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllTask({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };
    // endregion ----------------------

    // region missionRequest ----------------------
    private createMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_REQUEST_DATA> = {success: false};
        const requestBody: MISSION_REQUEST_DATA = request.body;
        if ( requestBody ) {
            DbManager.createMissionRequest(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_REQUEST_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readMissionRequest(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]> = {success: false};
        DbManager.readAllMissionRequest({})
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteMissionRequest(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllMissionRequest({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };
    // endregion ----------------------

    // region missionRoute ----------------------
    private createMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA> = {success: false};
        const requestBody: MISSION_ROUTE_DATA = request.body;
        if ( requestBody ) {
            DbManager.createMissionRoute(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readMissionRoute(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]> = {success: false};
        DbManager.readAllMissionRoute({})
            .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteMissionRoute(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllMissionRoute({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };

    // endregion ----------------------

    // region mission ----------------------
    private createMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_DATA> = {success: false};
        const requestBody: MISSION_DATA = request.body;
        if ( requestBody ) {
            DbManager.createMission(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readMission(requestBody)
                .then((data: ASYNC_RESPONSE<MISSION_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<MISSION_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_DATA[]> = {success: false};
        DbManager.readAllMission({})
            .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteMission(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllMission({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };

    // endregion ----------------------

    // region graphicOverlay ----------------------

    private createGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA> = {success: false};
        const requestBody: GRAPHIC_OVERLAY_DATA = request.body;
        if ( requestBody ) {
            DbManager.createGraphicOverlay(requestBody)
                .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readGraphicOverlay(requestBody)
                .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]> = {success: false};
        DbManager.readAllGraphicOverlay({})
            .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteGraphicOverlay(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllGraphicOverlay({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };
    // endregion ----------------------

    // region NFZ ----------------------

    private createNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<NFZ_DATA> = {success: false};
        const requestBody: NFZ_DATA = request.body;
        if ( requestBody ) {
            DbManager.createNFZ(requestBody)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<NFZ_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readNFZ(requestBody)
                .then((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<NFZ_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<NFZ_DATA[]> = {success: false};
        DbManager.readAllNFZ({})
            .then((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<NFZ_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteNFZ(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllNFZ({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };
    // endregion ----------------------

    // region user ----------------------

    private createUser = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<USER_DATA> = {success: false};
        const requestBody: USER_DATA = request.body;
        if ( requestBody ) {
            DbManager.createUser(requestBody)
                .then((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private readUser = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<USER_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.readUser(requestBody)
                .then((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readUserByCredentials = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<USER_DATA> = {success: false};
        const requestBody: CREDENTIALS = request.body;
        if ( requestBody && requestBody.name !== undefined && requestBody.password !== undefined ) {
            DbManager.readUser(requestBody)
                .then((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<USER_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private readAllUser = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<USER_DATA[]> = {success: false};
        DbManager.readAllUser({})
            .then((data: ASYNC_RESPONSE<USER_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<USER_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });

    };

    private deleteUser = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            DbManager.deleteUser(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing field id';
            response.send(res);
        }
    };

    private deleteAllUser = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody = request.body;
        DbManager.deleteAllUser({})
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };
    // endregion ----------------------

    private saveRepCollectionVersions = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<COLLECTION_VERSIONS> = {success: false};
        const requestBody: MISSION_REQUEST_DATA = request.body;
        if ( requestBody ) {
            DbManager.saveRepCollectionVersions(requestBody)
                .then((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                });
        }
        else {
            res.description = 'missing requestBody';
            response.send(res);
        }
    };

    private getRepCollectionVersions = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<COLLECTION_VERSIONS> = {success: false};
        const requestBody = request.body;
        DbManager.getRepCollectionVersions(requestBody)
            .then((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE<COLLECTION_VERSIONS>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            });
    };



    routers: {} = {

        [DBS_API.createReport]: this.setReport,
        [DBS_API.readReport]: this.readReport,
        [DBS_API.readAllReport]: this.readAllReport,
        [DBS_API.deleteReport]: this.deleteReport,
        [DBS_API.deleteAllReport]: this.deleteAllReport,

        [DBS_API.createEvent]: this.setEvent,
        [DBS_API.readEvent]: this.readEvent,
        [DBS_API.readAllEvent]: this.readAllEvent,
        [DBS_API.deleteEvent]: this.deleteEvent,
        [DBS_API.deleteAllEvent]: this.deleteAllEvent,

        [DBS_API.saveFileData]: this.saveFileData,
        [DBS_API.readFileData]: this.readFileData,
        [DBS_API.updateFileData]: this.updateFileData,
        [DBS_API.getAllFileData]: this.getAllFileData,


        [DBS_API.createTask]: this.createTask,
        [DBS_API.readTask]: this.readTask,
        [DBS_API.readAllTask]: this.readAllTask,
        [DBS_API.deleteTask]: this.deleteTask,
        [DBS_API.deleteAllTask]: this.deleteAllTask,

        [DBS_API.createMissionRequest]: this.createMissionRequest,
        [DBS_API.readMissionRequest]: this.readMissionRequest,
        [DBS_API.readAllMissionRequest]: this.readAllMissionRequest,
        [DBS_API.deleteMissionRequest]: this.deleteMissionRequest,
        [DBS_API.deleteAllMissionRequest]: this.deleteAllMissionRequest,

        [DBS_API.createMissionRoute]: this.createMissionRoute,
        [DBS_API.readMissionRoute]: this.readMissionRoute,
        [DBS_API.readAllMissionRoute]: this.readAllMissionRoute,
        [DBS_API.deleteMissionRoute]: this.deleteMissionRoute,
        [DBS_API.deleteAllMissionRoute]: this.deleteAllMissionRoute,

        [DBS_API.createMission]: this.createMission,
        [DBS_API.readMission]: this.readMission,
        [DBS_API.readAllMission]: this.readAllMission,
        [DBS_API.deleteMission]: this.deleteMission,
        [DBS_API.deleteAllMission]: this.deleteAllMission,

        [DBS_API.createGraphicOverlay]: this.createGraphicOverlay,
        [DBS_API.readGraphicOverlay]: this.readGraphicOverlay,
        [DBS_API.readAllGraphicOverlay]: this.readAllGraphicOverlay,
        [DBS_API.deleteGraphicOverlay]: this.deleteGraphicOverlay,
        [DBS_API.deleteAllGraphicOverlay]: this.deleteAllGraphicOverlay,

        [DBS_API.createNFZ]: this.createNFZ,
        [DBS_API.readNFZ]: this.readNFZ,
        [DBS_API.readAllNFZ]: this.readAllNFZ,
        [DBS_API.deleteNFZ]: this.deleteNFZ,
        [DBS_API.deleteAllNFZ]: this.deleteAllNFZ,

        [DBS_API.saveRepCollectionVersions]: this.saveRepCollectionVersions,
        [DBS_API.getRepCollectionVersions]: this.getRepCollectionVersions,

        [DBS_API.createUser]: this.createUser,
        [DBS_API.readUser]: this.readUser,
        [DBS_API.readUserByCredentials]: this.readUserByCredentials,
        [DBS_API.readAllUser]: this.readAllUser,
        [DBS_API.deleteUser]: this.deleteUser,
        [DBS_API.deleteAllUser]: this.deleteAllUser,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
