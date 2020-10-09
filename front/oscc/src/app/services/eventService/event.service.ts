import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  EVENT_DATA,
  EVENT_DATA_UI, EVENT_TYPE,
  ID_OBJ, MEDIA_TYPE, PRIORITY, REPORT_TYPE, SOURCE_TYPE,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {Event} from '../../../../../../classes/dataClasses/event/event';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: {data: EVENT_DATA_UI[]} = {data: []};
  events$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_eventsData').subscribe(this.updateEvents);

    // setTimeout(() => {
    //
    //
    //   this.events.data.push({
    //     id: '1234',
    //     title: 'aaa',
    //     time: 1221321423,
    //     type: EVENT_TYPE.fireAlarm,
    //     createdBy: 'someoneee',
    //     priority: PRIORITY.low,
    //     description: 'blah blahhh',
    //     locationType: undefined,
    //     location: undefined,
    //     reportIds: [],
    //     commentIds: [],
    //     reports: [
    //       {
    //         id: '123',
    //         time: 1221321423,
    //         createdBy: 'blah blah',
    //         type: REPORT_TYPE.fireAlarm,
    //         description: 'test description'
    //       }
    //     ],
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
    //       }
    //     }
    //   });
    //   this.events$.next(true);
    // }, 7000);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getEvents();
    }
  };
  // ----------------------
  public getEvents = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/api/readAllEvent', {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateEvents(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateEvents = (reportData: EVENT_DATA_UI[]): void => {
    if (Array.isArray(reportData)) {
      this.removeIfNotExist(reportData);
      this.updateData(reportData);
      this.events$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (reportData: EVENT_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.events.data, reportData, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((data: Event) => {
        const index = this.events.data.findIndex(d => d.id === data.id);
        this.events.data.splice(index, 1);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: EVENT_DATA_UI[]): void => {
    reportData.forEach((newReport: EVENT_DATA_UI) => {
      const existingReport: EVENT_DATA_UI = this.events.data.find(d => d.id === newReport.id);
      if (existingReport) {
        // existingReport.setValues(newReport);
        for (const fieldName in existingReport) {
          if (existingReport.hasOwnProperty(fieldName)) {
            existingReport[fieldName] = newReport[fieldName];
          }
        }
      } else {
        this.events.data.push(newReport);
      }
    });
  }
  // ----------------------
  public createEvent = (eventData: EVENT_DATA) => {
    this.connectionService.post('/api/createEvent', eventData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating event', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating event', title: ''});
      });
  };
  // ----------------------
  public deleteEvent = (idObj: ID_OBJ) => {
    this.connectionService.post('/api/deleteEvent', idObj)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating event', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating event', title: ''});
      });
  };
}
