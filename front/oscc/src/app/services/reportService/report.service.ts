import {Injectable} from '@angular/core';
import {Report} from '../../../../../../classes/dataClasses/report/report';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, EVENT_TYPE,
  ID_OBJ, MEDIA_TYPE,
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

    // setTimeout(() => {
    //   this.reports.data.push({
    //     id: '1234',
    //     source: SOURCE_TYPE.OSCC,
    //     time: 1221321423,
    //     type: REPORT_TYPE.attackReport,
    //     createdBy: 'someoneee',
    //     priority: PRIORITY.low,
    //     description: 'blah blahhh',
    //     locationType: undefined,
    //     location: undefined,
    //     eventIds: [],
    //     commentIds: [],
    //     events: [
    //       {
    //         id: '123',
    //         time: 1221321423,
    //         createdBy: 'blah blah',
    //         type: EVENT_TYPE.fireAlarm,
    //         description: 'test description'
    //       }
    //     ],
    //     media: [{
    //       id: '1601525743958.jpg',
    //       thumbnail: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       url: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       type: MEDIA_TYPE.image
    //     }],
    //     comments: [
    //       {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    //     ],
    //     modeDefine: {
    //       styles: {},
    //       tableData: {
    //         message: {type: 'text', data: '3', color: ''},
    //         priority: {type: 'matIcon', data: 'warning', color: '#FF0000'},
    //         link: {type: 'matIcon', data: 'link', color: '#00FF00'},
    //         map: {type: 'matIcon', data: 'location_on', color: '#0000FF'},
    //         attachment: {type: 'matIcon', data: 'attach_file', color: '#000000'},
    //       }
    //     }
    //   });
    //   this.reports$.next(true);
    // }, 7000);
    //
    // setTimeout(() => {
    //   this.reports.data.push({
    //     id: '5678',
    //     source: SOURCE_TYPE.OSCC,
    //     time: 1221321423,
    //     type: REPORT_TYPE.attackReport,
    //     createdBy: 'someoneee someoneeee',
    //     priority: PRIORITY.low,
    //     description: 'blah blahhh',
    //     locationType: undefined,
    //     location: undefined,
    //     eventIds: [],
    //     commentIds: [],
    //     events: [
    //       {
    //         id: '123',
    //         time: 1221321423,
    //         createdBy: 'blah blah',
    //         type: EVENT_TYPE.fireAlarm,
    //         description: 'test description'
    //       }
    //     ],
    //     media: [{
    //       id: '1601525743958.jpg',
    //       thumbnail: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       url: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       type: MEDIA_TYPE.image
    //     }],
    //     comments: [
    //       {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    //     ],
    //     modeDefine: {
    //       styles: {},
    //       tableData: {
    //         message: {type: 'text', data: '5', color: ''},
    //         priority: {type: 'matIcon', data: 'warning', color: '#FF0000'},
    //         link: {type: 'matIcon', data: 'link', color: '#00FF00'},
    //         map: {type: 'matIcon', data: 'location_on', color: '#0000FF'},
    //         attachment: {type: 'matIcon', data: 'attach_file', color: '#000000'},
    //       }
    //     }
    //   });
    //   this.reports$.next(true);
    // }, 14000);
    //
    // setTimeout(() => {
    //   this.reports.data[0] = {
    //     id: '1234',
    //     source: SOURCE_TYPE.MRF,
    //     time: 1221321423,
    //     type: REPORT_TYPE.attackReport,
    //     createdBy: 'someoneee someoneeee',
    //     priority: PRIORITY.low,
    //     description: 'blah blahhh blahhhhh',
    //     locationType: undefined,
    //     location: undefined,
    //     eventIds: [],
    //     commentIds: [],
    //     events: [
    //       {
    //         id: '456',
    //         time: 1221321423,
    //         createdBy: 'blah blah',
    //         type: EVENT_TYPE.fireAlarm,
    //         description: 'test description'
    //       }
    //     ],
    //     media: [{
    //       id: '1601525743958.jpg',
    //       thumbnail: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       url: 'http://localhost:6100/api/file/1601525743958.jpg',
    //       type: MEDIA_TYPE.image
    //     }],
    //     comments: [
    //       {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
    //       {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    //     ],
    //     modeDefine: {
    //       styles: {},
    //       tableData: {
    //         message: {type: 'text', data: '4', color: ''},
    //         priority: {type: 'matIcon', data: 'warning', color: '#FF0000'},
    //         link: {type: 'matIcon', data: 'link', color: '#00FF00'},
    //         map: {type: 'matIcon', data: 'location_on', color: '#0000FF'},
    //         attachment: {type: 'matIcon', data: 'attach_file', color: '#000000'},
    //       }
    //     }
    //   };
    //   this.reports$.next(true);
    // }, 21000);
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
}
