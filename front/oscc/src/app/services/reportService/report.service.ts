import {Injectable} from '@angular/core';
import {Report} from '../../../../../../classes/dataClasses/report/report';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  ID_OBJ,
  LINKED_REPORT_DATA,
  LOCATION_TYPE,
  REPORT_DATA,
  REPORT_DATA_UI
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
  // locationPoint$: BehaviorSubject<GEOPOINT3D> = new BehaviorSubject({longitude: undefined, latitude: undefined});
  // locationPointTemp: POINT;
  // drawMarkerClass: DrawMarkerClass;
  // downClick: boolean = false;
  // isMarker: boolean = false;

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

  // public setEventCallbacks = () => {
  //   this.mapGeneralService.setMouseOverCallback(undefined, 'reportLocationDraw', this.drawLocation);
  //   this.mapGeneralService.setMouseDownCallback(undefined, 'reportLocationDraw', this.drawLocation);
  //   this.mapGeneralService.setMouseDownCallback(undefined, 'reportLocationEdit', this.editLocation);
  //   this.mapGeneralService.setMouseOverCallback(undefined, 'reportLocationEdit', this.editLocation);
  // };

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
        this.mapGeneralService.removeIcon(data.id);

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
      this.drawReport(newReport);
    });
  };
  // ----------------------
  private drawReport = (report: REPORT_DATA_UI) => {
    if (report.locationType === LOCATION_TYPE.locationPoint && report.location.latitude && report.location.longitude) {
      this.mapGeneralService.createIcon(report.location, report.id, report.modeDefine.styles.icon);
    }
    else {
      this.mapGeneralService.removeIcon(report.id);
    }
  }
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
      const index = report.eventIds.indexOf(eventId);
      if (index !== -1) {
        report.eventIds.splice(index, 1);
        this.createReport(report);
      }
    });
  };
  // -----------------------
  public getReportById = (eventId: string): REPORT_DATA_UI => {
    return this.reports.data.find(data => data.id === eventId);
  };
  // ------------------------
  // public drawLocation = (event: EVENT_LISTENER_DATA): void => {
  //   if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint) {
  //     const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
  //     // open billboard on mouseOver
  //     if (event.type === 'mouseOver') {
  //       this.removeBillboard();
  //       this.drawBillboard(locationPoint);
  //       this.locationPointTemp = undefined;
  //     }
  //     // draw marker on mouseDown
  //     if (event.type === 'mouseDown') {
  //       this.drawLocationFromServer(locationPoint, 'temp');
  //       this.removeBillboard();
  //       this.locationPointTemp = event.pointLatLng;
  //     }
  //     // edit LocationPoint after draw =>
  //     if (this.locationPointTemp !== undefined) {
  //       this.isMarker = false;
  //       this.downClick = false;
  //       this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
  //     }
  //   }
  // };
  //
  // public editLocation = (event: EVENT_LISTENER_DATA): void => {
  //   if (this.applicationService.stateDraw === STATE_DRAW.editLocationPoint) {
  //     const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
  //     // click on marker,(mousedown)
  //     if (event.type === 'mouseDown' && !this.downClick) {
  //       this.isMarker = this.drawMarkerClass.checkIfMarkerExist(event, this.locationPointTemp, event.distance);
  //     }
  //     //  if exist marker, mouseOver on new place
  //     if (event.type === 'mouseOver') {
  //       if (this.isMarker) {
  //         // edit marker location
  //         this.deleteLocationPointTemp();
  //         this.drawLocationFromServer(locationPoint, 'temp');
  //         this.downClick = true;
  //       }
  //     }
  //     // mouseDown on map, close draw
  //     if (event.type === 'mouseDown' && this.downClick) {
  //       // close edit
  //       this.isMarker = false;
  //       this.downClick = false;
  //       this.applicationService.stateDraw = STATE_DRAW.notDraw;
  //       // setTimeout(() => {
  //       //   this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
  //       // }, 500);
  //     }
  //   }
  // };
  //
  // private drawBillboard = (locationPoint: GEOPOINT3D) => {
  //   this.mapGeneralService.createBillboard(locationPoint, 'temp');
  // };
  //
  // public removeBillboard = () => {
  //   this.mapGeneralService.removeBillboard('temp');
  // };
  //
  // public drawLocationFromServer = (locationPoint: GEOPOINT3D, locationId: string) => {
  //   this.mapGeneralService.createLocationPointFromServer(locationPoint, locationId);
  //   this.locationPoint$.next(locationPoint);
  // };
  //
  // public createOrUpdateLocationTemp = (locationPoint: GEOPOINT3D) => {
  //   this.mapGeneralService.createOrUpdateLocationTemp(locationPoint, 'temp');
  // };
  //
  // public deleteLocationPointTemp = () => {
  //   const locationId: string = 'temp';
  //   this.mapGeneralService.deleteLocationPointTemp(locationId);
  //   this.locationPoint$.next({longitude: undefined, latitude: undefined});
  // };

}
