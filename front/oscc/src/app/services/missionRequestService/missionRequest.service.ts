import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  COMM_RELAY_TYPE, EVENT_DATA_UI,
  GEOPOINT3D_SHORT, LOCATION_TYPE,
  MISSION_REQUEST_ACTION_OBJ,
  MISSION_REQUEST_DATA,
  MISSION_REQUEST_DATA_UI,
  MISSION_ROUTE_DATA,
  MISSION_TYPE,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {ICON_DATA, POLYGON_DATA, POLYLINE_DATA} from '../../../types';


@Injectable({
  providedIn: 'root'
})
export class MissionRequestService {

  missionRequests: { data: MISSION_REQUEST_DATA_UI[] } = {data: []};
  missionRequests$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_missionRequests').subscribe(this.updateMissionRequests);
  }

  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getMissionRequests();
    }
  };
  // ----------------------
  public getMissionRequests = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllMissionRequest, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateMissionRequests(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  public sendMissionRequestAction = (data: MISSION_REQUEST_ACTION_OBJ) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.missionRequestAction, data)
      .then((res: ASYNC_RESPONSE) => {
        if (!res.success) {
          this.toasterService.error({message: 'error changing task status', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error changing task status', title: ''});
      });
  };
  // ----------------------
  private updateMissionRequests = (data: MISSION_REQUEST_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.missionRequests$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: MISSION_REQUEST_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.missionRequests.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: MISSION_ROUTE_DATA) => {
        const index = this.missionRequests.data.findIndex(d => d.id === item.id);
        this.missionRequests.data.splice(index, 1);
        //TODO: delete data from MAP
        // this.mapGeneralService.deleteIcon(item.id);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: MISSION_REQUEST_DATA_UI[]): void => {
    reportData.forEach((newItem: MISSION_REQUEST_DATA_UI) => {
      const existingEvent: MISSION_REQUEST_DATA_UI = this.getById(newItem.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newItem[fieldName];
          }
        }
        for (const fieldName in newItem) {
          if (newItem.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newItem[fieldName];
          }
        }
        this.updateMission(newItem);
      } else {
        this.missionRequests.data.push(newItem);
        this.createMissionOnMap(newItem);
      }
    });
  };
// ----------------------
  private updateMission = (item: MISSION_REQUEST_DATA_UI) => {
    switch (item.missionType) {
      case MISSION_TYPE.Observation : {
        const iconData: ICON_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          location: {
            latitude: item.observationMissionRequest.observationPoint.lat,
            longitude: item.observationMissionRequest.observationPoint.lon,
            altitude: item.observationMissionRequest.observationPoint.alt,
          }
        };
        this.mapGeneralService.updateIcon(iconData);
        break;
      }
      case MISSION_TYPE.CommRelay : {
        if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Fixed) {
          const iconData: ICON_DATA = {
            id: item.id,
            description: item.description,
            modeDefine: item.modeDefine,
            location: {
              latitude: item.commRelayMissionRequest.missionData.point.lat,
              longitude: item.commRelayMissionRequest.missionData.point.lon,
              altitude: item.commRelayMissionRequest.missionData.point.alt,
            }
          };
          this.mapGeneralService.updateIcon(iconData);
        }
        else if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Area) {
          const polygonData: POLYGON_DATA = {
            id: item.id,
            title: '',
            description: item.description,
            modeDefine: item.modeDefine,
            polygon: this.changeCoord(item.commRelayMissionRequest.missionData.area.coordinates)
          };
          this.mapGeneralService.deletePolygonManually(polygonData.id);
          this.mapGeneralService.drawPolygonFromServer(polygonData.polygon, polygonData.id, polygonData.title, polygonData.description);
        }
        break;
      }
      case MISSION_TYPE.Scan : {
        const polygonData: POLYGON_DATA = {
          id: item.id,
          title: '',
          description: item.description,
          modeDefine: item.modeDefine,
          polygon: this.changeCoord(item.scanMissionRequest.polygon.coordinates)
        };
        this.mapGeneralService.deletePolygonManually(polygonData.id);
        this.mapGeneralService.drawPolygonFromServer(polygonData.polygon, polygonData.id, polygonData.title, polygonData.description);
        break;
      }
      case MISSION_TYPE.Servoing : {
        // todo: fr table
        // item.servoingMissionRequest
        break;
      }
      case MISSION_TYPE.Delivery : {
        // todo: point
        const iconData: ICON_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          location: {
            latitude: 0/*item.deliveryMissionRequest.deliveryPoint.lat*/,
            longitude: 0/*item.deliveryMissionRequest.deliveryPoint.lon*/,
            altitude: 0/*item.deliveryMissionRequest.deliveryPoint.alt*/,
          }
        };
        this.mapGeneralService.updateIcon(iconData);
        // item.deliveryMissionRequest
        break;
      }
      case MISSION_TYPE.Patrol : {
        const polylineData: POLYLINE_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          polyline: this.changeCoord(item.followPathMissionRequest.polyline.coordinates)
        };
        this.mapGeneralService.createPolyline(polylineData.polyline, polylineData.id, polylineData.description);
        break;
      }
    }

  };
  // ----------------------
  public createMissionRequest = (missionRequest: MISSION_REQUEST_DATA) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.createMissionRequest, missionRequest)
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  };
  // ----------------------
  private removeAllDataFromMap = () => {
    // TODO edit instead of delete+draw
    this.missionRequests.data.forEach((item: MISSION_REQUEST_DATA_UI) => {

      this.mapGeneralService.deleteIcon(item.id);
      this.mapGeneralService.deletePolygonManually(item.id);

    });
  };
  // ----------------------
  private createMissionOnMap = (item: MISSION_REQUEST_DATA_UI) => {
    switch (item.missionType) {
      case MISSION_TYPE.Observation : {
        const iconData: ICON_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          location: {
            latitude: item.observationMissionRequest.observationPoint.lat,
            longitude: item.observationMissionRequest.observationPoint.lon,
            altitude: item.observationMissionRequest.observationPoint.alt,
          }
        };
        this.mapGeneralService.createIcon(iconData);
        break;
      }
      case MISSION_TYPE.CommRelay : {
        if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Fixed) {
          const iconData: ICON_DATA = {
            id: item.id,
            description: item.description,
            modeDefine: item.modeDefine,
            location: {
              latitude: item.commRelayMissionRequest.missionData.point.lat,
              longitude: item.commRelayMissionRequest.missionData.point.lon,
              altitude: item.commRelayMissionRequest.missionData.point.alt,
            }
          };
          this.mapGeneralService.createIcon(iconData);
        } else if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Area) {
          const polygonData: POLYGON_DATA = {
            id: item.id,
            title: '',
            description: item.description,
            modeDefine: item.modeDefine,
            polygon: this.changeCoord(item.commRelayMissionRequest.missionData.area.coordinates)
          };
          this.mapGeneralService.drawPolygonFromServer(polygonData.polygon, polygonData.id, polygonData.title, polygonData.description);
        }
        break;
      }
      case MISSION_TYPE.Scan : {
        const polygonData: POLYGON_DATA = {
          id: item.id,
          title: '',
          description: item.description,
          modeDefine: item.modeDefine,
          polygon: this.changeCoord(item.scanMissionRequest.polygon.coordinates)
        };
        this.mapGeneralService.drawPolygonFromServer(polygonData.polygon, polygonData.id, polygonData.title, polygonData.description);
        break;
      }
      case MISSION_TYPE.Servoing : {
        // todo: fr table
        // item.servoingMissionRequest
        break;
      }
      case MISSION_TYPE.Delivery : {
        // todo: point
        const iconData: ICON_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          location: {
            latitude: 0/*item.deliveryMissionRequest.deliveryPoint.lat*/,
            longitude: 0/*item.deliveryMissionRequest.deliveryPoint.lon*/,
            altitude: 0/*item.deliveryMissionRequest.deliveryPoint.alt*/,
          }
        };
        this.mapGeneralService.createIcon(iconData);
        // item.deliveryMissionRequest
        break;
      }
      case MISSION_TYPE.Patrol : {
        const polylineData: POLYLINE_DATA = {
          id: item.id,
          description: item.description,
          modeDefine: item.modeDefine,
          polyline: this.changeCoord(item.followPathMissionRequest.polyline.coordinates)
        };
        this.mapGeneralService.createPolyline(polylineData.polyline, polylineData.id, polylineData.description);
        break;
      }
    }
  };

  private changeCoord = (coordinates: GEOPOINT3D_SHORT[]): POINT3D[] => {
    const res: POINT3D[] = [];
    coordinates.forEach(coord => {
      res.push([coord.lon, coord.lat, coord.alt]);
    });
    return res;
  };
  // -----------------------
  public getById = (id: string): MISSION_REQUEST_DATA_UI => {
    return this.missionRequests.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (item: MISSION_REQUEST_DATA_UI) => {
    let coordinates: POINT | POINT3D | POINT3D[];
    switch (item.missionType) {
      case MISSION_TYPE.Observation : {
        coordinates = [
          item.observationMissionRequest.observationPoint.lon,
          item.observationMissionRequest.observationPoint.lat,
          item.observationMissionRequest.observationPoint.alt
        ];
        this.mapGeneralService.flyToObject(coordinates);
        break;
      }
      case MISSION_TYPE.CommRelay : {
        if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Fixed) {
          coordinates = [
            item.commRelayMissionRequest.missionData.point.lon,
            item.commRelayMissionRequest.missionData.point.lat,
            item.commRelayMissionRequest.missionData.point.alt
          ];
          this.mapGeneralService.flyToObject(coordinates);
        }
        else if (item.commRelayMissionRequest.commRelayType === COMM_RELAY_TYPE.Area) {
          coordinates = this.changeCoord(item.commRelayMissionRequest.missionData.area.coordinates);
          this.mapGeneralService.flyToPolygon(coordinates);
        }
        break;
      }
      case MISSION_TYPE.Scan : {
        coordinates = this.changeCoord(item.scanMissionRequest.polygon.coordinates);
        this.mapGeneralService.flyToPolygon(coordinates);
        break;
      }
      case MISSION_TYPE.Servoing : {
        // todo: fr table
        // item.servoingMissionRequest
        break;
      }
      case MISSION_TYPE.Delivery : {
        // todo: point
        // coordinates = [
        //   item.deliveryMissionRequest.deliveryPoint.lon,
        //   item.deliveryMissionRequest.deliveryPoint.lat,
        //   item.deliveryMissionRequest.deliveryPoint.alt
        // ];
        // this.mapGeneralService.flyToObject(coordinates);
        break;
      }
      case MISSION_TYPE.Patrol : {
        coordinates = [
          item.followPathMissionRequest.polyline.coordinates[0].lon,
          item.followPathMissionRequest.polyline.coordinates[0].lat,
          item.followPathMissionRequest.polyline.coordinates[0].alt,
        ];
        this.mapGeneralService.flyToObject(coordinates);
        break;
      }
    }

  };


}
