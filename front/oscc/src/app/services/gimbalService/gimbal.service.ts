import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, GIMBAL_DATA_UI,
  ID_OBJ,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL} from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class GimbalService {

  gimbals: {data: GIMBAL_DATA_UI[]} = {data: []};
  gimbals$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {

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
      notExist.forEach((av: GIMBAL_DATA_UI) => {
        const index = this.gimbals.data.findIndex(d => d.id === av.id);
        this.gimbals.data.splice(index, 1);
      });
    }
  };
  // ----------------------
  private updateData = (newItem: GIMBAL_DATA_UI[]): void => {
    newItem.forEach((newAirVehicle: GIMBAL_DATA_UI) => {
      const existingEvent: GIMBAL_DATA_UI = this.getById(newAirVehicle.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newAirVehicle[fieldName];
          }
        }
        for (const fieldName in newItem) {
          if (newItem.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newItem[fieldName];
          }
        }
      } else {
        this.gimbals.data.push(newAirVehicle);
      }

    });
  };
  // -----------------------
  public getById = (id: string): GIMBAL_DATA_UI => {
    return this.gimbals.data.find(data => data.id === id);
  };
}
