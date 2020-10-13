import {Injectable} from '@angular/core';
import {CesiumService} from '../cesium/cesium.service';
import {GEOPOINT3D, MAP} from '../../../../../../classes/typings/all.typings';
import {CesiumDrawerService} from '../cesium/mapDrawCesium/cesium-drawer.service';

@Injectable({
  providedIn: 'root'
})
export class MapGeneralService {

  // listeners --------------------------------------
  // key = string, value = callback
  public leftClickListeners: MAP<any> = {};
  public rightClickListeners: MAP<any> = {};
  public mouseOverListeners: MAP<any> = {};
  public mouseDownListeners: MAP<any> = {};
  public mouseUpListeners: MAP<any> = {};
  public doubleClickListener: MAP<any> = {};

  constructor(private cesiumService: CesiumService,
              private cesiumDrawerService: CesiumDrawerService) {
  }

  public createCesiumMap = (mapId: string[]): void => {
    // if (this.mapSelected === MAP_TYPE.Cesium || this.mapSelected === MAP_TYPE.AllMaps) {
    this.cesiumService.createMap(mapId[0]);
    // this.cesiumDomId = mapId[0];
    this.setListenerCallbacks(mapId[0]);
    // }
  };

  private setListenerCallbacks = (mapDomId: string): void => {
    // leftClick
    for (const listenerName in this.leftClickListeners) {
      if (this.leftClickListeners.hasOwnProperty(listenerName)) {
        this.setLeftClickCallback(mapDomId, listenerName, this.leftClickListeners[listenerName]);
      }
    }
    // MouseOver
    for (const listenerName in this.mouseOverListeners) {
      if (this.mouseOverListeners.hasOwnProperty(listenerName)) {
        this.setMouseOverCallback(mapDomId, listenerName, this.mouseOverListeners[listenerName]);
      }
    }
    // DoubleClick
    for (const listenerName in this.doubleClickListener) {
      if (this.doubleClickListener.hasOwnProperty(listenerName)) {
        this.setDoubleClickCallback(mapDomId, listenerName, this.doubleClickListener[listenerName]);

      }
    }
    // Mouse Down
    for (const listenerName in this.mouseDownListeners) {
      if (this.mouseDownListeners.hasOwnProperty(listenerName)) {
        this.setMouseDownCallback(mapDomId, listenerName, this.mouseDownListeners[listenerName]);
      }
    }
    // Mouse Up
    for (const listenerName in this.mouseUpListeners) {
      if (this.mouseUpListeners.hasOwnProperty(listenerName)) {
        this.setMouseUpCallback(mapDomId, listenerName, this.mouseUpListeners[listenerName]);
      }
    }
  };

  // ================================== Event Callbacks ================================================================

  // -------Left Click ---------------------
  public setLeftClickCallback = (mapDomId: string, listenerName: string, callback) => {
    this.leftClickListeners[listenerName] = callback;
    this.cesiumDrawerService.setLeftClickCallback(mapDomId, listenerName, callback);
  };
  // -------Mouse Over ---------------------
  public setMouseOverCallback = (mapDomId: string, listenerName: string, callback) => {
    this.mouseOverListeners[listenerName] = callback;
    this.cesiumDrawerService.setMouseOverCallback(mapDomId, listenerName, callback);
  };
  // ------DoubleClick ---------------------
  public setDoubleClickCallback = (mapDomId: string, listenerName: string, callback) => {
    this.doubleClickListener[listenerName] = callback;
    this.cesiumDrawerService.setDoubleClickCallback(mapDomId, listenerName, callback);
  };
  // --------MouseDown --------------------
  public setMouseDownCallback = (mapDomId: string, listenerName: string, callback) => {
    this.mouseDownListeners[listenerName] = callback;
    this.cesiumDrawerService.setMouseDownCallback(mapDomId, listenerName, callback);
  };
  // --------MouseUp --------------------
  public setMouseUpCallback = (mapDomId: string, listenerName: string, callback) => {
    this.mouseDownListeners[listenerName] = callback;
    this.cesiumDrawerService.setMouseUpCallback(mapDomId, listenerName, callback);
  };


  // Location Point ===========================================================================================================
  // from Service ======
  public createLocationPointFromServer = (locationPoint: GEOPOINT3D, locationId: string): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.createLocationPointFromServer(domId, locationPoint, locationId);
    return res;
  };

  public createOrUpdateLocationTemp = (locationPoint: GEOPOINT3D, locationId: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.createOrUpdateLocationTemp(domId, locationPoint, locationId);
    return res;
  };

  public deleteLocationPointTemp = (locationId: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.deleteLocationPointFromMap(domId, locationId);
    return res;
  };

  public createBillboard = (locationPoint: GEOPOINT3D, billboardId: string): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.createBillboardObject(domId, locationPoint, billboardId);
    return res;
  };

  public removeBillboard = (billboardId: string): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.removeBillboardFromMap(domId, billboardId);
    return res;
  };

  public drawPolygonManually = (arrayPoints: Array<any>, id: string, isCross: boolean) => {
    const domId = undefined;
    let res = false;
    const color = isCross ? '#ff3c54' : '#59b1f1';
    res = this.cesiumDrawerService.drawPolygonManually(domId, arrayPoints, id, color);
    return res;
  };

}
