import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE,
  FR_DATA_UI,
  ID_OBJ,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';


@Injectable({
  providedIn: 'root'
})
export class FRService {

  frs: {data: FR_DATA_UI[]} = {data: []};
  frs$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {

    this.socketService.connectToRoom('webServer_frsData').subscribe(this.updateFRs);

  }
  // ----------------------
  private updateFRs = (data: FR_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.frs$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: FR_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.frs.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((data: FR_DATA_UI) => {
        const index = this.frs.data.findIndex(d => d.id === data.id);
        this.frs.data.splice(index, 1);
        //TODO: delete data from MAP
        this.mapGeneralService.deleteIcon(data.id);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: FR_DATA_UI[]): void => {
    reportData.forEach((newEvent: FR_DATA_UI) => {
      const existingEvent: FR_DATA_UI = this.getFRById(newEvent.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newEvent[fieldName];
          }
        }
      } else {
        this.frs.data.push(newEvent);
      }
      this.drawFR(newEvent);
    });
  };
  // ----------------------
  private drawFR = (fr: FR_DATA_UI) => {
    this.mapGeneralService.createIcon(fr.location, fr.id, fr.modeDefine.styles.icon, 40, {text: fr.callSign, color: fr.modeDefine.styles.color});
  };
  // -----------------------
  public getFRById = (id: string): FR_DATA_UI => {
    return this.frs.data.find(data => data.id === id);
  };
  // ------------------------
  public selectIcon = (event: FR_DATA_UI) => {
    // this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.selectedIcon, 40);
  };
  // ------------------------
  public unselectIcon = (event: FR_DATA_UI) => {
    // this.mapGeneralService.editIcon(event.id, event.modeDefine.styles.icon, 30);
  };

  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };


}
