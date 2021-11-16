import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  FR_DATA_UI,
  GEOPOINT3D_SHORT, GIMBAL_ACTION_OSCC,
  GIMBAL_CONTROL_ACTION,
  GIMBAL_CONTROL_REQUEST_OSCC,
  GIMBAL_DATA_UI,
  ID_OBJ,
  MAP,
  MISSION_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ICON_DATA, ITEM_TYPE, POLYGON_DATA, POLYLINE_DATA} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {GeoCalculate} from '../classes/geoCalculate';

@Injectable({
  providedIn: 'root'
})
export class GimbalService {

  gimbals: {data: GIMBAL_DATA_UI[]} = {data: []};
  gimbalsByDroneId: MAP<GIMBAL_DATA_UI> = {};
  gimbals$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {

    this.socketService.connectToRoom('webServer_gimbalsData').subscribe(this.updateAVs);

  }

  // ----------------------
  private updateAVs = (data: GIMBAL_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.gimbals$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: GIMBAL_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.gimbals.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((gimbal: GIMBAL_DATA_UI) => {
        const index = this.gimbals.data.findIndex(d => d.id === gimbal.id);
        this.gimbals.data.splice(index, 1);
        delete this.gimbalsByDroneId[gimbal.droneId];
        this.removeFromMap(gimbal);
      });
    }
  };
  // ----------------------
  private updateData = (newItemArr: GIMBAL_DATA_UI[]): void => {
    newItemArr.forEach((newItem: GIMBAL_DATA_UI) => {
      newItem.opticalVideoURL = 'ws://iai-video-restream.simplex-c2.com:18082'; // TODO change!!!
      newItem.infraredVideoURL = 'ws://iai-video-restream.simplex-c2.com:18084';

      const existingEvent: GIMBAL_DATA_UI = this.getById(newItem.id);
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
      } else {
        this.gimbals.data.push(newItem);
      }
      this.gimbalsByDroneId[newItem.droneId] = newItem;

      // this.removeFromMap(newItem);
      this.drawMission(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: GIMBAL_DATA_UI) => {
    if (item.cameraLookAtPoint) {
      this.mapGeneralService.deleteIcon(this.getId(item.id));
    }

    if (item.cameraFootprint) {
      this.mapGeneralService.deletePolygonManually(this.getId(item.id));
    }

    if (item.lineFromAirVehicle) {
      this.mapGeneralService.deletePolylineFromMap(this.getId(item.id));
    }
  };
  // ----------------------
  private drawMission = (item: GIMBAL_DATA_UI) => {
    if (item.cameraLookAtPoint) {
      // TODO change
      const iconData: ICON_DATA = {
        id: this.getId(item.id),
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showUAV,
        location: GeoCalculate.geopoint3d_short_to_point3d(item.cameraLookAtPoint),
        optionsData: item,
        type: undefined
      };
      this.mapGeneralService.createIcon(iconData);
    }
    if (item.cameraFootprint) {
      const polygonData: POLYGON_DATA = {
        id: this.getId(item.id),
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showUAV,
        polygon: GeoCalculate.geopoint3d_short_to_point3d_arr(item.cameraFootprint.coordinates),
        optionsData: item,
        type: undefined
      };
      this.mapGeneralService.drawPolygonFromServer(polygonData);
    }
    if (item.lineFromAirVehicle) {
      const polylineData: POLYLINE_DATA = {
        id: this.getId(item.id),
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showUAV,
        polyline: GeoCalculate.geopoint3d_short_to_point3d_arr(item.lineFromAirVehicle),
        optionsData: item,
        type: undefined
      };
      this.mapGeneralService.createPolyline(polylineData);
    }
  };
  // -----------------------
  public sendGimbalAction = (gimbalAction: GIMBAL_ACTION_OSCC) => {
    this.connectionService.post(`/${API_GENERAL.general}${WS_API.gimbalActionFromOSCC}`, gimbalAction)
      .then((data: ASYNC_RESPONSE) => {
        if (data.description) {
          this.toasterService.error({title: '', message: data.description, options: {positionClass: 'toast-top-right', timeOut: 5000}});
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  // -----------------------
  public sendGimbalControlRequest = (controlRequest: GIMBAL_CONTROL_REQUEST_OSCC) => {
    this.connectionService.post(`/${API_GENERAL.general}${WS_API.requestGimbalControlFromOSCC}`, controlRequest)
      .then((data) => {
      })
      .catch(e => {
        console.log(e);
      });
  }
  // -----------------------
  public getById = (id: string): GIMBAL_DATA_UI => {
    return this.gimbals.data.find(data => data.id === id);
  };
  // -----------------------
  public getGimbalByDroneId = (id: string): GIMBAL_DATA_UI => {
    return this.gimbalsByDroneId[id];
  };
  // -----------------------
  private getId = (id: string) => { // to make sure the ID is unique
    return 'gimbal' + id;
  };

  // -----------------------
  public hideAll = () => {
    this.gimbals.data.forEach((item: GIMBAL_DATA_UI) => {
      if (item.cameraLookAtPoint) {
        this.mapGeneralService.hideIcon(this.getId(item.id));
      }
      if (item.cameraFootprint) {
        this.mapGeneralService.hidePolygon(this.getId(item.id));
      }
      if (item.lineFromAirVehicle) {
        this.mapGeneralService.hidePolyline(this.getId(item.id));
      }
    });
  };
  // -----------------------
  public showAll = () => {
    this.gimbals.data.forEach((item: GIMBAL_DATA_UI) => {
      if (item.cameraLookAtPoint) {
        this.mapGeneralService.showIcon(this.getId(item.id));
      }
      if (item.cameraFootprint) {
        this.mapGeneralService.showPolygon(this.getId(item.id));
      }
      if (item.lineFromAirVehicle) {
        this.mapGeneralService.showPolyline(this.getId(item.id));
      }
    });
  };

}
