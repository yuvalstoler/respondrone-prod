import { Injectable } from '@angular/core';
import {ApplicationService} from '../../applicationService/application.service';
import {MapGeneralService} from '../../mapGeneral/map-general.service';
import {EVENT_LISTENER_DATA, OPTIONS_ENTITY} from '../../../../types';
import {GEOPOINT3D} from '../../../../../../../classes/typings/all.typings';

@Injectable({
  providedIn: 'root'
})
export class ListenerMapService {

  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    // show billboard
    this.mapGeneralService.setMouseOverCallback(undefined, 'billboardDraw', this.showBillboard);
    this.mapGeneralService.setMouseOverCallback(undefined, 'cursorPosition', this.showCursorPosition);
    };

  public showBillboard = (event: EVENT_LISTENER_DATA) => {
    // if (this.applicationService.stateDraw === STATE_DRAW.drawBillboard) {
      const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
      const options: OPTIONS_ENTITY = event.object;
      if (event.type === 'mouseOver') {
        this.removeBillboard();
        this.drawBillboard(locationPoint, options);
      }

    // }
  };

  public showCursorPosition = (event: EVENT_LISTENER_DATA) => {
    this.applicationService.cursorPosition = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
  };

  removeBillboard = () => {
    const billboardId = 'temp';
    this.mapGeneralService.removeBillboard(billboardId);
  };

  drawBillboard = (locationPoint: GEOPOINT3D, options: OPTIONS_ENTITY) => {
    const billboardId = 'temp';
    this.mapGeneralService.createBillboard(locationPoint, billboardId, options);
  };

}
