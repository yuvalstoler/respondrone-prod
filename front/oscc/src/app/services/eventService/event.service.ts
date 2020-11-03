import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  EVENT_DATA,
  EVENT_DATA_UI,
  ID_OBJ,
  LINKED_EVENT_DATA,
  LOCATION_TYPE,
  POINT,
  POINT3D,
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
        // this.deleteIcon(data.id);
        // this.deletePolygon(data.id);
        this.deleteObjectFromMap(data);
      });
    }
  };

  public deleteObjectFromMap = (tempObjectCE) => {
    switch (tempObjectCE.type) {
      case LOCATION_TYPE.none: {
        break;
      }
      case LOCATION_TYPE.address: {
        break;
      }
      case LOCATION_TYPE.polygon: {
        this.deletePolygon(tempObjectCE.id);
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.deleteIcon(tempObjectCE.id);
        break;
      }
    }
  };


  public deleteIcon = (id) => {
    this.mapGeneralService.deleteIcon(id);
  };
  public deletePolygon = (id) => {
    this.mapGeneralService.deletePolygonManually(id);
  };
  // ----------------------
  private updateData = (reportData: EVENT_DATA_UI[]): void => {
    reportData.forEach((newEvent: EVENT_DATA_UI) => {
      let prevLocationType = newEvent.locationType;
      const existingEvent: EVENT_DATA_UI = this.getEventById(newEvent.id);
      if (existingEvent) {
        prevLocationType = existingEvent.locationType;
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newEvent[fieldName];
          }
        }
        this.updateEventOnMap(newEvent, prevLocationType);
      } else {
        this.events.data.push(newEvent);
        this.createEventOnMap(newEvent);
      }

    });
  };
  // ----------------------
  private createEventOnMap = (event: EVENT_DATA_UI) => {
    if (event.locationType === LOCATION_TYPE.locationPoint && event.location && event.location.latitude && event.location.longitude) {
      this.mapGeneralService.createIcon(event);
    } else if (event.locationType === LOCATION_TYPE.polygon && event.polygon && event.polygon.length > 0) {
      this.mapGeneralService.drawPolygonFromServer(event.polygon, event.id, event.title, event.description);
    }

  };

  private updateEventOnMap = (event: EVENT_DATA_UI, prevLocationType: LOCATION_TYPE) => {
    if (event.locationType !== prevLocationType || event.locationType === LOCATION_TYPE.none) {
      this.mapGeneralService.deleteIcon(event.id);
      this.mapGeneralService.deletePolygonManually(event.id);
    }

    if (event.locationType === LOCATION_TYPE.locationPoint && event.location && event.location.latitude && event.location.longitude) {
      this.mapGeneralService.updateIcon(event);
    } else if (event.locationType === LOCATION_TYPE.polygon && event.polygon && event.polygon.length > 0) {
      this.mapGeneralService.drawPolygonFromServer(event.polygon, event.id, event.title, event.description);
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
      if (event) {
        const index = event.reportIds.indexOf(reportId);
        if (index !== -1) {
          event.reportIds.splice(index, 1);
          this.createEvent(event);
        }
      }
    });
  };
  // -----------------------
  public getEventById = (eventId: string): EVENT_DATA_UI => {
    return this.events.data.find(data => data.id === eventId);
  };
  // ------------------------
  public selectIcon = (event: EVENT_DATA_UI) => {
    if (event.locationType === LOCATION_TYPE.locationPoint) {
      this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.selectedIcon, 40);
    }
    else if (event.locationType === LOCATION_TYPE.polygon) {
      // TODO
    }
  };
  // ------------------------
  public unselectIcon = (event: EVENT_DATA_UI) => {
    if (event.locationType === LOCATION_TYPE.locationPoint) {
      this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.mapIcon, 30);
    }
    else if (event.locationType === LOCATION_TYPE.polygon) {
      // TODO
    }

  };

  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

  public flyToPolygon = (coordinates: POINT3D[]) => {
    this.mapGeneralService.flyToPolygon(coordinates);
  };


}
