import { Injectable } from '@angular/core';
import {EVENT_LISTENER_DATA, STATE_DRAW} from '../../../types';
import {
  GEOPOINT3D,
  GEOPOINT3D_SHORT,
  NOTIFICATION_UI,
  POINT,
  POINT3D
} from '../../../../../../classes/typings/all.typings';
import {DrawMarkerClass} from '../classes/drawMarkerClass';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ApplicationService} from '../applicationService/application.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locationPoint$: BehaviorSubject<GEOPOINT3D_SHORT> = new BehaviorSubject({lon: undefined, lat: undefined, alt: 0});
  locationPointTemp: POINT3D;
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
      const locationPoint: GEOPOINT3D_SHORT = {lon: event.pointLatLng[0], lat: event.pointLatLng[1], alt: 0};
      // open marker on mouseOver
      const idTemp = this.applicationService.geoCounter.toString();
      if (event.type === 'mouseOver') {
        this.mapGeneralService.deleteLocationPointTemp(idTemp);
        this.drawLocationFromServer(locationPoint, idTemp);
        this.locationPointTemp = undefined;
      }
      // draw marker on mouseDown
      if (event.type === 'mouseDown') {
        this.mapGeneralService.deleteLocationPointTemp(idTemp);
        this.drawLocationFromServer(locationPoint, idTemp);
        this.locationPointTemp = event.pointLatLng;
      }
      // edit LocationPoint after draw =>
      if (this.locationPointTemp !== undefined) {
        this.isMarker = false;
        this.downClick = false;
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  };

  public editLocation = (event: EVENT_LISTENER_DATA): void => {
    if (this.applicationService.stateDraw === STATE_DRAW.editLocationPoint) {
      const locationPoint: GEOPOINT3D_SHORT = {lon: event.pointLatLng[0], lat: event.pointLatLng[1], alt: 0};
      // click on marker,(mousedown)
      if (event.type === 'mouseDown' && !this.downClick) {
        this.isMarker = this.drawMarkerClass.checkIfMarkerExist(event, this.locationPointTemp, event.distance);
      }
      //  if exist marker, mouseOver on new place
      if (event.type === 'mouseOver') {
        if (this.isMarker) {
          // edit marker location
          const idTemp = this.applicationService.geoCounter.toString();
          this.deleteLocationPointTemp(idTemp);
          this.drawLocationFromServer(locationPoint, idTemp);
          this.downClick = true;
        }
      }
      // mouseDown on map, close draw
      if (event.type === 'mouseDown' && this.downClick) {
        // close edit
        this.isMarker = false;
        this.downClick = false;
        // this.applicationService.stateDraw = STATE_DRAW.notDraw;
        // this.mapGeneralService.changeCursor(false);
      }
    }
  };

  // private drawBillboard = (locationPoint: GEOPOINT3D) => {
  //   this.mapGeneralService.createBillboard(locationPoint, 'temp');
  // };
  //
  // public removeBillboard = () => {
  //   this.mapGeneralService.removeBillboard('temp');
  // };

  public drawLocationFromServer = (locationPoint: GEOPOINT3D_SHORT, locationId: string) => {
    this.mapGeneralService.createLocationPointFromServer(locationPoint, locationId);
    this.locationPoint$.next(locationPoint);
  };

  public createOrUpdateLocationTemp = (locationPoint: GEOPOINT3D_SHORT) => {
    this.locationPointTemp = [locationPoint.lon, locationPoint.lat, 0];
    const idTemp = this.applicationService.geoCounter.toString();
    this.mapGeneralService.createOrUpdateLocationTemp(locationPoint, idTemp);
  };

  public deleteLocationPointTemp = (locationId) => {
    this.mapGeneralService.deleteLocationPointTemp(locationId);
    this.locationPoint$.next({lon: undefined, lat: undefined, alt: 0});
  };

}
