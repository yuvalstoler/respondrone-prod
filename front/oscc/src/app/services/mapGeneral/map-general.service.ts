import {Injectable} from '@angular/core';
import {CesiumService} from '../cesium/cesium.service';
import {GEOPOINT3D, MAP, POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
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

  // Billboard =====================================================================================================
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

  //Polygon ====================================================================================================
  public drawPolygonFromServer = (arrayPoints: POINT3D[], id: string, title: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.drawPolygonFromServer(domId, arrayPoints, id, title);
    return res;
  };

  public drawPolygonManually = (arrayPoints: POINT3D[], id: string, isCross: boolean) => {
    const domId = undefined;
    let res = false;
    const color = isCross ? '#ff3c54' : '#59b1f1';
    res = this.cesiumDrawerService.drawPolygonManually(domId, arrayPoints, id, color);
    return res;
  };

  public removePolygonManually = (polygonId: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.removePolygonManually(domId, polygonId);
    return res;
  };

  public deletePolygonManually = (polygonId: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.deletePolygonManually(domId, polygonId);
    return res;
  };

  // Polyline =====================================================================================================
  // from Service =====
  public createPolyline = (points: POINT[], id: string) => {
    const domId = undefined;
    let res = false;
    this.deletePolylineFromMap(id);
      res = this.cesiumDrawerService.createPolylineFromServer(domId, points, id);
    return res;
  };

  public deletePolylineFromMap = (polylineId: string) => {
    const domId = undefined;
    let res = false;
      res = this.cesiumDrawerService.deletePolylineFromMap(domId, polylineId);
    return res;
  };

  // Arrow Polyline =====================================================================================================
  // from Service =====
  public createArrowPolyline = (points: POINT[], polylineId: string) => {
    const domId = undefined;
    let res = false;
    this.deleteArrowPolylineFromMap(polylineId);
    res = this.cesiumDrawerService.createArrowPolylineFromServer(domId, points, polylineId);
    return res;
  };

  public deleteArrowPolylineFromMap = (polylineId: string) => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.deleteArrowPolylineFromMap(domId, polylineId);
    return res;
  };


  // Icons ========================================================================================================
  public createIcon = (locationPoint: GEOPOINT3D, billboardId: string, iconUrl: string, size: number = 30, label: {text: string, color: string} = undefined): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.createIconObject(domId, locationPoint, billboardId, iconUrl, size, label);
    return res;
  };

  public deleteIcon = (billboardId: string): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.deleteIconFromMap(domId, billboardId);
    return res;
  };

  public editIcon = (billboardId: string, iconUrl: string, size: number): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumDrawerService.editIcon(domId, billboardId, iconUrl, size);
    return res;
  };

  // =================================================================================================
  public flyToObject = (coordinates): boolean => {
    const domId = undefined;
    let res = false;
    res = this.cesiumService.flyToObject(domId, coordinates);
    return res;
  };

}
