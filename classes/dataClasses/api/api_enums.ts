export enum API_GENERAL {
    general = 'api'
}

export enum AMS_API {
    setSite = '/setSite',

}

export enum MS_API {
}

export enum DBS_API {

    setSite = '/setSite',

    getAllEvents = '/getAllEvents',

    saveFileData = '/saveFileData',
    readFileData = '/readFileData',
    updateFileData = '/updateFileData',
    getAllFileData = '/getAllFileData',

    createEvent = '/createEvent',
    readEvent = '/readEvent',
    readAllEvent = '/readAllEvent',
    deleteEvent = '/deleteEvent',
    deleteAllEvent = '/deleteAllEvent',

    createReport = '/createReport',
    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',

    createTask = '/createTask',
    readTask = '/readTask',
    readAllTask = '/readAllTask',
    deleteTask = '/deleteTask',
    deleteAllTask = '/deleteAllTask',

}

// export enum REPORT_API {
//     createReport = '/createReport',
//     readReport = '/readReport',
//     readAllReport = '/readAllReport',
//     deleteReport = '/deleteReport',
//     deleteAllReport = '/deleteAllReport',
//     getAllReports = '/getAllReports',
//
// }
//
// export enum EVENT_API {
//     createEvent = '/createEvent',
//     readEvent = '/readEvent',
//     readAllEvent = '/readAllEvent',
//     deleteEvent = '/deleteEvent',
//     deleteAllEvent = '/deleteAllEvent',
//     getAllEvents = '/getAllEvents',
//
// }
//
// export enum TASK_API {
//     createTask = '/createTask',
//     readTask = '/readTask',
//     readAllTask = '/readAllTask',
//     deleteTask = '/deleteTask',
//     deleteAllTask = '/deleteAllTask',
//     getAllTasks = '/getAllTasks',
//
// }

export enum LS_API {
    getLogById = '/getLogById',
}

export enum TS_API {
    createTask = '/createTask',
    readTask = '/readTask',
    readAllTask = '/readAllTask',
    deleteTask = '/deleteTask',
    deleteAllTask = '/deleteAllTask',

    getAllTasks = '/getAllTasks',
    getTaskById = '/getTaskById',

}

export enum RS_API {
    createReport = '/createReport',
    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',

    createReportFromMGW = '/createReportFromMGW',
    updateListenersFS = '/updateListenersFS',

}


export enum MWS_API {
    updateAllReports = '/updateAllReports',
    // updateAllEvents = '/updateAllEvents',
    // updateAllTasks = '/updateAllTasks',
    newReport = '/newReport',
    getVideoSources = '/getVideoSources',

}

export enum ES_API {
    createEvent = '/createEvent',
    readEvent = '/readEvent',
    readAllEvent = '/readAllEvent',
    deleteEvent = '/deleteEvent',
    deleteAllEvent = '/deleteAllEvent',
}


export enum CCG_API {

    newReport = '/newReport',
    getVideoSources = '/getVideoSources',
    uploadFileToMG = '/uploadFileToMG'
}

export enum FS_API {
    uploadFile = '/uploadFile',
    removeFile = '/removeFile',
    getFile = '/file/:id',
    getFileForSave = '/getFileForSave',
    getFileFromTest = '/getFileFromTest',
    requestToDownloadFiles = '/requestToDownloadFiles',
    getFileData = '/getFileData',
    updateListenersFS = '/updateListenersFS',


}

export enum WS_API {
    createEvent = '/createEvent',
    readEvent = '/readEvent',
    readAllEvent = '/readAllEvent',
    deleteEvent = '/deleteEvent',
    deleteAllEvent = '/deleteAllEvent',

    createReport = '/createReport',
    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',
    uploadFile = '/uploadFile',
    removeFile = '/removeFile',

    createTask = '/createTask',
    readTask = '/readTask',
    readAllTask = '/readAllTask',
    deleteTask = '/deleteTask',
    deleteAllTask = '/deleteAllTask',

    updateAllReports = '/updateAllReports',
    updateAllEvents = '/updateAllEvents',
    updateAllTasks = '/updateAllTasks',
}

export enum CCGW_API {
    createReportFromMGW = '/createReportFromMGW',
    getFileById = '/getFileById',
    updateFileStatus = '/updateFileStatus',

    getTasks = '/getTasks',
    getTaskById = '/getTaskById',

}

export enum MG_API {
    createReport_in_OSCC = '/createReport_in_OSCC',
    getFile = '/getFile',

    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',
    getAllReports = '/getAllReports',
    getFileById = '/getFileById',
    updateFileStatus = '/updateFileStatus',

}



export enum SOCKET_ROOM { // TODO change
    FRs_Tel_room ='FRS_Tel_room'
}
