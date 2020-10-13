import { Injectable } from '@angular/core';
import {EVENT_LISTENER_DATA, STATE_DRAW} from '../../../types';
import {GEOPOINT3D, POINT} from '../../../../../../classes/typings/all.typings';
import {DrawMarkerClass} from '../classes/drawMarkerClass';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ApplicationService} from '../applicationService/application.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locationPoint$: BehaviorSubject<GEOPOINT3D> = new BehaviorSubject({longitude: undefined, latitude: undefined});
  locationPointTemp: POINT;
  drawMarkerClass: DrawMarkerClass;
  downClick: boolean = false;
  isMarker: boolean = false;


  constructor(public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService) {
    this.setEventCallbacks();
    this.drawMarkerClass = new DrawMarkerClass();
  }

  public setEventCallbacks = () => {
    this.mapGeneralService.setMouseOverCallback(undefined, 'locationDraw', this.drawLocation);
    this.mapGeneralService.setMouseDownCallback(undefined, 'locationDraw', this.drawLocation);
    this.mapGeneralService.setMouseDownCallback(undefined, 'locationEdit', this.editLocation);
    this.mapGeneralService.setMouseOverCallback(undefined, 'locationEdit', this.editLocation);
  };


  public drawLocation = (event: EVENT_LISTENER_DATA): void => {
    if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint) {
      const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
      // open billboard on mouseOver
      if (event.type === 'mouseOver') {
        this.removeBillboard();
        this.drawBillboard(locationPoint);
        this.locationPointTemp = undefined;
      }
      // draw marker on mouseDown
      if (event.type === 'mouseDown') {
        this.drawLocationFromServer(locationPoint, 'temp');
        this.removeBillboard();
        this.locationPointTemp = event.pointLatLng;
      }
      // edit LocationPoint after draw =>
      if (this.locationPointTemp !== undefined) {
        this.isMarker = false;
        this.downClick = false;
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
      }
    }
  };

  public editLocation = (event: EVENT_LISTENER_DATA): void => {
    if (this.applicationService.stateDraw === STATE_DRAW.editLocationPoint) {
      const locationPoint: GEOPOINT3D = {longitude: event.pointLatLng[0], latitude: event.pointLatLng[1]};
      // click on marker,(mousedown)
      if (event.type === 'mouseDown' && !this.downClick) {
        this.isMarker = this.drawMarkerClass.checkIfMarkerExist(event, this.locationPointTemp, event.distance);
      }
      //  if exist marker, mouseOver on new place
      if (event.type === 'mouseOver') {
        if (this.isMarker) {
          // edit marker location
          this.deleteLocationPointTemp();
          this.drawLocationFromServer(locationPoint, 'temp');
          this.downClick = true;
        }
      }
      // mouseDown on map, close draw
      if (event.type === 'mouseDown' && this.downClick) {
        // close edit
        this.isMarker = false;
        this.downClick = false;
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        // setTimeout(() => {
        //   this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        // }, 500);
      }
    }
  };

  private drawBillboard = (locationPoint: GEOPOINT3D) => {
    this.mapGeneralService.createBillboard(locationPoint, 'temp');
  };

  public removeBillboard = () => {
    this.mapGeneralService.removeBillboard('temp');
  };

  public drawLocationFromServer = (locationPoint: GEOPOINT3D, locationId: string) => {
    this.mapGeneralService.createLocationPointFromServer(locationPoint, locationId);
    this.locationPoint$.next(locationPoint);
  };

  public createOrUpdateLocationTemp = (locationPoint: GEOPOINT3D) => {
    this.locationPointTemp = [locationPoint.longitude, locationPoint.latitude];
    this.mapGeneralService.createOrUpdateLocationTemp(locationPoint, 'temp');
  };

  public deleteLocationPointTemp = () => {
    const locationId: string = 'temp';
    this.mapGeneralService.deleteLocationPointTemp(locationId);
    this.locationPoint$.next({longitude: undefined, latitude: undefined});
  };

}
