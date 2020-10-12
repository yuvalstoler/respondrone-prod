import {Injectable} from '@angular/core';
import {Report} from '../../../../../../classes/dataClasses/report/report';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, EVENT_TYPE,
  ID_OBJ, LINKED_REPORT_DATA, MEDIA_TYPE,
  PRIORITY,
  REPORT_DATA,
  REPORT_DATA_UI,
  REPORT_TYPE,
  SOURCE_TYPE
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reports: {data: REPORT_DATA_UI[]} = {data: []};
  reports$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_reportsData').subscribe(this.updateReports);

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
      notExist.forEach((data: Report) => {
        const index = this.reports.data.findIndex(d => d.id === data.id);
        this.reports.data.splice(index, 1);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: REPORT_DATA_UI[]): void => {
    reportData.forEach((newReport: REPORT_DATA_UI) => {
      const existingReport: REPORT_DATA_UI = this.reports.data.find(d => d.id === newReport.id);
      if (existingReport) {
        // existingReport.setValues(newReport);
        for (const fieldName in existingReport) {
          if (existingReport.hasOwnProperty(fieldName)) {
            existingReport[fieldName] = newReport[fieldName];
          }
        }
      } else {
        this.reports.data.push(newReport);
      }
    });
  }
  // ----------------------
  public createReport = (reportData: REPORT_DATA) => {
    this.connectionService.post('/api/createReport', reportData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating report', title: ''});
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
    };
  }
  // -----------------------
  public linkReportsToEvent = (reportIds: string[], eventId: string) => {
    reportIds.forEach((reportId: string) => {
      const report = this.getReportById(reportId);
      report.eventIds.push(eventId);
      this.createReport(report);
    });
  }
  // -----------------------
  public unlinkReportsFromEvent = (reportIds: string[], eventId: string) => {
    reportIds.forEach((reportId: string) => {
      const report = this.getReportById(reportId);
      const index = report.eventIds.indexOf(eventId);
      if (index !== -1) {
        report.eventIds.splice(index, 1);
        this.createReport(report);
      }
    });
  }
  // -----------------------
  public getReportById = (eventId: string): REPORT_DATA_UI => {
    return this.reports.data.find(data => data.id === eventId);
  }
}
