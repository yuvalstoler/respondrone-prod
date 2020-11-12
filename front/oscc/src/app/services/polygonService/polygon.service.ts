import {Injectable} from '@angular/core';
import {DrawPolygonClass} from '../classes/drawPolygonClass';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {EVENT_LISTENER_DATA, STATE_DRAW} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {POINT3D} from '../../../../../../classes/typings/all.typings';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {

  drawerPolygonClass: DrawPolygonClass;
  isCross: boolean = false;
  polygon$: BehaviorSubject<POINT3D[]> = new BehaviorSubject([]);

  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.drawerPolygonClass = new DrawPolygonClass();
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    // // show billboard
    // this.mapGeneralService.setMouseOverCallback(undefined, 'billboardDraw', this.showBillboard);
    // this.mapGeneralService.setMouseDownCallback(undefined, 'billboardDraw', this.showBillboard);
    // create polygon
    this.mapGeneralService.setMouseDownCallback(undefined, 'perimeterDraw', this.drawManually);
    this.mapGeneralService.setMouseOverCallback(undefined, 'perimeterDraw', this.drawManually);
    this.mapGeneralService.setDoubleClickCallback(undefined, 'perimeterDraw', this.drawManually);

    // // edit scan perimeter
    // this.mapGeneralService.setMouseDownCallback(undefined, 'perimeterEdit', this.updateManually);
    // this.mapGeneralService.setMouseOverCallback(undefined, 'perimeterEdit', this.editManually);
    // this.mapGeneralService.setDoubleClickCallback(undefined, 'perimeterEdit', this.editManually);
  };


  // public showBillboard = (event: EVENT_LISTENER_DATA) => {
  //   if (this.applicationService.stateDraw === STATE_DRAW.drawBillboard) {
  //     const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
  //     if (event.type === 'mouseOver') {
  //       this.removeBillboard();
  //       this.drawBillboard(locationPoint);
  //     }
  //     if (event.type === 'mouseDown') {
  //       this.applicationService.stateDraw = STATE_DRAW.drawPolygonManually;
  //
  //     }
  //   }
  // };

  public drawManually = (event: EVENT_LISTENER_DATA) => {
    if (this.applicationService.stateDraw === STATE_DRAW.drawPolygon) {
      const points: POINT3D[] = this.drawerPolygonClass.mouseEvents(event);
      this.isCross = this.drawerPolygonClass.checkCrossPolygon(points);
      const idTemp = this.applicationService.geoCounter.toString();
      this.drawPolygon(points, idTemp, this.isCross);
      if (event.type === 'doubleClick'/* && points.length >= 4*/) {
        this.polygon$.next(points);
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        this.mapGeneralService.changeCursor(false);
        // if (this.isCross) {
        //   // this.openDialog(points, this.isCross);
        // } else {
        //
        //   // this.tempArrayPointsScanPerimeter = Object.assign([], points);
        //   // this.arrayPointsScanPerimeter.perimeter = Object.assign([], points);

        this.isCross = false;
        // }
      }
    }
  };

  public drawPolygon = (latlong: POINT3D[], id: string, isCross: boolean): void => {
    if (latlong) {
      if (Array.isArray(latlong) && latlong.length >= 3
        && latlong[0][0] === latlong[latlong.length - 1][0] && latlong[0][1] === latlong[latlong.length - 1][1]) {
        this.mapGeneralService.drawPolygonManually(latlong, id, isCross);
      }
    }
  };

  public deletePolygonManually = (polygonId) => {
    this.mapGeneralService.deletePolygonManually(polygonId);
    this.polygon$.next([]);
  };

}
