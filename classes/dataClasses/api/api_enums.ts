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
    getAllReports = '/getAllReports',


}

export enum REPORT_API {
    createReport = '/createReport',
    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',
    getAllReports = '/getAllReports',

}

export enum EVENT_API {
    createEvent = '/createEvent',
    readEvent = '/readEvent',
    readAllEvent = '/readAllEvent',
    deleteEvent = '/deleteEvent',
    deleteAllEvent = '/deleteAllEvent',
    getAllEvents = '/getAllEvents',

}

export enum LS_API {
    getLogById = '/getLogById',
}

export enum TS_API {

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
    updateAllEvents = '/updateAllEvents',
    newReport = '/newReport',
    getVideoSources = '/getVideoSources',

}

export enum ES_API {
    getAllEvents = '/getAllEvents',
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
    newReport = '/newReport',
    uploadFile = '/uploadFile',
    removeFile = '/removeFile',
    updateAllReports = '/updateAllReports',
    updateAllEvents = '/updateAllEvents',
}

export enum CCGW_API {
    createReportFromMGW = '/createReportFromMGW',
    getFileById = '/fileById',
    updateFileStatus = '/updateFileStatus',

}

export enum MG_API {
    createReport_in_OSCC = '/createReport_in_OSCC',
    getFile = '/getFile',

    readReport = '/readReport',
    readAllReport = '/readAllReport',
    deleteReport = '/deleteReport',
    deleteAllReport = '/deleteAllReport',
    getAllReports = '/getAllReports',
    fileById = '/fileById',
    updateFileStatus = '/updateFileStatus',

}
