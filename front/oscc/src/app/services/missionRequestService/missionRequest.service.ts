import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  COMM_RELAY_MISSION_REQUEST,
  COMM_RELAY_TYPE,
  DELIVERY_MISSION_REQUEST,
  FOLLOW_PATH_MISSION_REQUEST,
  GEOPOINT3D_SHORT,
  ID_TYPE,
  LAST_ACTION,
  MISSION_MODEL_UI,
  MISSION_REQUEST_ACTION_OBJ,
  MISSION_REQUEST_DATA,
  MISSION_REQUEST_DATA_UI,
  MISSION_ROUTE_DATA,
  MISSION_STATUS,
  MISSION_STATUS_UI,
  MISSION_TYPE,
  OBSERVATION_MISSION_REQUEST,
  POINT,
  POINT3D,
  SCAN_MISSION_REQUEST,
  SERVOING_MISSION_REQUEST,
  SOURCE_TYPE,
  TARGET_TYPE,
  YAW_ORIENTATION,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {HEADER_BUTTONS, ICON_DATA, POLYGON_DATA, POLYLINE_DATA} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';


@Injectable({
  providedIn: 'root'
})
export class MissionRequestService {

  missionRequests: { data: MISSION_REQUEST_DATA_UI[] } = {data: []};
  missionRequests$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  changeSelected$: BehaviorSubject<ID_TYPE> = new BehaviorSubject(undefined);


  constructor(private connectionService: ConnectionService,
              public applicationService: ApplicationService,
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
        this.mapGeneralService.deleteIcon(item.id);
        this.mapGeneralService.deletePolygonManually(item.id);
        this.mapGeneralService.deletePolylineFromMap(item.id);
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
      .then((res: ASYNC_RESPONSE) => {
        if (!res.success) {
          this.toasterService.error({message: 'Error creating mission request ' + JSON.stringify(res.data), title: ''});
          console.log(res);
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'Error creating mission request ' + JSON.stringify(e), title: ''});
        console.log(e);
      });
  };
  // ----------------------
  public updateMissionInDB = (missionRequest: MISSION_REQUEST_DATA) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.updateMissionInDB, missionRequest)
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
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
  // ----------------------
  private changeCoord = (coordinates: GEOPOINT3D_SHORT[]): POINT3D[] => {
    return this.applicationService.geopoint3d_short_to_point3d_arr(coordinates);
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
  // ----------------------
  createObservationMission = (missionModel: MISSION_MODEL_UI) => {
    const observationMissionRequest: OBSERVATION_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      observationPoint: missionModel.location,
      observationAzimuth: missionModel.missionDetails.azimuth,
      altitudeOffset: missionModel.missionDetails.distance
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Observation,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      observationMissionRequest: observationMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  createScanMission = (missionModel: MISSION_MODEL_UI) => {
    const scanMissionRequest: SCAN_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      scanSpeed: missionModel.missionDetails.scan.speed,
      scanAngle: missionModel.missionDetails.azimuth,
      polygon: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polygon)},
      overlapPercent: missionModel.missionDetails.scan.overlapPercent,
      cameraFOV: missionModel.missionDetails.scan.cameraFov,
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Scan,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      scanMissionRequest: scanMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  createPatrolMission = (missionModel: MISSION_MODEL_UI) => {
    const patrolMissionRequest: FOLLOW_PATH_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      yawOrientation: YAW_ORIENTATION.North,                                  // TODO
      gimbalAzimuth: missionModel.missionDetails.azimuth,
      polyline: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polyline)},
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Patrol,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      followPathMissionRequest: patrolMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  createCommRelayMission = (missionModel: MISSION_MODEL_UI) => {
    const commRelayMissionRequest: COMM_RELAY_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      commRelayType: missionModel.communicationType,
      missionData: undefined,
    };

    if (missionModel.communicationType === COMM_RELAY_TYPE.Fixed) {
      commRelayMissionRequest.missionData = {point: missionModel.location};
    }
    else if (missionModel.communicationType === COMM_RELAY_TYPE.Area) {
      commRelayMissionRequest.missionData = {area: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polygon)}};
    }
    if (missionModel.communicationType === COMM_RELAY_TYPE.Follow) {
      commRelayMissionRequest.missionData = {FRs: missionModel.frIds};
    }
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.CommRelay,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      commRelayMissionRequest: commRelayMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  createServoingMission = (missionModel: MISSION_MODEL_UI) => {

    const servoingMissionRequest: SERVOING_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      targetId: missionModel.frIds[0],
      targetType: TARGET_TYPE.FR
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Servoing,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      servoingMissionRequest: servoingMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  createDeliveryMission = (missionModel: MISSION_MODEL_UI) => {
    const deliveryMissionRequest: DELIVERY_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Delivery,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      deliveryMissionRequest: deliveryMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      source: SOURCE_TYPE.OSCC,
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.createMissionRequest(missionRequest);
  };

  // ----------------------
  // private removeAllDataFromMap = () => {
  //   this.missionRequests.data.forEach((item: MISSION_REQUEST_DATA_UI) => {
  //
  //     this.mapGeneralService.deleteIcon(item.id);
  //     this.mapGeneralService.deletePolygonManually(item.id);
  //     this.mapGeneralService.deletePolylineFromMap(item.id);
  //   });
  // };
  // ----------------------

  public goToMissionRequest = (missionRequestId: ID_TYPE) => {
    if (missionRequestId !== undefined) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showMissionControl = true;
      // choose missionTab on MissionControl
      this.applicationService.currentTabIndex = 1; /*(0 = TaskTab, 1 = MissionTab)*/
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;


      setTimeout(() => {
        const missionRequest = this.getById(missionRequestId);
        this.applicationService.selectedMissionRequests.length = 0;
        this.applicationService.selectedMissionRequests.push(missionRequest);
        this.changeSelected$.next(missionRequestId);
      }, 500);

    }
  }
}
