const _ = require('lodash');

import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {Report} from '../../../../../classes/dataClasses/report/report';

import {DBS_API, FRS_API, FS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    FILE_DB_FS_DATA,
    FILE_FS_DATA,
    FILE_STATUS, FR_DATA,
    ID_OBJ,
    ID_TYPE,
    IDs_OBJ, MISSION_REQUEST_DATA, MISSION_TYPE, REP_OBJ_KEY,
    REPORT_DATA,
    SOURCE_TYPE
} from '../../../../../classes/typings/all.typings';
import {UpdateListenersManager} from '../updateListeners/updateListenersManager';
import {DataUtility} from '../../../../../classes/applicationClasses/utility/dataUtility';


export class ReportManager {


    private static instance: ReportManager = new ReportManager();


    reports: Report[] = [];

    fileIdsForDownload = {};
    fileIdsForFileData = {};


    private constructor() {
        this.initAllReports();
        this.startInterval();
    }

    private initAllReports = () => {
        this.getReportsFromDBS()
            .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                //    todo send to listeners
                UpdateListenersManager.updateReportListeners();
                this.checkIfMissingFileData();
            })
            .catch((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                setTimeout(() => {

                    this.initAllReports();
                }, 5000);
            });
        //    todo like AMS NFZ (or perimeter)

    }

    private checkIfMissingFileData = () => {
        this.reports.forEach((report: Report) => {
            for ( const mediaFileId in report.mediaFileIds ) {
                if ( !this.checkIfMediaExistInReport(report, mediaFileId) ) {
                    this.fileIdsForFileData[mediaFileId] = true;
                }
            }
        });
    }

    private getReportsFromDBS = (): Promise<ASYNC_RESPONSE<REPORT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            RequestManager.requestToDBS(DBS_API.readAllReport, {})
                .then((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                    if ( data.success ) {
                        this.reports = Converting.Arr_REPORT_DATA_to_Arr_Report(data.data);
                        resolve(data);
                    }
                    else {
                        //todo logger
                        console.log('error getReportsFromDB', JSON.stringify(data));
                        reject(data);
                    }
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA[]>) => {
                    //todo logger
                    console.log('error getReportsFromDB', JSON.stringify(data));
                    reject(data);
                });
        });
        //get StaticNfz From AMS

    };

    private getReportsDATA = (idObj: ID_OBJ): REPORT_DATA[] => {
        const res: REPORT_DATA[] = [];
        if ( idObj ) {
            const found = this.reports.find(element => element.id === idObj.id);
            if ( found ) {
                res.push(found.toJsonForSave());
            }
        }
        else {
            this.reports.forEach((report: Report) => {
                res.push(report.toJsonForSave());
            });
        }
        return res;
    };

    private getReport = (idObj: ID_OBJ): Report => {
        let res: Report;
        if ( idObj ) {
            res = this.reports.find(element => element.id === idObj.id);
        }

        return res;
    };

    private createReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            reportData.id = reportData.id || DataUtility.generateID();
            reportData.time = /*reportData.time ||*/ Date.now();
            reportData.idView = reportData.idView || DataUtility.generateIDForView();
            const newReport: Report = new Report(reportData);
            RequestManager.requestToDBS(DBS_API.createReport, newReport.toJsonForSave())
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const report: Report = this.reports.find(element => element.id === data.data.id);
                        if ( report ) {
                            report.setValues(data.data);
                        }
                        else {
                            this.reports.push(new Report(data.data));
                        }

                        UpdateListenersManager.updateReportListeners();
                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }
    // ------------------------
    private isValid = (reportData: REPORT_DATA): ASYNC_RESPONSE => {
        // TODO change
        const res: ASYNC_RESPONSE = {success: true};
        if (!reportData) {
            res.success = false;
            res.description = 'not valid';
        }
        return res;
    }
    // ------------------------
    private createReportFromMGW = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            // TODO VALIDATE
            const valid: ASYNC_RESPONSE = this.isValid(reportData);
            if (valid.success) {
                reportData.createdById = reportData.createdBy;

                this.getFR(reportData.createdById)
                    .then((frRes: ASYNC_RESPONSE<FR_DATA>) => {
                        if (frRes.success && frRes.data && frRes.data.callSign !== undefined) {
                            delete reportData.createdById;
                            reportData.createdBy = frRes.data.callSign;
                        }
                        this.createReportMGW(reportData)
                            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                                resolve(data);
                            })
                            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                                reject(data);
                            });
                    })
                    .catch((frRes: ASYNC_RESPONSE<FR_DATA>) => {
                        this.createReportMGW(reportData)
                            .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                                resolve(data);
                            })
                            .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                                reject(data);
                            });
                    });
            }
            else {
                reject(valid);
            }
        });
    }
    // ------------------------
    private createReportMGW = (reportData: REPORT_DATA) => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            reportData.id = reportData.id || DataUtility.generateID();
            reportData.time = reportData.time || Date.now();
            reportData.idView = reportData.idView || DataUtility.generateIDForView();
            reportData.source = SOURCE_TYPE.MRF;
            const newReport: Report = new Report(reportData);


            RequestManager.requestToDBS(DBS_API.createReport, newReport.toJsonForSave())
                .then((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;
                    if ( data.success ) {
                        const newReportCreated: Report = new Report(data.data);
                        this.reports.push(newReportCreated);
                        UpdateListenersManager.updateReportListeners();

                        const mediaIds: ID_TYPE[] = Object.keys(newReportCreated.mediaFileIds);
                        this.requestToDownloadFiles({ids: mediaIds});

                    }
                    resolve(res);
                })
                .catch((data: ASYNC_RESPONSE<REPORT_DATA>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }

    // ------------------------
    private getFR = (frId: ID_TYPE) => {
        if (frId !== undefined) {
            const idObj: ID_OBJ = {id: frId};
            return RequestManager.requestToFRS(FRS_API.getFRById, idObj);
        }
        else {
            return new Promise((resolve, reject) => {
                reject({success: false});
            });
        }
    }
    // -----------------------
    private requestToDownloadFiles = (fileIds: IDs_OBJ) => {
        RequestManager.requestToFS(FS_API.requestToDownloadFiles, fileIds)
            .then((data: ASYNC_RESPONSE) => {
                if ( data.success ) {
                    fileIds.ids.forEach((id) => {
                        delete this.fileIdsForDownload[id];
                        this.fileIdsForFileData[id] = true;
                    });
                }
                else {
                    fileIds.ids.forEach((id) => {
                        this.fileIdsForDownload[id] = true;
                    });
                }
            })
            .catch(() => {
                fileIds.ids.forEach((id) => {
                    this.fileIdsForDownload[id] = true;
                });
            });
    }

    private requestToGetFileData = (obj: ID_OBJ) => {
        RequestManager.requestToFS(FS_API.getFileData, obj)
            .then((data: ASYNC_RESPONSE<FILE_DB_FS_DATA>) => {
                if ( data.success && _.get(data, 'data.fileDbData.fileStatus') === FILE_STATUS.downloaded && data.data.fileFsData ) {
                    const report = this.findReportByFileId(obj.id); // TODO change
                    if ( report ) {
                        const reportData = report.toJsonForSave();
                        delete reportData.mediaFileIds[obj.id];
                        reportData.media.push(data.data.fileFsData);
                        this.createReport(reportData)
                            .then((res: ASYNC_RESPONSE) => {
                                if ( res.success ) {
                                    delete this.fileIdsForFileData[obj.id];
                                }
                            })
                            .catch((res: ASYNC_RESPONSE) => {
                            });
                    }
                }
            })
            .catch((data: ASYNC_RESPONSE) => {

            });
    }

    private startInterval = () => {
        setInterval(() => {
            if ( Object.keys(this.fileIdsForDownload).length > 0 ) {
                const ids: IDs_OBJ = {ids: Object.keys(this.fileIdsForDownload)};
                this.requestToDownloadFiles(ids);
            }

            if ( Object.keys(this.fileIdsForFileData).length > 0 ) {
                for ( const id in this.fileIdsForFileData ) {
                    if ( this.fileIdsForFileData.hasOwnProperty(id) ) {
                        this.requestToGetFileData({id: id});
                    }
                }
            }
        }, 5000);
    }

    private updateReport = (reportData: REPORT_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const report: Report = this.getReport({id: reportData.id});
            //todo save - send to DBS
            res.success = true;
            //    todo send to RS
            resolve(res);
        });
    }

    private updateMedia = (mediaData: FILE_FS_DATA): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const report: Report = this.findReportByFileId(mediaData.id);
            const isMediaExistInReport: boolean = this.checkIfMediaExistInReport(report, mediaData.id);
            if ( !isMediaExistInReport ) {
                report.media.push(mediaData);
                //     update listeners
                UpdateListenersManager.updateReportListeners();
            }
            res.success = true;

            resolve(res);
        });
    }

    private checkIfMediaExistInReport = (report: Report, mediaId: ID_TYPE): boolean => {
        const fileFsDataInReport: FILE_FS_DATA = report.media.find((fileFsData: FILE_FS_DATA) => {
            return (fileFsData && fileFsData.id === mediaId);
        });
        return fileFsDataInReport ? true : false;
    }

    private findReportByFileId = (id: ID_TYPE): Report => {
        const res: Report = this.reports.find((report) => {
            return (report && report.mediaFileIds && report.mediaFileIds.hasOwnProperty(id));
        });
        return res;
    }

    private readReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};

            const findedReport: Report = this.reports.find((report: Report) => {
                return report.id === reportIdData.id;
            });
            if ( findedReport ) {
                res.success = true;
                res.data = findedReport;
            }
            resolve(res);
        });
    }
    private readAllReport = (requestData): Promise<ASYNC_RESPONSE<REPORT_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            this.reports.forEach((report: Report) => {
                res.data.push(report.toJsonForSave());
            });
            resolve(res);
        });
    }

    private deleteReport = (reportIdData: ID_OBJ): Promise<ASYNC_RESPONSE<ID_OBJ>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE<ID_OBJ> = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteReport, reportIdData)
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    if ( data.success && data.data) {
                        const index = this.reports.findIndex(element => element.id === data.data.id);
                        if ( index !== -1 ) {
                            this.reports.splice(index, 1);
                        }
                        UpdateListenersManager.updateReportListeners();

                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }

    private deleteAllReport = (): Promise<ASYNC_RESPONSE<REPORT_DATA>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            RequestManager.requestToDBS(DBS_API.deleteAllReport, {})
                .then((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    res.data = data.data;
                    res.success = data.success;
                    res.description = data.description;

                    if ( data.success ) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                })
                .catch((data: ASYNC_RESPONSE<ID_OBJ>) => {
                    console.log(data);
                    reject(data);
                });
        });
    }


    // region API uncions
    public static getReports = ReportManager.instance.getReportsDATA;
    public static getReport = ReportManager.instance.getReportsDATA;

    public static createReport = ReportManager.instance.createReport;
    public static createReportFromMGW = ReportManager.instance.createReportFromMGW;
    public static updateReport = ReportManager.instance.updateReport;
    public static updateMedia = ReportManager.instance.updateMedia;

    public static readReport = ReportManager.instance.readReport;
    public static readAllReport = ReportManager.instance.readAllReport;
    public static deleteReport = ReportManager.instance.deleteReport;
    public static deleteAllReport = ReportManager.instance.deleteAllReport;


    // endregion API uncions

}
