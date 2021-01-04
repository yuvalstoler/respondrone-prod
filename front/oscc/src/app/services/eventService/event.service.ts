import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  EVENT_DATA,
  EVENT_DATA_UI,
  ID_OBJ, ID_TYPE,
  LINKED_EVENT_DATA,
  LOCATION_TYPE,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {HEADER_BUTTONS, ICON_DATA, ITEM_TYPE, POLYGON_DATA} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {GeoCalculate} from '../classes/geoCalculate';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: {data: EVENT_DATA_UI[]} = {data: []};
  events$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  tempEventObjectCE: {type: LOCATION_TYPE, objectCE: any, id: string, event: EVENT_DATA_UI};
  selectedElement: EVENT_DATA_UI;
  changeSelected$: BehaviorSubject<ID_TYPE> = new BehaviorSubject(undefined);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_eventsData').subscribe(this.updateEvents);

  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
      this.getEvents(isConnected);
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
  private updateEvents = (eventData: EVENT_DATA_UI[]): void => {
    if (Array.isArray(eventData)) {
      this.removeIfNotExist(eventData);
      this.updateData(eventData);
      this.events$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (eventData: EVENT_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.events.data, eventData, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((data: EVENT_DATA_UI) => {
        const index = this.events.data.findIndex(d => d.id === data.id);
        this.events.data.splice(index, 1);
        this.deleteObjectFromMap(data);
      });
    }
  };
// ----------------------
  public deleteObjectFromMap = (data: EVENT_DATA_UI) => {
    switch (data.locationType) {
      case LOCATION_TYPE.address: {
        this.mapGeneralService.deleteIcon(data.id);
        break;
      }
      case LOCATION_TYPE.polygon: {
        this.mapGeneralService.deletePolygonManually(data.id);
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.mapGeneralService.deleteIcon(data.id);
        break;
      }
    }
  };
  // ----------------------
  public hideObjectOnMap = (tempObjectCE) => {
    switch (tempObjectCE.type) {
      case LOCATION_TYPE.address: {
        this.mapGeneralService.hideIcon(tempObjectCE.id);
        break;
      }
      case LOCATION_TYPE.polygon: {
        this.mapGeneralService.deletePolygonManually(tempObjectCE.id);
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.mapGeneralService.hideIcon(tempObjectCE.id);
        break;
      }
    }
  };
  // ----------------------
  public showEventOnMap = (event: EVENT_DATA_UI) => {
    if (this.getType(event) === 'icon') {
      this.mapGeneralService.showIcon(event.id);
    } else if (this.getType(event) === 'polygon') {
      this.createEventOnMap(event);
    }
  };
  // ----------------------
  private updateData = (eventData: EVENT_DATA_UI[]): void => {
    eventData.forEach((newEvent: EVENT_DATA_UI) => {
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
  public createEventOnMap = (event: EVENT_DATA_UI) => {
    if (this.getType(event) === 'icon') {
      const iconData: ICON_DATA = {
        id: event.id,
        modeDefine: event.modeDefine,
        isShow: this.applicationService.screen.showEvents,
        location: GeoCalculate.geopoint3d_to_point3d(event.location),
        optionsData: event,
        type: ITEM_TYPE.event
      };
      this.mapGeneralService.createIcon(iconData);
    } else if (this.getType(event) === 'polygon') {
      const polygonData: POLYGON_DATA = {
        id: event.id,
        modeDefine: event.modeDefine,
        isShow: this.applicationService.screen.showEvents,
        polygon: event.polygon,
        optionsData: event,
        type: ITEM_TYPE.event
      };
      this.mapGeneralService.drawPolygonFromServer(polygonData);
    }

  };
  // ----------------------
  private updateEventOnMap = (event: EVENT_DATA_UI, prevLocationType: LOCATION_TYPE) => {
    if (event.locationType !== prevLocationType || event.locationType === LOCATION_TYPE.none) {
      this.mapGeneralService.deleteIcon(event.id);
      this.mapGeneralService.deletePolygonManually(event.id);
    }
   this.createEventOnMap(event);
  };
  // ----------------------
  public createEvent = (eventData: EVENT_DATA, cb?: Function) => {
    // // delete temp from events
    //
    // if (this.tempEventObjectCE !== undefined) {
    //   const index = this.events.data.findIndex(event => event.id === this.tempEventObjectCE.id);
    //   this.events.data.splice(index, 1);
    //
    //   // this.events.data[index].type = LOCATION_TYPE.none;
    //   // this.events.data[index].polygon = [];
    //   // this.events.data[index].location = {longitude: undefined, latitude: undefined};
    //   // this.events.data[index].address = '';
    //
    //   this.events$.next(true);
    // }
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
  public selectEvent = (event: EVENT_DATA_UI) => {
    if (event) {
      if (this.getType(event) === 'icon' && event.modeDefine.styles.iconSize) {
        const size = {width: event.modeDefine.styles.iconSize.width + 10, height: event.modeDefine.styles.iconSize.height + 10};
        this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.mapIconSelected, size);
      }
      else if (this.getType(event) === 'polygon') {
        const options = {outlineColor: '#ffffff', fillColor: event.modeDefine.styles.fillColor};
        this.mapGeneralService.editPolygonFromServer(event.id, options);
      }
    }
  };
  // ------------------------
  public unselectEvent = (event: EVENT_DATA_UI) => {
    if (event) {
      if (this.getType(event) === 'icon') {
        this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.mapIcon, event.modeDefine.styles.iconSize);
      }
      else if (this.getType(event) === 'polygon') {
        const options = {outlineColor: event.modeDefine.styles.color, fillColor: event.modeDefine.styles.fillColor};
        this.mapGeneralService.editPolygonFromServer(event.id, options);
      }
    }
  };

  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

  public flyToPolygon = (coordinates: POINT3D[]) => {
    this.mapGeneralService.flyToPolygon(coordinates);
  };

  public getType = (event: EVENT_DATA_UI): 'icon' | 'polygon' => {
    if ((event.locationType === LOCATION_TYPE.locationPoint && event.location && event.location.latitude && event.location.longitude) ||
      (event.locationType === LOCATION_TYPE.address && event.location && event.location.latitude && event.location.longitude)) {
      return 'icon';
    } else if (event.locationType === LOCATION_TYPE.polygon && event.polygon && event.polygon.length > 0) {
      return 'polygon';
    }
  };
  // -----------------------
  public hideAll = () => {
    this.events.data.forEach((event: EVENT_DATA_UI) => {
      const type = this.getType(event);
      if (type === 'icon') {
        this.mapGeneralService.hideIcon(event.id);
      }
      else if (type === 'polygon') {
        this.mapGeneralService.hidePolygon(event.id);
      }
    });
  };
  // -----------------------
  public showAll = () => {
    this.events.data.forEach((event: EVENT_DATA_UI) => {
      const type = this.getType(event);
      if (type === 'icon') {
        this.mapGeneralService.showIcon(event.id);
      }
      else if (type === 'polygon') {
        this.mapGeneralService.showPolygon(event.id);
      }
    });
  };
  // -----------------------
  public goToEvent = (id: ID_TYPE) => {
    if (id !== undefined) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showSituationPicture = true;
      // choose missionTab on MissionControl
      this.applicationService.currentTabIndex = 0; /*(0 = Events, 1 = Reports)*/
      //close others
      this.applicationService.screen.showMissionControl = false;
      this.applicationService.screen.showVideo = false;


      setTimeout(() => {
        const item = this.getEventById(id);
        if (item) {
          this.changeSelected$.next(id);
        }
      }, 500);

    }
  };

}
