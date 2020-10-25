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
  tempPolygon: any;
  tempPerimeterPosition: any;

  constructor(private cesiumService: CesiumService) {
  }

  // ==================LOCATION=========================================================================================

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

  // ==================BILLBOARD========================================================================================

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
      name: 'billboard',
      position: Cesium.Cartesian3.fromDegrees(locationPoint.longitude, locationPoint.latitude),
      label: {
        text: text,
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        background: Cesium.Color.GRAY,
        color: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(0, -9)
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
              // this.locationTemp = undefined;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  // ==================ICON========================================================================================

  public createIconObject = (domId: string, locationPoint: GEOPOINT3D, billboardId: string, iconUrl: string, size: number, label: {text: string, color: string}): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (locationPoint) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] =
            this.createIconEntity(mapDomId, mapsCE[mapDomId], locationPoint, iconUrl, size, label);

          if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId]) {
            res = true;
          }
        }
      }
    }
    return res;
  };

  private createIconEntity = (mapDomId: string, mapCE: any, locationPoint: GEOPOINT3D, iconUrl: string, size: number, label: {text: string, color: string}) => {
    const entity = {
      position: Cesium.Cartesian3.fromDegrees(locationPoint.longitude, locationPoint.latitude),
      billboard: {
        image: iconUrl,
        width: size,
        height: size
      },
      label: undefined,
    }
    if (label) {
      entity.label = {
        text: label.text,
        font: '10pt monospace',
        showBackground: true,
        eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
        pixelOffset: new Cesium.Cartesian2(0, size / 2),
        style: Cesium.LabelStyle.FILL,
        fillColor: Cesium.Color.BLACK,
        backgroundColor: Cesium.Color.fromCssColorString(label.color || 'rgba(255, 255 ,255 ,1)'),
        // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      }
    }
    const billboard = this.cesiumService.cesiumViewer[mapDomId].entities.add(entity);
    this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return billboard;
  };

  public deleteIconFromMap = (domId: string, billboardId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE].hasOwnProperty(billboardId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId];
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public editIcon = (domId: string, billboardId: string, iconUrl: string, size: number): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE].hasOwnProperty(billboardId) &&
                this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] !== {} &&
                this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard) {
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.image.setValue(iconUrl);
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.width.setValue(size);
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.height.setValue(size);
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  // ==================POLYGON==========================================================================================
  // ========= Manually ====================
  public drawPolygonManually = (domId: string, positions: POINT3D[], idPolygon: string, color: string): boolean => {
    // this.removePolygonManually(domId, idPolygon);
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.tempPolygon === undefined) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.createPolygonManuallyEntity(mapDomId, mapsCE[mapDomId], positions, color);
          this.tempPolygon = this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon];
          res = true;
        } else {
          this.updatePolygonManually(mapDomId, positions, idPolygon, color);
          res = true;
        }
      }
    }
    return res;
  };

  private createPolygonManuallyEntity = (mapDomId: string, mapCE: any, positions: POINT3D[], color: string): {} => {
    this.tempPerimeterPosition = {data: this.arrayPointsToCartesian3(positions)};

    const polygon = this.cesiumService.cesiumViewer[mapDomId].entities.add({
      name: 'polygon',
      polyline: {
        positions: this.cesiumServiceSetCallbackProperty(this.tempPerimeterPosition),
        width: 4,
        material: color ? this.rgbaToCesiumColor(color) : this.rgbaToCesiumColor(this.cesiumService.colors.polygon),
        // clampToGround: true
      }
    });
    this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return polygon;
  };

  private updatePolygonManually = (mapDomId: string, latlong: POINT3D[], idPolygon, color: string): void => {
    this.tempPerimeterPosition.data = this.arrayPointsToCartesian3(latlong);
    this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polyline.material.color.setValue(this.rgbaToCesiumColor(color));
  };

  // ======== Server =======================
  public drawPolygonFromServer = (domId: string, positions: POINT3D[], idPolygon: string, title: string): boolean => {
    this.deletePolygonManually(domId, idPolygon);
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (positions) {
          //polygon
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.createPolygonFromServerEntity(mapDomId, mapsCE[mapDomId], positions);
          //label
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] =
            this.createLabel(mapDomId, mapsCE[mapDomId], positions, title);
          res = true;
        }
      }
    }
    return res;
  };

  private createPolygonFromServerEntity = (mapDomId: string, mapCE: any, positions: POINT3D[]): {} => {
    const positionCE = this.arrayPointsToCartesian3(positions);
    const polygon = this.cesiumService.cesiumViewer[mapDomId].entities.add({
      name: 'polygon',
      polygon: {
        hierarchy: positionCE,
        height: 0,
        material: Cesium.Color.YELLOW.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.YELLOW
      }
    });
    this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return polygon;
  };

  private createLabel = (mapDomId: string, mapCE: any, positions: POINT3D[], title: string): Array<{}> => {
    const posHeight: POINT = /*[[positions[0][0], positions[0][1], 5]];*/ this.getPolygonCentroid(positions);
    const position = this.arrayPointsToCartesian3(positions);


    const center = Cesium.BoundingSphere.fromPoints(position).center;
    // Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
     const positionCenter = new Cesium.ConstantPositionProperty(center);

    const label = {
      // position: positionCenter,
      text: title,
      font: '25px Open Sans Hebrew Condensed, serif',
      showBackground: false,
      eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
      pixelOffset: new Cesium.Cartesian2(-20, 0),
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outline: true,
      fillColor: Cesium.Color.BLACK,
      // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.END,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    };

    return this.cesiumService.cesiumViewer[mapDomId].entities.add({
      label: label,
      position: positionCenter
    });
  };

  getPolygonCentroid = (points): POINT => {
    const centroid = {x: 0, y: 0};
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      centroid.x += point[0];
      centroid.y += point[1];
    }
    centroid.x /= points.length;
    centroid.y /= points.length;
    return [centroid.x, centroid.y];
  };

  public removePolygonManually = (domId: string, idPolygon: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon]);
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public deletePolygonManually = (domId: string, idPolygon: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // polygon
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon];
              this.tempPolygon = undefined;
              this.tempPerimeterPosition = undefined;
              res = true;
            }
          }
          //  label
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.labelPolygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon];
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

  public rgbaToCesiumColor = (rgba) => {
    return Cesium.Color.fromCssColorString(rgba || 'rgba(255, 255 ,255 ,1)');
  };
}
