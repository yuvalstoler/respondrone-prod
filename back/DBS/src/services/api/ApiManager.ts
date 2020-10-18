import { DbManager } from '../DB/dbManager';

const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';

import {
    ASYNC_RESPONSE,
    EVENT_DATA,
    FILE_DB_DATA,
    ID_OBJ,
    ID_TYPE,
    REPORT_DATA, TASK_DATA,
} from '../../../../../classes/typings/all.typings';
import { IRest } from '../../../../../classes/dataClasses/interfaces/IRest';
import {
    DBS_API,
    EVENT_API,
    REPORT_API
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


    // ----------------------

    // ----------------------
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

    // ----------------------

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

    // ----------------------

    private setTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA> = {success: false};

        const requestBody: TASK_DATA = request.body;

        if ( requestBody ) {
            DbManager.setTask(requestBody)
                .then((data: ASYNC_RESPONSE<TASK_DATA>) => {
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

    private readAllTask = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE<TASK_DATA[]> = {success: false};

        const requestBody = request.body;


        DbManager.readAllTask({})
            .then((data: ASYNC_RESPONSE<TASK_DATA[]>) => {
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

    // ----------------------

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

    // ----------------------


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

        [DBS_API.createTask]: this.setTask,
        [DBS_API.readTask]: this.readTask,
        [DBS_API.readAllTask]: this.readAllTask,
        [DBS_API.deleteTask]: this.deleteTask,
        [DBS_API.deleteAllTask]: this.deleteAllTask,

        [DBS_API.saveFileData]: this.saveFileData,
        [DBS_API.readFileData]: this.readFileData,
        [DBS_API.updateFileData]: this.updateFileData,
        [DBS_API.getAllFileData]: this.getAllFileData,

    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
