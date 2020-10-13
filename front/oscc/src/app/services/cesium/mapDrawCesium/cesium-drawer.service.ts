import {Injectable} from '@angular/core';
import {CARTESIAN3, GEOPOINT3D, MAP, POINT, POINT3D} from '../../../../../../../classes/typings/all.typings';
import {CesiumService} from '../cesium.service';
import {Cartesian2} from 'angular-cesium';
import {EventListener} from '../event-listener';
import {GeoCalculate} from '../../classes/geoCalculate';
import {TYPE_OBJECTS_CE} from '../../../../types';

@Injectable({
  providedIn: 'root'
})
export class CesiumDrawerService {

  eventListenersObj: { [key: string]: EventListener } = {};
  eventsHandlerCvMap: any = {};
  locationTemp: any;

  constructor(private cesiumService: CesiumService) {
  }

  public createLocationPointFromServer = (domId: string, locationPoint: GEOPOINT3D, locationId: string) => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (locationPoint) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId] =
            this.createMarkerLocationEntity(mapDomId, mapsCE[mapDomId], locationPoint);

          if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId]) {
            res = true;
          }
        }
      }
    }
    return res;
  };

  private createMarkerLocationEntity = (mapDomId: string, mapCE: any, locationPoint: GEOPOINT3D): {} => {
    const position = this.arrayPointsToCartesian3([[locationPoint.longitude, locationPoint.latitude, 5]]);
    this.locationTemp = {data: position[0]};
    const marker = this.cesiumService.cesiumViewer[mapDomId].entities.add({
      position: this.cesiumServiceSetCallbackProperty(this.locationTemp),
      billboard: {
        image: '../../../assets/markerGreen.png',
        width: 25, // default: undefined
        height: 43, // default: undefined
        // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
    this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return marker;
  };

  public createOrUpdateLocationTemp = (domId: string, locationPoint: GEOPOINT3D, locationId: string) => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // edit locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.locationPointCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE].hasOwnProperty(locationId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId] !== {}) {
              this.editLocation(locationPoint);
              res = true;
            }
          }
          if (!res) {
            this.createLocationPointFromServer(domId, locationPoint, locationId);
          }
        }
      }
    }
    return res;
  };

  private editLocation = (locationPoint: GEOPOINT3D): void => {
    const position = this.arrayPointsToCartesian3([[locationPoint.longitude, locationPoint.latitude, 5]]);
    this.locationTemp.data = position[0];
  };

  public deleteLocationPointFromMap = (domId: string, locationId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.locationPointCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE].hasOwnProperty(locationId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId];
              this.locationTemp = undefined;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public createBillboardObject = (domId: string, locationPoint: GEOPOINT3D, billboardId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (locationPoint) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] =
            this.createBillboardEntity(mapDomId, mapsCE[mapDomId], locationPoint);

          if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId]) {
            res = true;
          }
        }
      }
    }
    return res;
  };

  private createBillboardEntity = (mapDomId: string, mapCE: any, locationPoint: GEOPOINT3D) => {
    const text = 'Click on map to set the report\'s location';
    // const position = this.arrayPointsToCartesian3([[locationPoint.longitude, locationPoint.latitude, 5]]);
    const billboard = this.cesiumService.cesiumViewer[mapDomId].entities.add({
      name : 'billboard',
      position : Cesium.Cartesian3.fromDegrees(locationPoint.longitude, locationPoint.latitude),
      label : {
        text : text,
        font : '14pt monospace',
        style: Cesium.LabelStyle.FILL,
        outlineWidth : 2,
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
        background: Cesium.Color.GRAY,
        color: Cesium.Color.WHITE,
        pixelOffset : new Cesium.Cartesian2(0, -9)
      }
    });
    this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return billboard;
  };

  public removeBillboardFromMap = (domId: string, billboardId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.billboardCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE].hasOwnProperty(billboardId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId]);
              // delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId];
              this.locationTemp = undefined;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };




  // ====================== Callback   =================================================================================

  public cesiumServiceSetCallbackProperty = (property): any => {
    return new Cesium.CallbackProperty(() => {
      return property.data;
    }, false);
  };

  // ======================Event Listener===============================================================================

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

  public arrayPointsToCartesian3 = (positions: POINT[] | POINT3D[]): CARTESIAN3[] => {
    const _positions: CARTESIAN3[] = [];
    for (let i = 0; i < positions.length; i++) {
      _positions.push(this.pointDegreesToCartesian3(positions[i]));
    }
    return _positions;
  };

  private pointDegreesToCartesian3 = (position: POINT | POINT3D): CARTESIAN3 => {
    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2] || 0);
  };


}
