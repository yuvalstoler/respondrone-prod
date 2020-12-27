import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  FR_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ICON_DATA, ITEM_TYPE} from '../../../types';
import {ApplicationService} from "../applicationService/application.service";


@Injectable({
  providedIn: 'root'
})
export class FRService {

  frs: {data: FR_DATA_UI[]} = {data: []};
  frs$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {

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
      notExist.forEach((fr: FR_DATA_UI) => {
        const index = this.frs.data.findIndex(d => d.id === fr.id);
        this.frs.data.splice(index, 1);
        //TODO: delete data from MAP
        this.mapGeneralService.deleteIcon(this.getId(fr.id));
      });
    }
  };
  // ----------------------
  private updateData = (reportData: FR_DATA_UI[]): void => {
    reportData.forEach((newFR: FR_DATA_UI) => {
      const existingEvent: FR_DATA_UI = this.getFRById(newFR.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newFR[fieldName];
          }
        }
        this.updateFR(newFR);
      } else {
        this.frs.data.push(newFR);
        this.drawFR(newFR);
      }

    });
  };
  // ----------------------
  private drawFR = (fr: FR_DATA_UI) => {
    const iconData: ICON_DATA = {
      id: this.getId(fr.id),
      modeDefine: fr.modeDefine,
      isShow: this.applicationService.screen.showFRLocations,
      location: this.applicationService.geopoint3d_to_point3d(fr.location),
      optionsData: fr,
      type: undefined
    };
    this.mapGeneralService.createIcon(iconData);
  };
  // ----------------------
  private updateFR = (fr: FR_DATA_UI) => {
    this.drawFR(fr);
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

  public flyToObject = (object: FR_DATA_UI) => {
    if (object.location) {
      const coordinates: POINT3D = this.applicationService.geopoint3d_to_point3d(object.location);
      this.mapGeneralService.flyToObject(coordinates);
    }
  };

  // -----------------------
  private getId = (id: string) => { // to make sure the ID is unique
    return 'fr' + id;
  }
  // -----------------------
  public hideAll = () => {
    this.frs.data.forEach((fr: FR_DATA_UI) => {
      this.mapGeneralService.hideIcon(this.getId(fr.id));
    });
  }
  // -----------------------
  public showAll = () => {
    this.frs.data.forEach((fr: FR_DATA_UI) => {
      this.mapGeneralService.showIcon(this.getId(fr.id));
    });
  }

}
