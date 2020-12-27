export enum API_GENERAL {
    general = 'api'
}

export enum AMS_API {
    setSite = '/setSite',

}

export enum MS_API {
    createMissionRequestFromMGW = '/createMissionRequestFromMGW',
    createMissionRequest = '/createMissionRequest',
    readAllMissionRequest = '/readAllMissionRequest',
    readAllMission = '/readAllMission',
    readAllMissionRoute = '/readAllMissionRoute',
    readAllGraphicOverlay = '/readAllGraphicOverlay',
    readAllNFZ = '/readAllNFZ',
    missionRequestAction = '/missionRequestAction',
    updateMissionInDB = '/updateMissionInDB',
}

export enum GS_API {
    gimbalAction = '/gimbalAction'
}

export enum TMM_API {
    commRelayMissionRequest = 'commRelayMissionRequest',
    followPathMissionRequest = 'followPathMissionRequest',
    observationMissionRequest = 'observationMissionRequest',
    scanMissionRequest = 'scanMissionRequest',
    servoingMissionRequest = 'servoingMissionRequest',
    deliveryMissionRequest = 'servoingMissionRequest',
}

export enum THALES_API {
    gimbalAction = 'gimbalAction',
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

    createMissionRequest = '/createMissionRequest',
    readMissionRequest = '/readMissionRequest',
    readAllMissionRequest = '/readAllMissionRequest',
    deleteMissionRequest = '/deleteMissionRequest',
    deleteAllMissionRequest = '/deleteAllMissionRequest',

    createMissionRoute = '/createMissionRoute',
    readMissionRoute = '/readMissionRoute',
    readAllMissionRoute = '/readAllMissionRoute',
    deleteMissionRoute = '/deleteMissionRoute',
    deleteAllMissionRoute = '/deleteAllMissionRoute',

    createMission = '/createMission',
    readMission = '/readMission',
    readAllMission = '/readAllMission',
    deleteMission = '/deleteMission',
    deleteAllMission = '/deleteAllMission',

    createGraphicOverlay = '/createGraphicOverlay',
    readGraphicOverlay = '/readGraphicOverlay',
    readAllGraphicOverlay = '/readAllGraphicOverlay',
    deleteGraphicOverlay = '/deleteGraphicOverlay',
    deleteAllGraphicOverlay = '/deleteAllGraphicOverlay',

    createNFZ = '/createNFZ',
    readNFZ = '/readNFZ',
    readAllNFZ = '/readAllNFZ',
    deleteNFZ = '/deleteNFZ',
    deleteAllNFZ = '/deleteAllNFZ',

    saveRepCollectionVersions = '/saveRepCollectionVersions',
    getRepCollectionVersions = '/getRepCollectionVersions',

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

    userTaskAction = '/userTaskAction',
    osccTaskAction = '/osccTaskAction',
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
    // getFileForSave = '/getFileForSave',
    // getFileFromTest = '/getFileFromTest',
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
    osccTaskAction = '/osccTaskAction',

    createMissionRequest = '/createMissionRequest',
    readAllMissionRequest = '/readAllMissionRequest',
    readAllMission = '/readAllMission',
    readAllMissionRoute = '/readAllMissionRoute',
    readAllGraphicOverlay = '/readAllGraphicOverlay',
    readAllNFZ = '/readAllNFZ',
    missionRequestAction = '/missionRequestAction',
    updateMissionInDB = '/updateMissionInDB',

    updateAllReports = '/updateAllReports',
    updateAllEvents = '/updateAllEvents',
    updateAllTasks = '/updateAllTasks',
    updateAllMissionRequests = '/updateAllMissionRequests',
    updateAllMissions = '/updateAllMissions',
    updateAllMissionRoutes = '/updateAllMissionRoutes',
    updateAllGraphicOverlays = '/updateAllGraphicOverlays',
    updateAllNFZs = '/updateAllNFZs',

    gimbalAction = '/gimbalAction',

}

export enum CCGW_API {
    createReportFromMGW = '/createReportFromMGW',
    getFileById = '/getFileById',
    updateFileStatus = '/updateFileStatus',
    createTask = '/createTask',
    setAllTasks = '/setAllTasks',

    getTasks = '/getTasks',
    getTaskById = '/getTaskById',
    userTaskAction = '/userTaskAction',

    createMissionRequestFromMGW = '/createMissionRequestFromMGW',

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

    setTaskById = '/setTaskById',
    setAllTasks = '/setAllTasks',

}



export enum SOCKET_ROOM { // TODO change
    FRs_Tel_room ='FRS_Tel_room',
    AVs_Tel_room ='AVs_Tel_room',
    Gimbals_Tel_room ='Gimbals_Tel_room',
}

export enum CommRelayMissionRep_API {
    updateCommRelayMissionRequest = 'updateCommRelayMissionRequest',
    getLastCommRelayMissionRequests = 'getLastCommRelayMissionRequests'
}
export enum PatrolMissionRep_API {
    updateFollowPathMissionRequest = 'updateFollowPathMissionRequest',
    getLastFollowPathMissionRequests = 'getLastFollowPathMissionRequests'
}
export enum ObservationMissionRep_API {
    updateObservationMission = 'updateObservationMission',
    getLastObservationMissionRequests = 'getLastObservationMissionRequests'
}
export enum ScanMissionRep_API {
    updateScanMissionRequest = 'updateScanMissionRequest',
    getLastScanMissionRequests = 'getLastScanMissionRequests'
}
export enum ServoingMissionRep_API {
    updateServoingMissionRequest = 'updateServoingMissionRequest',
    getLastServoingMissionRequests = 'getLastServoingMissionRequests'
}
export enum DeliveryMissionRep_API {
    updateDeliveryMissionRequest = 'updateDeliveryMissionRequest',
    getLastDeliveryMissionRequests = 'getLastDeliveryMissionRequests'
}
export enum MissionRep_API {
    getLastMissions = 'getLastMissions'
}
export enum MissionRouteRep_API {
    getLastMissionRoutes = 'getLastMissionRoutes'
}
export enum GraphicOverlayRep_API {
    getLastGraphicOverlays = 'getLastGraphicOverlays'
}
export enum NFZRep_API {
    getLastNFZs = 'getLastNFZs'
}
