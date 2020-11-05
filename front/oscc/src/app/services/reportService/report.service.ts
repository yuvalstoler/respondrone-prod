import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, EVENT_DATA_UI,
  ID_OBJ,
  LINKED_REPORT_DATA,
  LOCATION_TYPE,
  REPORT_DATA,
  REPORT_DATA_UI,
  SOURCE_TYPE
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {ApplicationService} from '../applicationService/application.service';
import {MapGeneralService} from '../mapGeneral/map-general.service';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reports: { data: REPORT_DATA_UI[] } = {data: []};
  reports$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  tempReportObjectCE: {type: LOCATION_TYPE, objectCE: any, id: string, report: REPORT_DATA_UI};

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private applicationService: ApplicationService,
              private mapGeneralService: MapGeneralService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_reportsData').subscribe(this.updateReports);
    // this.setEventCallbacks();
    // this.drawMarkerClass = new DrawMarkerClass();

  }

  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getReports();
    }
  };
  // ----------------------
  public getReports = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/api/readAllReport', {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateReports(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateReports = (reportData: REPORT_DATA_UI[]): void => {
    if (Array.isArray(reportData)) {
      this.removeIfNotExist(reportData);
      this.updateData(reportData);
      this.reports$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (reportData: REPORT_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.reports.data, reportData, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((data: REPORT_DATA_UI) => {
        const index = this.reports.data.findIndex(d => d.id === data.id);
        this.reports.data.splice(index, 1);
        this.deleteObjectFromMap(data);
      });
    }
  };
  // ----------------------
  public deleteObjectFromMap = (data: REPORT_DATA_UI) => {
    switch (data.type) {
      case LOCATION_TYPE.address: {
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.mapGeneralService.deleteIcon(data.id);
        break;
      }
    }
  };
  // ----------------------
  private updateData = (reportData: REPORT_DATA_UI[]): void => {
    reportData.forEach((newReport: REPORT_DATA_UI) => {
      let prevLocationType = newReport.locationType;
      const existingReport: REPORT_DATA_UI = this.reports.data.find(d => d.id === newReport.id);
      if (existingReport) {
        prevLocationType = existingReport.locationType;
        // existingReport.setValues(newReport);
        for (const fieldName in existingReport) {
          if (existingReport.hasOwnProperty(fieldName)) {
            existingReport[fieldName] = newReport[fieldName];
          }
        }
        this.updateReportOnMap(newReport, prevLocationType);
      } else {
        this.reports.data.push(newReport);
        this.createReportOnMap(newReport);
        if (newReport.source === SOURCE_TYPE.MRF && (Date.now() - newReport.time) < 1000 * 60 * 5) {
          this.toasterService.info({message: 'Report added from FR', title: ''});
        }
      }
    });
  };
  // ----------------------
  public hideObjectOnMap = (tempObjectCE) => {
    switch (tempObjectCE.type) {
      case LOCATION_TYPE.address: {
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.mapGeneralService.hideIcon(tempObjectCE.id);
        break;
      }
    }
  };
  // ----------------------
  public showReportOnMap = (report: REPORT_DATA_UI) => {
    if (report.locationType === LOCATION_TYPE.locationPoint && report.location && report.location.latitude && report.location.longitude) {
      this.mapGeneralService.showIcon(report.id);
    }
  };
  // ----------------------
  private createReportOnMap = (report: REPORT_DATA_UI) => {
    if (report.locationType === LOCATION_TYPE.locationPoint && report.location.latitude && report.location.longitude) {
      this.mapGeneralService.createIcon(report);
    }
  };
  // ----------------------
  private updateReportOnMap = (report: REPORT_DATA_UI, prevLocationType: LOCATION_TYPE) => {
    if (report.locationType !== prevLocationType || report.locationType === LOCATION_TYPE.none) {
      this.mapGeneralService.deleteIcon(report.id);
    }
    if (report.locationType === LOCATION_TYPE.locationPoint && report.location.latitude && report.location.longitude) {
      this.mapGeneralService.updateIcon(report);
    }
  };
  // ----------------------
  public createReport = (reportData: REPORT_DATA, cb?: Function) => {
    this.connectionService.post('/api/createReport', reportData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating report', title: ''});
        } else {
          if (cb) {
            try {
              cb(data.data);
            } catch (e) {
            }
          }
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating report', title: ''});
      });
  };
  // ----------------------
  public deleteReport = (idObj: ID_OBJ) => {
    this.connectionService.post('/api/deleteReport', idObj)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error deleting report', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error deleting report', title: ''});
      });
  };
  // -----------------------
  public getLinkedReport = (reportId: string): LINKED_REPORT_DATA => {
    const report = this.getReportById(reportId);
    return {
      id: report.id,
      time: report.time,
      createdBy: report.createdBy,
      type: report.type,
      description: report.description,
      idView: report.idView,
      modeDefine: report.modeDefine,
    };
  };
  // -----------------------
  public linkReportsToEvent = (reportIds: string[], eventId: string) => {
    reportIds.forEach((reportId: string) => {
      const report = this.getReportById(reportId);
      report.eventIds.push(eventId);
      this.createReport(report);
    });
  };
  // -----------------------
  public unlinkReportsFromEvent = (reportIds: string[], eventId: string) => {
    reportIds.forEach((reportId: string) => {
      const report = this.getReportById(reportId);
      if (report) {
        const index = report.eventIds.indexOf(eventId);
        if (index !== -1) {
          report.eventIds.splice(index, 1);
          this.createReport(report);
        }
      }
    });
  };
  // -----------------------
  public getReportById = (eventId: string): REPORT_DATA_UI => {
    return this.reports.data.find(data => data.id === eventId);
  };
  // ------------------------
  public selectIcon = (report: REPORT_DATA_UI) => {
    this.mapGeneralService.editIcon(report.id, report.modeDefine.styles.selectedIcon, 40);
  };
  // ------------------------
  public unselectIcon = (report: REPORT_DATA_UI) => {
    this.mapGeneralService.editIcon(report.id, report.modeDefine.styles.mapIcon, 30);
  };

}
