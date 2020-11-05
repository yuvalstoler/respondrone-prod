import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, AV_DATA_UI,
  ID_OBJ,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL} from "../../../types";

@Injectable({
  providedIn: 'root'
})
export class AirVehicleService {

  airVehicles: {data: AV_DATA_UI[]} = {data: []};
  airVehicles$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {

    this.socketService.connectToRoom('webServer_airVehiclesData').subscribe(this.updateAVs);

  }
  // ----------------------
  private updateAVs = (data: AV_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.airVehicles$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: AV_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.airVehicles.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((av: AV_DATA_UI) => {
        const index = this.airVehicles.data.findIndex(d => d.id === av.id);
        this.airVehicles.data.splice(index, 1);
        //TODO: delete data from MAP
        this.mapGeneralService.deleteIcon(av.id);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: AV_DATA_UI[]): void => {
    reportData.forEach((newAirVehicle: AV_DATA_UI) => {
      const existingEvent: AV_DATA_UI = this.getAirVehicleById(newAirVehicle.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newAirVehicle[fieldName];
          }
        }
        this.updateAirVehicle(newAirVehicle);
      } else {
        this.airVehicles.data.push(newAirVehicle);
        this.drawAirVehicle(newAirVehicle);
      }

    });
  };
  // ----------------------
  private drawAirVehicle = (av: AV_DATA_UI) => {
    const label: DRAW_LABEL = {text: av.name, color: _.get(av, 'modeDefine.styles.statusColor')};
    this.mapGeneralService.createIcon(av, label);
  };
  // ----------------------
  private updateAirVehicle = (av: AV_DATA_UI) => {
    const label: DRAW_LABEL = {text: av.name, color: _.get(av, 'modeDefine.styles.statusColor')};
    this.mapGeneralService.updateIcon(av, label);
  };
  // -----------------------
  public getAirVehicleById = (id: string): AV_DATA_UI => {
    return this.airVehicles.data.find(data => data.id === id);
  };
  // ------------------------
  public selectIcon = (event: AV_DATA_UI) => {
    // this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.selectedIcon, 40);
  };
  // ------------------------
  public unselectIcon = (event: AV_DATA_UI) => {
    // this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.icon, 30);
  };

  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };


}
