import { Injectable } from '@angular/core';
import {DrawPolylineClass} from '../classes/drawPolylineClass';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ApplicationService} from '../applicationService/application.service';
import {EVENT_LISTENER_DATA, ITEM_TYPE, POLYLINE_DATA, STATE_DRAW} from '../../../types';
import {POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArrowService {

  drawPolylineClass: DrawPolylineClass;
  arrow$: BehaviorSubject<POINT3D[]> = new BehaviorSubject([]);

  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.drawPolylineClass = new DrawPolylineClass();
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    this.mapGeneralService.setMouseDownCallback(undefined, 'arrowDraw', this.drawManually);
    this.mapGeneralService.setMouseOverCallback(undefined, 'arrowDraw', this.drawManually);
    this.mapGeneralService.setDoubleClickCallback(undefined, 'arrowDraw', this.drawManually);
  };

  public drawManually = (event: EVENT_LISTENER_DATA) => {
    if (this.applicationService.stateDraw === STATE_DRAW.drawArrow) {
      const points: POINT3D[] = this.drawPolylineClass.mouseEvents(event);
      const idTemp = this.applicationService.getGeoCounter();

      const arrowData: POLYLINE_DATA = {
        id: idTemp,
        modeDefine: undefined,
        isShow: true,
        polyline: points,
        optionsData: undefined,
        type: undefined
      };
      this.mapGeneralService.createArrowPolyline(arrowData);
      if (event.type === 'doubleClick') {
        this.arrow$.next(points);
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        this.mapGeneralService.changeCursor(false);
      }
    }
  };

  public deleteArrowPolylineManually = (id) => {
    this.mapGeneralService.deleteArrowPolylineFromMap(id);
    this.arrow$.next([]);
    this.drawPolylineClass.arrayPoints = [];
  };



}
