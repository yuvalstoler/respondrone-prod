import { Injectable } from '@angular/core';
import {MAP, POINT} from '../../../../../../../classes/typings/all.typings';
import {CesiumService} from '../cesium.service';
import {Cartesian2} from 'angular-cesium';
import {EventListener} from '../event-listener';
import {GeoCalculate} from '../../classes/geoCalculate';

@Injectable({
  providedIn: 'root'
})
export class CesiumDrawerService {

  eventListenersObj: { [key: string]: EventListener } = {};
  eventsHandlerCvMap: any = {};

  constructor(private cesiumService: CesiumService) { }


  // ======================Event Listener=================================================================================

  // ---------------left Click--------------------
  public setLeftClickCallback = (domId: string, listenerName: string, callback) => {
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (mapsCE[mapDomId] && mapsCE[mapDomId] !== {}) {
          if (!this.eventListenersObj[mapDomId]) {
            this.eventListenersObj[mapDomId] = new EventListener(mapDomId);
          }
          this.eventListenersObj[mapDomId].setCallback('leftClick', this.sendClickEventToListeners);
          this.eventListenersObj[mapDomId].leftClickListeners[listenerName] = callback;
          this.setInputEventAction(mapDomId, this.eventListenersObj[mapDomId].sendLeftClickToService, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }
    }
  };

  private sendClickEventToListeners = (mapDomId: string, clickPositionMap, leftClickListeners, type: string) => {
    let clickPosition: POINT;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.position);
    const distance = this.calculatePixelToMeter(mapDomId, clickPositionMap.position);
    if (clickPosition) {
      // const pickedObjects = this.cesiumService.cesiumViewer[mapDomId].scene.drillPick(clickPositionMap.position);
      // const obj: any = false;
      console.log(clickPositionMap.position);
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.position,
              pointLatLng: clickPosition,
              distance: distance
            });
          } catch (e) {
          }
        }
      }
    }
  };

  private calculatePixelToMeter = (mapDomId: string, clickPositionPx: Cartesian2): number => {
    const pointOne = this.pixelsToLatlong(mapDomId, clickPositionPx);
    const pointTwo = this.pixelsToLatlong(mapDomId, {x: clickPositionPx.x + 10, y: clickPositionPx.y});
    const distance = GeoCalculate.calcDistanceBetweenToPoints(pointOne, pointTwo);
    return distance / 10;
  };

  // ---------------Mouse Move--------------------
  public setMouseOverCallback = (domId: string, listenerName: string, callback) => {
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (mapsCE[mapDomId] && mapsCE[mapDomId] !== {}) {
          if (!this.eventListenersObj[mapDomId]) {
            this.eventListenersObj[mapDomId] = new EventListener(mapDomId);
          }
          this.eventListenersObj[mapDomId].setCallback('mouseOver', this.sendMouseOverToListeners);
          this.eventListenersObj[mapDomId].mouseOverListeners[listenerName] = callback;
          this.setInputEventAction(mapDomId, this.eventListenersObj[mapDomId].sendMouseOverToService, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
      }
    }
  };

  private sendMouseOverToListeners = (mapDomId: string, clickPositionMap, leftClickListeners, type: string) => {
    let clickPosition: POINT;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.endPosition);
    if (clickPosition) {
      // const pickedObjects = this.cesiumService.cesiumViewer[mapDomId].scene.drillPick(clickPositionMap.position);
      // const obj: any = false;
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.endPosition,
              pointLatLng: clickPosition
            });
          } catch (e) {
          }
        }
      }
    }
  };
  // ---------------Mouse Down--------------------
  public setMouseDownCallback = (domId: string, listenerName: string, callback) => {
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (mapsCE[mapDomId] && mapsCE[mapDomId] !== {}) {
          if (!this.eventListenersObj[mapDomId]) {
            this.eventListenersObj[mapDomId] = new EventListener(mapDomId);
          }
          this.eventListenersObj[mapDomId].setCallback('mouseDown', this.sendMouseDownToListeners);
          this.eventListenersObj[mapDomId].mouseDownListeners[listenerName] = callback;
          this.setInputEventAction(mapDomId, this.eventListenersObj[mapDomId].sendMouseDownToService, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        }
      }
    }
  };

  private sendMouseDownToListeners = (mapDomId: string, clickPositionMap, leftClickListeners, type: string) => {
    let clickPosition: POINT;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.position);
    const distance = this.calculatePixelToMeter(mapDomId, clickPositionMap.position);

    if (clickPosition) {
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.position,
              pointLatLng: clickPosition,
              distance: distance,
              // stopPropagation: leftClickListeners.preventDefault
            });
          } catch (e) {
          }
        }
      }
    }
  };
  // --------- DoubleClick ---------------
  public setDoubleClickCallback = (domId: string, listenerName: string, callback) => {
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (mapsCE[mapDomId] && mapsCE[mapDomId] !== {}) {
          if (!this.eventListenersObj[mapDomId]) {
            this.eventListenersObj[mapDomId] = new EventListener(mapDomId);
          }
          this.eventListenersObj[mapDomId].setCallback('doubleClick', this.sendDBClickEventToListeners);
          this.eventListenersObj[mapDomId].doubleClickListener[listenerName] = callback;
          this.setInputEventAction(mapDomId, this.eventListenersObj[mapDomId].sendDoubleClickToService, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        }
      }
    }
  };

  private sendDBClickEventToListeners = (mapDomId: string, clickPositionMap, leftClickListeners, type: string) => {
    let clickPosition: POINT;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.position);
    if (clickPosition) {
      // const pickedObjects = this.cesiumService.cesiumViewer[mapDomId].scene.drillPick(clickPositionMap.position);
      // const obj: any = false;
      console.log(clickPositionMap.position);
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.position,
              pointLatLng: clickPosition
            });
          } catch (e) {
          }
        }
      }
    }
  };

  // ---------------Mouse Up--------------------
  public setMouseUpCallback = (domId: string, listenerName: string, callback) => {
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (mapsCE[mapDomId] && mapsCE[mapDomId] !== {}) {
          if (!this.eventListenersObj[mapDomId]) {
            this.eventListenersObj[mapDomId] = new EventListener(mapDomId);
          }
          this.eventListenersObj[mapDomId].setCallback('mouseUp', this.sendMouseUpToListeners);
          this.eventListenersObj[mapDomId].mouseUpListeners[listenerName] = callback;
          this.setInputEventAction(mapDomId, this.eventListenersObj[mapDomId].sendMouseUpToService, Cesium.ScreenSpaceEventType.LEFT_UP);
        }
      }
    }
  };

  private sendMouseUpToListeners = (mapDomId, clickPositionMap, leftClickListeners, type: string) => {
    let clickPosition: POINT;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.endPosition);
    if (clickPosition) {
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.position,
              pointLatLng: clickPosition
            });
          } catch (e) {
          }
        }
      }
    }
  };

  // ---------------------------------------------------------------
  private setInputEventAction = (mapDomId: string, callFunction: any, event: any) => {
    if (!this.eventsHandlerCvMap[mapDomId]) {
      this.eventsHandlerCvMap[mapDomId] = new Cesium.ScreenSpaceEventHandler(this.cesiumService.cesiumViewer[mapDomId].scene.canvas);
    }
    if (!this.eventsHandlerCvMap[mapDomId].getInputAction(event)) {
      this.eventsHandlerCvMap[mapDomId].setInputAction(callFunction, event);
    }
  };


  public pixelsToLatlong = (mapDomId: string, clickPositionMap: { x: number, y: number }): POINT => {
    let clickPosition: POINT;
    if (clickPositionMap !== undefined) {
      const cartesian = this.cesiumService.cesiumViewer[mapDomId].camera.pickEllipsoid(clickPositionMap,
        this.cesiumService.cesiumViewer[mapDomId].scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude)/*.toFixed(2)*/;
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude)/*.toFixed(2)*/;
        clickPosition = [+longitudeString, +latitudeString];
      }
    }
    return clickPosition;
  };

}
