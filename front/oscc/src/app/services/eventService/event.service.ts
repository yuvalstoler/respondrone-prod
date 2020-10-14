import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  EVENT_DATA,
  EVENT_DATA_UI, EVENT_TYPE,
  ID_OBJ, LINKED_EVENT_DATA, LOCATION_TYPE, MEDIA_TYPE, PRIORITY, REPORT_DATA, REPORT_TYPE, SOURCE_TYPE,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: {data: EVENT_DATA_UI[]} = {data: []};
  events$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_eventsData').subscribe(this.updateEvents);

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
      notExist.forEach((data: EVENT_DATA_UI) => {
        const index = this.events.data.findIndex(d => d.id === data.id);
        this.events.data.splice(index, 1);
        //TODO: delete data from MAP
        this.mapGeneralService.deleteIcon(data.id);
        this.mapGeneralService.deletePolygonManually(data.id);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: EVENT_DATA_UI[]): void => {
    reportData.forEach((newEvent: EVENT_DATA_UI) => {
      const existingEvent: EVENT_DATA_UI = this.getEventById(newEvent.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newEvent[fieldName];
          }
        }
      } else {
        this.events.data.push(newEvent);
      }
      this.drawEvent(newEvent);
    });
  };
  // ----------------------
  private drawEvent = (event: EVENT_DATA_UI) => {
    if (event.locationType === LOCATION_TYPE.locationPoint && event.location && event.location.latitude && event.location.longitude) {
      this.mapGeneralService.createIcon(event.location, event.id, event.modeDefine.styles.icon);
    } else if (event.locationType === LOCATION_TYPE.polygon && event.polygon && event.polygon.length > 0) {
      this.mapGeneralService.drawPolygonFromServer(event.polygon, event.id, event.title);
    }
    else {
      this.mapGeneralService.deleteIcon(event.id);
      this.mapGeneralService.deletePolygonManually(event.id);
    }
  };
  // ----------------------
  public createEvent = (eventData: EVENT_DATA, cb?: Function) => {
    this.connectionService.post('/api/createEvent', eventData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating event', title: ''});
        }
        else {
          if (cb) {
            try {
              cb(data.data);
            } catch (e) {}
          }
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
  // -----------------------
  public getLinkedEvent = (eventId): LINKED_EVENT_DATA => {
    const event = this.getEventById(eventId);
    return {
      id: event.id,
      time: event.time,
      createdBy: event.createdBy,
      type: event.type,
      description: event.description,
      idView: event.idView,
      modeDefine: event.modeDefine,
    };
  };
  // -----------------------
  public linkEventsToReport = (eventIds: string[], reportId: string) => {
    eventIds.forEach((eventId: string) => {
      const event = this.getEventById(eventId);
      event.reportIds.push(reportId);
      this.createEvent(event);
    });
  };
  // -----------------------
  public unlinkEventsFromReport = (eventIds: string[], reportId: string) => {
    eventIds.forEach((eventId: string) => {
      const event = this.getEventById(eventId);
      const index = event.reportIds.indexOf(reportId);
      if (index !== -1) {
        event.reportIds.splice(index, 1);
        this.createEvent(event);
      }
    });
  };
  // -----------------------
  public getEventById = (eventId: string): EVENT_DATA_UI => {
    return this.events.data.find(data => data.id === eventId);
  }





}
