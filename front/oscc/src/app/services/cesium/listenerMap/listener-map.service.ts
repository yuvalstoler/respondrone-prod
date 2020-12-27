import { Injectable } from '@angular/core';
import {ApplicationService} from '../../applicationService/application.service';
import {MapGeneralService} from '../../mapGeneral/map-general.service';
import {EVENT_LISTENER_DATA, OPTIONS_ENTITY} from '../../../../types';
import {GEOPOINT3D} from '../../../../../../../classes/typings/all.typings';
import {CesiumService} from '../cesium.service';

@Injectable({
  providedIn: 'root'
})
export class ListenerMapService {

  constructor(public mapGeneralService: MapGeneralService,
              public cesiumService: CesiumService,
              public applicationService: ApplicationService) {
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    // show billboard
    this.mapGeneralService.setMouseOverCallback(undefined, 'hoverTextDraw', this.showHoverText);
    this.mapGeneralService.setMouseOverCallback(undefined, 'cursorPosition', this.showCursorPosition);
    this.mapGeneralService.setMouseDownCallback(undefined, 'showItemOnTable', this.showItemOnTable);
    };

  public showHoverText = (event: EVENT_LISTENER_DATA) => {
    if (event.object && event.object.hoverText && event.type === 'mouseOver') {
      const screenPosition = this.cesiumService.latLonToScreenPosition(event.pointLatLng);
      this.applicationService.hoverTextData = {
        top: (screenPosition.y + 90) + 'px',
        left: `calc(50vw + ${screenPosition.x}px)`,
        text: event.object.hoverText
      }
    }
    else {
      this.applicationService.hoverTextData = undefined;
    }
  };

  public showItemOnTable = (event: EVENT_LISTENER_DATA) => {

  };

  // public showBillboard = (event: EVENT_LISTENER_DATA) => {
  //   // if (this.applicationService.stateDraw === STATE_DRAW.drawBillboard) {
  //     const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1], altitude: 0};
  //     const options: OPTIONS_ENTITY = event.object;
  //     if (event.type === 'mouseOver') {
  //       this.removeBillboard();
  //       this.drawBillboard(locationPoint, options);
  //     }
  //
  //   // }
  // };

  public showCursorPosition = (event: EVENT_LISTENER_DATA) => {
    this.applicationService.cursorPosition = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1], altitude: 0};
  };

  // removeBillboard = () => {
  //   const billboardId = 'temp';
  //   this.mapGeneralService.removeBillboard(billboardId);
  // };
  //
  // drawBillboard = (locationPoint: GEOPOINT3D, options: OPTIONS_ENTITY) => {
  //   const billboardId = 'temp';
  //   this.mapGeneralService.createBillboard(locationPoint, billboardId, options);
  // };

}
