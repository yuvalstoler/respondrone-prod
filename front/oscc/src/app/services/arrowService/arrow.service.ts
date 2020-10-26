import { Injectable } from '@angular/core';
import {DrawPolylineClass} from '../classes/drawPolylineClass';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ApplicationService} from '../applicationService/application.service';
import {EVENT_LISTENER_DATA, STATE_DRAW} from '../../../types';
import {POINT} from '../../../../../../classes/typings/all.typings';

@Injectable({
  providedIn: 'root'
})
export class ArrowService {

  drawPolylineClass: DrawPolylineClass;

  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.drawPolylineClass = new DrawPolylineClass();
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    this.mapGeneralService.setMouseDownCallback(undefined, 'arrowDraw', this.drawManually);
    this.mapGeneralService.setMouseOverCallback(undefined, 'arrowDraw', this.drawManually);
    this.mapGeneralService.setDoubleClickCallback(undefined, 'arrowDraw', this.drawManually);
    // this.mapGeneralService.setMouseDownCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setMouseOverCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setDoubleClickCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setMouseUpCallback(undefined, 'routePolylineSelect', this.selectEditRoute);
  };

  public drawManually = (event: EVENT_LISTENER_DATA) => {
    if (this.applicationService.stateDraw === STATE_DRAW.drawArrow) {
      const points: POINT[] = this.drawPolylineClass.mouseEvents(event);
      const idTemp = this.applicationService.geoCounter.toString();
      this.mapGeneralService.createArrowPolyline(points, idTemp);
      if (event.type === 'doubleClick') {
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
      }
    }
  };

  public deleteArrowPolylineManually = (id) => {
    this.mapGeneralService.deleteArrowPolylineFromMap(id);
  };



}
