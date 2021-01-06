import { ReportManager } from '../report/reportManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';


import { GeoPoint } from '../../../../../classes/dataClasses/geo/geoPoint';

import {
    Request,
    Response
} from 'express';
import {
    ASYNC_RESPONSE,
    EVENT_DATA,
    MISSION_REQUEST_DATA,
    ID_OBJ,
    OSCC_TASK_ACTION,
    REPORT_DATA,
    TASK_DATA,
    MISSION_DATA,
    MISSION_ROUTE_DATA,
    GIMBAL_ACTION,
    MISSION_REQUEST_ACTION_OBJ,
    GRAPHIC_OVERLAY_DATA_UI, GRAPHIC_OVERLAY_DATA, NFZ_DATA_UI, NFZ_DATA, CREDENTIALS,
} from '../../../../../classes/typings/all.typings';



import {
    MWS_API,
    WS_API
} from '../../../../../classes/dataClasses/api/api_enums';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {FileManager} from '../file/fileManager';
import {EventManager} from '../event/eventManager';
import {TaskManager} from '../task/taskManager';
import {MissionRequestManager} from '../missionRequest/missionRequestManager';
import {MissionManager} from '../mission/missionManager';
import {MissionRouteManager} from '../missionRoute/missionRouteManager';
import {GimbalManager} from '../gimbal/gimbalManager';
import {GraphicOverlayManager} from "../graphicOverlay/graphicOverlayManager";
import {NFZManager} from "../NFZ/NFZManager";
import {LoginManager} from '../../auth/loginManager';


export class ApiManager implements IRest {


    private static instance: ApiManager = new ApiManager();


    private constructor() {
        // this.getDynamicNfzFromWebServer();
    }

    public listen = (router: core.Router): boolean => {
        for ( const path in this.routers ) {
            if ( this.routers.hasOwnProperty(path) ) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };

    // ========================================================================

    private createReport = (request: Request, response: Response) => {
        const requestBody: REPORT_DATA = request.body;
        ReportManager.createReport(requestBody)
            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                response.send(data);
            });
    };

    private readReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<REPORT_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            ReportManager.readReport(requestBody)
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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
        ReportManager.readAllReport({})
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private deleteReport = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            ReportManager.deleteReport(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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

        ReportManager.deleteAllReport()
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

    private updateAllReports = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: REPORT_DATA[] = request.body;
        ReportManager.updateAllReports(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    // ========================================================================

    private createEvent = (request: Request, response: Response) => {
        const requestBody: EVENT_DATA = request.body;
        EventManager.createEvent(requestBody)
            .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                response.send(data);
            });
    };

    private readEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<EVENT_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            EventManager.readEvent(requestBody)
                .then((data: ASYNC_RESPONSE<EVENT_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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
        EventManager.readAllEvent({})
            .then((data: ASYNC_RESPONSE<EVENT_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private deleteEvent = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            EventManager.deleteEvent(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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

        EventManager.deleteAllEvent()
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

    private updateAllEvents = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: EVENT_DATA[] = request.body;
        EventManager.updateAllEvents(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };
    // ========================================================================

    private createTask = (request: Request, response: Response) => {
        const requestBody: TASK_DATA = request.body;
        TaskManager.createTask(requestBody)
            .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE<TASK_DATA>) => {
                response.send(data);
            });
    };

    private readTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            TaskManager.readTask(requestBody)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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
        TaskManager.readAllTask({})
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private deleteTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
        const requestBody: ID_OBJ = request.body;
        if ( requestBody && requestBody.id !== undefined ) {
            TaskManager.deleteTask(requestBody)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.success = data.success;
                    res.data = data.data;
                    response.send(res);
                })
                .catch((data: ASYNC_RESPONSE) => {
                    res.success = data.success;
                    res.data = data.data;
                    res.description = data.description;
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

        TaskManager.deleteAllTask()
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

    private osccTaskAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: OSCC_TASK_ACTION = request.body;
        TaskManager.osccTaskAction(requestBody)
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

    private updateAllTasks = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: TASK_DATA[] = request.body;
        TaskManager.updateAllTasks(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    // ========================================================================

    private getVideoSources = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<boolean> = {success: true};
        const requestBody = request.body;

        // NfzManager.createDynamicNFZFromRoute(requestBody)
        //     .then((data: ASYNC_RESPONSE) => {
        response.send(res);
        // })
        // .catch((data: ASYNC_RESPONSE) => {
        //     response.send(data);
        // });
    };

    private uploadFile = (request: Request, response: Response) => {
        FileManager.uploadFile(request, response);
    };

    private removeFile = (request: Request, response: Response) => {
        let res: ASYNC_RESPONSE = {success: false};

        FileManager.removeFile(request.body)
            .then((data: ASYNC_RESPONSE) => {
                res = data;
                response.send(res);
            })
            .catch((data) => {
                res = data;
                response.send(res);
            });

    };

    // ========================================================================
    private createMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: MISSION_REQUEST_DATA = request.body;
        MissionRequestManager.createMissionRequest(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    }

    private readAllMissionRequest = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]> = {success: false};
        MissionRequestManager.readAllMissionRequest({})
            .then((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllMission = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_DATA[]> = {success: false};
        MissionManager.readAllMission({})
            .then((data: ASYNC_RESPONSE<MISSION_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllMissionRoute = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]> = {success: false};
        MissionRouteManager.readAllMissionRoute({})
            .then((data: ASYNC_RESPONSE<MISSION_ROUTE_DATA[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllGraphicOverlay = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA_UI[]> = {success: false};
        GraphicOverlayManager.readAllGraphicOverlay({})
            .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA_UI[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private readAllNFZ = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<NFZ_DATA_UI[]> = {success: false};
        NFZManager.readAllNFZ({})
            .then((data: ASYNC_RESPONSE<NFZ_DATA_UI[]>) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private updateAllMissionRequests = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: MISSION_REQUEST_DATA[] = request.body;
        MissionRequestManager.updateAllMissionRequests(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private updateAllMissions = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: MISSION_DATA[] = request.body;
        MissionManager.updateAllMissions(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };


    private updateAllMissionRoutes = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: MISSION_ROUTE_DATA[] = request.body;
        MissionRouteManager.updateAllMissionRoutes(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private updateAllGraphicOverlays = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GRAPHIC_OVERLAY_DATA[] = request.body;
        GraphicOverlayManager.updateAllGraphicOverlays(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private updateAllNFZs = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: NFZ_DATA[] = request.body;
        NFZManager.updateAllNFZs(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    private updateMissionInDB = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: MISSION_REQUEST_DATA = request.body;
        MissionRequestManager.updateMissionInDB(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };
    // ========================================================================
    private missionRequestAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};

        const requestBody: MISSION_REQUEST_ACTION_OBJ = request.body;
        MissionRequestManager.missionRequestAction(requestBody)
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

    private gimbalAction = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: GIMBAL_ACTION = request.body;
        GimbalManager.gimbalAction(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    // ========================================================================
    private login = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: CREDENTIALS = request.body;
        LoginManager.validateLogin(requestBody)
            .then((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                response.send(res);
            })
            .catch((data: ASYNC_RESPONSE) => {
                res.success = data.success;
                res.data = data.data;
                res.description = data.description;
                response.send(res);
            });
    };

    // ========================================================================
    routers: {} = {
        [MWS_API.getVideoSources]: this.getVideoSources,



        [WS_API.createReport]: this.createReport,
        [WS_API.readReport]: this.readReport,
        [WS_API.readAllReport]: this.readAllReport,
        [WS_API.deleteReport]: this.deleteReport,
        [WS_API.deleteAllReport]: this.deleteAllReport,

        [WS_API.createEvent]: this.createEvent,
        [WS_API.readEvent]: this.readEvent,
        [WS_API.readAllEvent]: this.readAllEvent,
        [WS_API.deleteEvent]: this.deleteEvent,
        [WS_API.deleteAllEvent]: this.deleteAllEvent,

        [WS_API.createTask]: this.createTask,
        [WS_API.readTask]: this.readTask,
        [WS_API.readAllTask]: this.readAllTask,
        [WS_API.deleteTask]: this.deleteTask,
        [WS_API.deleteAllTask]: this.deleteAllTask,
        [WS_API.osccTaskAction]: this.osccTaskAction,

        [WS_API.createMissionRequest]: this.createMissionRequest,
        [WS_API.readAllMissionRequest]: this.readAllMissionRequest,
        [WS_API.readAllMission]: this.readAllMission,
        [WS_API.readAllMissionRoute]: this.readAllMissionRoute,
        [WS_API.readAllGraphicOverlay]: this.readAllGraphicOverlay,
        [WS_API.readAllNFZ]: this.readAllNFZ,
        [WS_API.updateMissionInDB]: this.updateMissionInDB,

        [WS_API.uploadFile]: this.uploadFile,
        [WS_API.removeFile]: this.removeFile,

        [WS_API.updateAllReports]: this.updateAllReports,
        [WS_API.updateAllEvents]: this.updateAllEvents,
        [WS_API.updateAllTasks]: this.updateAllTasks,
        [WS_API.updateAllMissionRequests]: this.updateAllMissionRequests,
        [WS_API.updateAllMissions]: this.updateAllMissions,
        [WS_API.updateAllMissionRoutes]: this.updateAllMissionRoutes,
        [WS_API.updateAllGraphicOverlays]: this.updateAllGraphicOverlays,
        [WS_API.updateAllNFZs]: this.updateAllNFZs,

        [WS_API.login]: this.login,

        [WS_API.missionRequestAction]: this.missionRequestAction,
        [WS_API.gimbalAction]: this.gimbalAction,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
