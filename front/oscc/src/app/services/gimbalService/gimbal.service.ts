import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, GEOPOINT3D_SHORT, GIMBAL_ACTION, GIMBAL_DATA_UI,
  ID_OBJ, MAP, MISSION_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL, ICON_DATA} from '../../../types';
import {ApplicationService} from "../applicationService/application.service";
import {API_GENERAL, WS_API} from "../../../../../../classes/dataClasses/api/api_enums";

@Injectable({
  providedIn: 'root'
})
export class GimbalService {

  gimbals: {data: GIMBAL_DATA_UI[]} = {data: []};
  gimbalsByDroneId: MAP<GIMBAL_DATA_UI> = {}
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
      });
    }
  };
  // ----------------------
  private updateData = (newItemArr: GIMBAL_DATA_UI[]): void => {
    newItemArr.forEach((newItem: GIMBAL_DATA_UI) => {
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
      this.gimbalsByDroneId[newItem.droneId] = newItem

      this.removeFromMap(newItem);
      this.drawMission(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: GIMBAL_DATA_UI) => {
    if (item.cameraLookAtPoint) {
      this.mapGeneralService.deleteIcon('gimbal' + item.id);
    }

    if (item.lineFromAirVehicle) {
      this.mapGeneralService.deletePolylineFromMap('gimbal' + item.id);
    }
  }
  // ----------------------
  private drawMission = (item: GIMBAL_DATA_UI) => {
    // icons
    if (item.cameraLookAtPoint) {
      // TODO change
      const iconData: ICON_DATA = {
        id: 'gimbal' + item.id,
        description: undefined,
        modeDefine: item.modeDefine,
        location: {
          latitude: item.cameraLookAtPoint.lat,
          longitude: item.cameraLookAtPoint.lon,
          altitude: item.cameraLookAtPoint.alt,
        }
      }

      this.mapGeneralService.createIcon(iconData);
    }

    if (item.lineFromAirVehicle) {
      const polygon: POINT3D[] = this.applicationService.geopoint3d_short_to_point3d_arr(item.lineFromAirVehicle);
      this.mapGeneralService.createPolyline(polygon, 'gimbal' + item.id, undefined, undefined);
    }
  };
  // -----------------------
  public sendGimbalAction = (gimbalAction: GIMBAL_ACTION) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.gimbalAction, {})
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
}
