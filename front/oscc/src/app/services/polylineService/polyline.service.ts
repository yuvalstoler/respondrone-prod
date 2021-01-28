import { Injectable } from '@angular/core';
import {DrawPolylineClass} from '../classes/drawPolylineClass';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {EVENT_LISTENER_DATA, ITEM_TYPE, POLYLINE_DATA, STATE_DRAW} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolylineService {

  drawPolylineClass: DrawPolylineClass;
  polyline$: BehaviorSubject<POINT3D[]> = new BehaviorSubject([]);

  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.drawPolylineClass = new DrawPolylineClass();
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    this.mapGeneralService.setMouseDownCallback(undefined, 'polylineDraw', this.drawManually);
    this.mapGeneralService.setMouseOverCallback(undefined, 'polylineDraw', this.drawManually);
    this.mapGeneralService.setDoubleClickCallback(undefined, 'polylineDraw', this.drawManually);
    // this.mapGeneralService.setMouseDownCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setMouseOverCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setDoubleClickCallback(undefined, 'routePolylineEdit', this.editManually);
    // this.mapGeneralService.setMouseUpCallback(undefined, 'routePolylineSelect', this.selectEditRoute);
  };

  public drawManually = (event: EVENT_LISTENER_DATA) => {
    if (this.applicationService.stateDraw === STATE_DRAW.drawPolyline) {
      const points: POINT3D[] = this.drawPolylineClass.mouseEvents(event);
      const idTemp = this.applicationService.getGeoCounter();
      const polylineData: POLYLINE_DATA = {
        id: idTemp,
        modeDefine: undefined,
        isShow: true,
        polyline: points,
        optionsData: undefined,
        type: undefined
      };
      this.mapGeneralService.createPolyline(polylineData);
      if (event.type === 'doubleClick' && points.length >= 3) {
        this.polyline$.next(points);
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        this.mapGeneralService.changeCursor(false);
      }
    }
  };

  public deletePolylineManually = (polylineId) => {
    this.mapGeneralService.deletePolylineFromMap(polylineId);
    this.polyline$.next([]);
    this.drawPolylineClass.arrayPoints = [];
  };



}
