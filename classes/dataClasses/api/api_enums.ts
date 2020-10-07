export enum AMS_API {
    general = 'api',
    setSite = '/setSite',

}
export enum MS_API {
    general = 'api',
}

export enum DBS_API {
    general = 'api',
    setSite = '/setSite',

    getAllEvents = '/getAllEvents',

 }

export enum REPORT_API {
    createReport = '/createReport',
    createReportExternal = '/createReportExternal',

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
    general = 'api',
    getLogById = '/getLogById',
}

export enum TS_API {

}

export enum RS_API {
    general = 'api',




}


export enum MWS_API {

    general = 'api',
    updateAllReports = '/updateAllReports',
    updateAllEvents = '/updateAllEvents',
    newReport = '/newReport',
    getVideoSources = '/getVideoSources',

}
export enum ES_API{
    general = 'api',
    getAllEvents = '/getAllEvents',
}


export enum CCG_API {

    general = 'api',
    newReport = '/newReport',
    getVideoSources = '/getVideoSources',
    uploadFileToMG = '/uploadFileToMG'
}

export enum FS_API {
    general = 'api',
    uploadFile = '/uploadFile',
    removeFile = '/removeFile',
    getFile = '/file/:id',
    getFileForSave = '/getFileForSave',
}

export enum WS_API {
    general = 'api',
    newReport = '/newReport',
    uploadFile = '/uploadFile',
    removeFile = '/removeFile',
}
