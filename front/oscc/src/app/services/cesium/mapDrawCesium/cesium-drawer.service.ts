import {Injectable} from '@angular/core';
import {
  AV_DATA_UI,
  CARTESIAN3,
  EVENT_DATA_UI, FR_DATA_UI, GEOGRAPHIC_INSTRUCTION,
  GEOPOINT3D, GEOPOINT3D_SHORT, ICON_STYLES,
  MAP,
  POINT,
  POINT3D, POLYGON_STYLES, POLYLINE_STYLES, REPORT_DATA_UI
} from '../../../../../../../classes/typings/all.typings';
import {CesiumService} from '../cesium.service';
import {Cartesian2} from 'angular-cesium';
import {EventListener} from '../event-listener';
import {GeoCalculate} from '../../classes/geoCalculate';
import {ICON_DATA, OPTIONS_ENTITY, POLYGON_DATA, POLYLINE_DATA, TYPE_OBJECTS_CE} from '../../../../types';
import * as _ from 'lodash';

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

  public createLocationPointFromServer = (domId: string, locationPoint: GEOPOINT3D_SHORT, locationId: string, description?: string) => {
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
            this.createMarkerLocationEntity(mapDomId, mapsCE[mapDomId], locationPoint, description);

          if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.locationPointCE][locationId]) {
            res = true;
          }
        }
      }
    }
    return res;
  };

  private createMarkerLocationEntity = (mapDomId: string, mapCE: any, locationPoint: GEOPOINT3D_SHORT, description: string): {} => {
    const position = this.arrayPointsToCartesian3([[locationPoint.lon, locationPoint.lat, 5]]);
    this.locationTemp = {data: position[0]};
    const marker = this.cesiumService.cesiumViewer[mapDomId].entities.add({
      position: this.cesiumServiceSetCallbackProperty(this.locationTemp),
      billboard: {
        image: this.cesiumService.defaults.markerIcon,
        width: this.cesiumService.defaults.markerSize.width,
        height: this.cesiumService.defaults.markerSize.height,
        // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      options: {
        // description: description,
      }
    });
    // this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return marker;
  };

  public createOrUpdateLocationTemp = (domId: string, locationPoint: GEOPOINT3D_SHORT, locationId: string) => {
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

  private editLocation = (locationPoint: GEOPOINT3D_SHORT): void => {
    const position = this.arrayPointsToCartesian3([[locationPoint.lon, locationPoint.lat, 5]]);
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

  // public createBillboardObject = (domId: string, locationPoint: GEOPOINT3D, billboardId: string, options: OPTIONS_ENTITY): boolean => {
  //   let res = false;
  //   const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
  //   for (const mapDomId in mapsCE) {
  //     if (mapsCE.hasOwnProperty(mapDomId)) {
  //       if (locationPoint) {
  //         this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE] =
  //           this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE] || {};
  //         this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] =
  //           this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] || {};
  //         this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] =
  //           this.createBillboardEntity(mapDomId, mapsCE[mapDomId], locationPoint, options);
  //
  //         if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId]) {
  //           res = true;
  //         }
  //       }
  //     }
  //   }
  //   return res;
  // };
  //
  // private createBillboardEntity = (mapDomId: string, mapCE: any, locationPoint: GEOPOINT3D, options: OPTIONS_ENTITY) => {
  //   const text = options.description;
  //   const billboard = this.cesiumService.cesiumViewer[mapDomId].entities.add({
  //     name: 'billboard',
  //     position: Cesium.Cartesian3.fromDegrees(locationPoint.longitude, locationPoint.latitude),
  //     label: {
  //       text: text,
  //       font: '14pt monospace',
  //       style: Cesium.LabelStyle.FILL,
  //       outlineWidth: 2,
  //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //       background: Cesium.Color.GRAY,
  //       color: Cesium.Color.WHITE,
  //       pixelOffset: new Cesium.Cartesian2(0, -9)
  //     }
  //   });
  //   this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
  //   return billboard;
  // };
  //
  // public removeBillboardFromMap = (domId: string, billboardId: string): boolean => {
  //   let res = false;
  //   const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
  //   for (const mapDomId in mapsCE) {
  //     if (mapsCE.hasOwnProperty(mapDomId)) {
  //       if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
  //         // delete locationPoint
  //         if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.billboardCE)) {
  //           if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE].hasOwnProperty(billboardId) &&
  //             this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId] !== {}) {
  //             this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId]);
  //             // delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.billboardCE][billboardId];
  //             // this.locationTemp = undefined;
  //             res = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return res;
  // };

  // ==================ICON========================================================================================

  public createIconObject = (domId: string, iconData: ICON_DATA): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (iconData.location) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][iconData.id] =
            this.createIconEntity(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][iconData.id], iconData);


          // if (label) {
          //   this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE] =
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE] || {};
          //   this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][object.id] =
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][object.id] || {};
          //   this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][object.id] =
          //     this.createIconLabelEntity(mapDomId, object, label);
          // }

          res = true;
        }
      }
    }
    return res;
  };

  // public updateIconFromMap = (domId: string, billboardId: string, object: DRAW_OBJECT, label?: DRAW_LABEL): boolean => {
  //   let res = false;
  //   const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
  //   for (const mapDomId in mapsCE) {
  //     if (mapsCE.hasOwnProperty(mapDomId)) {
  //       if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
  //         // delete locationPoint
  //         if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconCE)) {
  //           if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE].hasOwnProperty(billboardId) &&
  //             (Object.keys(this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId]).length > 0)) {
  //             this.updateIconOnMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId], object);
  //             res = true;
  //           }
  //         }
  //         if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconLabelCE) && label) {
  //           if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE].hasOwnProperty(billboardId) &&
  //             (Object.keys(this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId]).length > 0)) {
  //             this.updateIconLabelOnMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId], object, label);
  //             res = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return res;
  // };

  // private updateIconOnMap = (mapDomId: string, entityCE, object: DRAW_OBJECT) => {
  //   const size = object.modeDefine.styles.iconSize || 30;
  //   const description = (object.hasOwnProperty('description')) ? object['description'] : '';
  //   const options = {
  //     position: Cesium.Cartesian3.fromDegrees(object.location.longitude, object.location.latitude, object.location.altitude),
  //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  //     billboard: {
  //       image: object.modeDefine.styles.mapIcon,
  //       width: size,
  //       height: size,
  //       rotation: Cesium.Math.toRadians(-(object['heading'] || 0))
  //     },
  //     label: undefined,
  //     options: {
  //       description: description,
  //     },
  //     show: true
  //   };
  //   this.cesiumService.updateItemCEOnMap(mapDomId, entityCE, options);
  // };

  // private updateIconLabelOnMap = (mapDomId: string, entityCE, object: DRAW_OBJECT, label: DRAW_LABEL) => {
  //   const size = object.modeDefine.styles.iconSize || 30;
  //   const options = {
  //     position: Cesium.Cartesian3.fromDegrees(object.location.longitude, object.location.latitude, object.location.altitude),
  //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  //     label: {
  //       text: label.text,
  //       font: '10pt monospace',
  //       showBackground: true,
  //       eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
  //       pixelOffset: new Cesium.Cartesian2(0, size / 2),
  //       style: Cesium.LabelStyle.FILL,
  //       fillColor: Cesium.Color.BLACK,
  //       backgroundColor: Cesium.Color.fromCssColorString(label.color || 'rgba(255, 255 ,255 ,1)'),
  //       // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
  //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //       verticalOrigin: Cesium.VerticalOrigin.TOP,
  //     }
  //   };
  //   this.cesiumService.updateItemCEOnMap(mapDomId, entityCE, options);
  // };

  private createIconEntity = (mapDomId: string, entityCE: any, iconData: ICON_DATA) => {
    const positionCartesian = this.pointDegreesToCartesian3(iconData.location);

    const styles: ICON_STYLES = (iconData.modeDefine && iconData.modeDefine.styles) ? iconData.modeDefine.styles : {} as any;
    const size = styles.iconSize || this.cesiumService.defaults.markerSize;
    const image = styles.mapIcon || this.cesiumService.defaults.markerIcon;
    const label = this.getIconLabelOptions(iconData);

    const options = {
      position: positionCartesian,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      billboard: {
        image: image,
        width: size.width,
        height: size.height,
        rotation: Cesium.Math.toRadians(-(iconData.heading || 0))
      },
      label: label,
      show: iconData.isShow,
      options: {
        hoverText: styles.hoverText,
        data: iconData.optionsData,
        type: iconData.type
      }
    };

    // this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    if (entityCE) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          entityCE[key] = options[key];
        }
      }
      return entityCE;
    }
    else {
      return this.cesiumService.cesiumViewer[mapDomId].entities.add(options);
    }
  };

  // private createIconLabelEntity = (mapDomId: string, object: DRAW_OBJECT, label: DRAW_LABEL) => {
  //   const size = object.modeDefine.styles.iconSize || 30;
  //
  //   const iconLabel = this.cesiumService.cesiumViewer[mapDomId].entities.add({
  //     position: Cesium.Cartesian3.fromDegrees(object.location.longitude, object.location.latitude, object.location.altitude),
  //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  //     label: {
  //       text: label.text,
  //       font: '10pt monospace',
  //       showBackground: true,
  //       eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
  //       pixelOffset: new Cesium.Cartesian2(0, size / 2),
  //       style: Cesium.LabelStyle.FILL,
  //       fillColor: Cesium.Color.BLACK,
  //       backgroundColor: Cesium.Color.fromCssColorString(label.color || 'rgba(255, 255 ,255 ,1)'),
  //       // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
  //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //       verticalOrigin: Cesium.VerticalOrigin.TOP,
  //     }
  //   });
  //
  //   this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
  //   return iconLabel;
  // };

  private getIconLabelOptions = (object: ICON_DATA): {} => {
    let iconLabel;
    if (object.modeDefine.styles && object.modeDefine.styles.labelText) {
      const text = object.modeDefine.styles.labelText;
      const offset = object.modeDefine.styles.labelOffset || {x: 0, y: 0};
      const backgroundColor = this.rgbaToCesiumColor(object.modeDefine.styles.labelBackground || this.cesiumService.defaults.labelBackground);

      iconLabel = {
        text: text,
        font: this.cesiumService.defaults.font,
        showBackground: true,
        eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
        pixelOffset: new Cesium.Cartesian2(offset.x, offset.y),
        style: Cesium.LabelStyle.FILL,
        fillColor: Cesium.Color.BLACK,
        backgroundColor: backgroundColor,
        // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
      };
    }
    return iconLabel;
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
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconLabelCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE].hasOwnProperty(billboardId) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId] !== {}) {
          //     this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId]);
          //     delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId];
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public removeIconFromMap = (domId: string, billboardId: string): boolean => {
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
              res = true;
            }
          }
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconLabelCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE].hasOwnProperty(billboardId) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId] !== {}) {
          //     this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId]);
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public hideIconOnMap = (domId: string, billboardId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE].hasOwnProperty(billboardId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] !== {}) {
               this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].show = false;
              res = true;
            }
          }
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconLabelCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE].hasOwnProperty(billboardId) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId] !== {}) {
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId].show = false;
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public showIconOnMap = (domId: string, billboardId: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE].hasOwnProperty(billboardId) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId] !== {}) {
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].show = true;
              res = true;
            }
          }
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.iconLabelCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE].hasOwnProperty(billboardId) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId] !== {}) {
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconLabelCE][billboardId].show = true;
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public editIcon = (domId: string, billboardId: string, iconUrl: string, size: {width: number, height: number}): boolean => {
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
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.image = iconUrl;
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.width = size.width;
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.iconCE][billboardId].billboard.height = size.width;
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
  public drawPolygonManually = (domId: string, positions: POINT3D[], idPolygon: string, isCross: boolean): boolean => {
    // this.removePolygonManually(domId, idPolygon);
    const color = isCross ? this.cesiumService.colors.polygonCross : this.cesiumService.colors.polygon;
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.tempPolygon === undefined || this.tempPolygon !== idPolygon) {
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] =
            this.createPolygonManuallyEntity(mapDomId, mapsCE[mapDomId], positions, color);
          this.tempPolygon = idPolygon;
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
    // this.cesiumService.scene[mapDomId].globe.depthTestAgainstTerrain = false;
    return polygon;
  };

  private updatePolygonManually = (mapDomId: string, latlong: POINT3D[], idPolygon, color: string): void => {
    this.tempPerimeterPosition.data = this.arrayPointsToCartesian3(latlong);
    this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polyline.material.color.setValue(this.rgbaToCesiumColor(color));
  };

  // ======== Server =======================
  public drawPolygonFromServer = (domId: string, polygonData: POLYGON_DATA): boolean => {
    // this.deletePolygonManually(domId, idPolygon);
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (polygonData.polygon) {
          //polygon
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] =
            this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE] || {};
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][polygonData.id] =
            this.createPolygonFromServerEntity(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][polygonData.id], polygonData);
          //label
          // this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE] =
          //   this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE] || {};
          // this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] =
          //   this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] || {};
          // this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] =
          //   this.createLabel(mapDomId, mapsCE[mapDomId], positions, title);
          res = true;
        }
      }
    }
    return res;
  };

  private createPolygonFromServerEntity = (mapDomId: string, entityCE: object, polygonData: POLYGON_DATA): {} => {
    const positionsCartesian = this.arrayPointsToCartesian3(polygonData.polygon);

    const styles: POLYGON_STYLES = (polygonData.modeDefine && polygonData.modeDefine.styles) ? polygonData.modeDefine.styles : {} as any;
    const outlineColor =  this.rgbaToCesiumColor(styles.color || this.cesiumService.colors.polygon);
    const fillColor = styles.fillColor ? this.rgbaToCesiumColor(styles.fillColor) : undefined;
    const labelOptions = this.getPolygonLabelOptions(polygonData);
    let labelLocation;
    if (labelOptions) {
      labelLocation = this.pointDegreesToCartesian3(styles.polygonLabelPosition || this.cesiumService.getPolygonCenter(polygonData.polygon));
    }
    const polygon =  fillColor ? {
      hierarchy: positionsCartesian,
      height: 0,
      material: fillColor,
      outline: false,
    } : undefined;

    const options = {
      name: 'polygon',
      polygon: polygon,
      polyline: {
        positions: positionsCartesian,
        width: 4,
        material: outlineColor,
      },
      position: labelLocation,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      label: labelOptions,
      show: polygonData.isShow,
      options: {
        hoverText: styles.hoverText,
        data: polygonData.optionsData,
        type: polygonData.type
      }
    };


    if (entityCE) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          entityCE[key] = options[key];
        }
      }
      return entityCE;
    }
    else {
      return this.cesiumService.cesiumViewer[mapDomId].entities.add(options);
    }

  };

  private getPolygonLabelOptions = (polygonData: POLYGON_DATA): {} => {
    let polygonLabel;
    if (polygonData.modeDefine.styles && polygonData.modeDefine.styles.labelText) {
      const text = polygonData.modeDefine.styles.labelText;

      polygonLabel = {
        text: text,
        font: this.cesiumService.defaults.font,
        showBackground: false,
        eyeOffset: new Cesium.Cartesian3(0, 0, -100), // to prevent labels mixing
        pixelOffset: new Cesium.Cartesian2(0, 0),
        style: Cesium.LabelStyle.FILL,
        // outline: true,
        fillColor: Cesium.Color.BLACK,
        // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        //outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.END,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      };
    }
    return polygonLabel;
  };

  // private getPolygonLabelOptions = (positions: POINT3D[], title: string): {position: CARTESIAN3, label: any} => {
  //   const posHeight: POINT = this.getPolygonCentroid(positions);
  //   const position = this.arrayPointsToCartesian3(positions);
  //
  //
  //   const center = Cesium.BoundingSphere.fromPoints(position).center;
  //   // Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
  //   const positionCenter = new Cesium.ConstantPositionProperty(center);
  //
  //   const label = {
  //     // position: positionCenter,
  //     text: title,
  //     font: '14pt monospace',
  //     showBackground: false,
  //     eyeOffset: new Cesium.Cartesian3(0, 0, -100), // to prevent labels mixing
  //     pixelOffset: new Cesium.Cartesian2(0, 0),
  //     style: Cesium.LabelStyle.FILL,
  //     // outline: true,
  //     fillColor: Cesium.Color.BLACK,
  //     // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
  //     outlineColor: Cesium.Color.BLACK,
  //     //outlineWidth: 2,
  //     horizontalOrigin: Cesium.HorizontalOrigin.END,
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //     // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
  //   };
  //
  //   return {
  //     label: label,
  //     position: positionCenter,
  //   };
  // };

  // private createLabel = (mapDomId: string, mapCE: any, positions: POINT3D[], title: string): Array<{}> => {
  //   const posHeight: POINT = this.getPolygonCentroid(positions);
  //   const position = this.arrayPointsToCartesian3(positions);
  //
  //
  //   const center = Cesium.BoundingSphere.fromPoints(position).center;
  //   // Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
  //    const positionCenter = new Cesium.ConstantPositionProperty(center);
  //
  //   const label = {
  //     // position: positionCenter,
  //     text: title,
  //     font: '10pt monospace',
  //     showBackground: false,
  //     eyeOffset: new Cesium.Cartesian3(0, 0, 0), // to prevent labels mixing
  //     pixelOffset: new Cesium.Cartesian2(-20, 0),
  //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //     outline: true,
  //     fillColor: Cesium.Color.BLACK,
  //     // textShadow: '2px 2px 4px ' + Cesium.Color.BLACK.withAlpha(0.9),
  //     outlineColor: Cesium.Color.BLACK,
  //     outlineWidth: 2,
  //     horizontalOrigin: Cesium.HorizontalOrigin.END,
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
  //   };
  //
  //   return this.cesiumService.cesiumViewer[mapDomId].entities.add({
  //     label: label,
  //     position: positionCenter
  //   });
  // };

  // private getPolygonCentroid = (points): POINT => {
  //   const centroid = {x: 0, y: 0};
  //   for (let i = 0; i < points.length; i++) {
  //     const point = points[i];
  //     centroid.x += point[0];
  //     centroid.y += point[1];
  //   }
  //   centroid.x /= points.length;
  //   centroid.y /= points.length;
  //   return [centroid.x, centroid.y];
  // };

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
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.labelPolygonCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE].hasOwnProperty(idPolygon) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon] !== {}) {
          //     this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon]);
          //     delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolygon];
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public editPolygonFromServer = (domId: string, idPolygon: string, options: {outlineColor: string, fillColor: string}): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polygon) {

              const outlineMaterial = this.rgbaToCesiumColor(options.outlineColor || this.cesiumService.colors.polygon);
              const fillMaterial = options.fillColor ? this.rgbaToCesiumColor(options.fillColor) : undefined;
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polygon.outlineColor = outlineMaterial;
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polygon.material = fillMaterial;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public hidePolygonOnMap = (domId: string, idPolygon: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polygon) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].show = false;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public showPolygonOnMap = (domId: string, idPolygon: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polygonCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE].hasOwnProperty(idPolygon) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].polygon) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polygonCE][idPolygon].show = true;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  // ==================POLYLINE==========================================================================================
  public createPolylineFromServer = (domId: string, polylineData: POLYLINE_DATA) => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        // Create Polyline
        this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE] =
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE] || {};
        this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][polylineData.id] =
          this.createPolyline(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][polylineData.id], polylineData);

        res = true;
      }
    }
    return res;
  };

  private createPolyline = (mapDomId: string, entityCE: any, polylineData: POLYLINE_DATA) => {
    const positionsCartesian = this.arrayPointsToCartesian3(polylineData.polyline);

    const styles: POLYLINE_STYLES = (polylineData.modeDefine && polylineData.modeDefine.styles) ? polylineData.modeDefine.styles : {} as any;
    const color = styles.color || this.cesiumService.colors.polyline;
    const material = styles.isDotted ? new Cesium.PolylineDashMaterialProperty({color: this.rgbaToCesiumColor(color)}) : this.rgbaToCesiumColor(color);

    const options = {
      name: 'Polyline',
      polyline: {
        positions: positionsCartesian,
        width: 4,
        material: material,
      },
      show: polylineData.isShow,
      options: {
        hoverText: styles.hoverText,
        data: polylineData.optionsData,
        type: polylineData.type
      }
    };

    if (entityCE) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          entityCE[key] = options[key];
        }
      }
      return entityCE;
    }
    else {
      return this.cesiumService.cesiumViewer[mapDomId].entities.add(options);
    }
  };

  public deletePolylineFromMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // polyline
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline];
              res = true;
            }
          }
          // //  label
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.labelPolygonCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE].hasOwnProperty(idPolyline) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline] !== {}) {
          //     this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline]);
          //     delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline];
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public hidePolylineOnMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline].polyline) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline].show = false;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public showPolylineOnMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.polylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline].polyline) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.polylineCE][idPolyline].show = true;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  // ==================ARROW POLYLINE==========================================================================================
  public createArrowPolylineFromServer = (domId: string, arrowData: POLYLINE_DATA) => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        // Create Polyline
        this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE] =
          this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE] || {};
        this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][arrowData.id] =
          this.createArrowPolyline(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][arrowData.id], arrowData);

        if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][arrowData.id]) {
          res = true;
        }
      }
    }
    return res;
  };

  private createArrowPolyline = (mapDomId: string, entityCE: any, arrowData: POLYLINE_DATA) => {
    const positions = this.arrayPointsToCartesian3(arrowData.polyline);
    const styles: POLYLINE_STYLES = (arrowData.modeDefine && arrowData.modeDefine.styles) ? arrowData.modeDefine.styles : {} as any;

    const options = {
      name: 'Polyline',
      polyline: {
        positions: positions,
        width: 15,
        isShow: arrowData.isShow,
        followSurface : false,
        material: new Cesium.PolylineArrowMaterialProperty(this.rgbaToCesiumColor(this.cesiumService.colors.arrowColor)),
      },
      options: {
        hoverText: styles.hoverText,
        data: arrowData.optionsData,
        type: arrowData.type
      }
    };

    if (entityCE) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          entityCE[key] = options[key];
        }
      }
      return entityCE;
    }
    else {
      return this.cesiumService.cesiumViewer[mapDomId].entities.add(options);
    }
  };

  public deleteArrowPolylineFromMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // polyline
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.arrowPolylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline] !== {}) {
              this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline]);
              delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline];
              res = true;
            }
          }
          // //  label
          // if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.labelPolygonCE)) {
          //   if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE].hasOwnProperty(idPolyline) &&
          //     this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline] !== {}) {
          //     this.cesiumService.removeItemCEFromMap(mapDomId, this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline]);
          //     delete this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.labelPolygonCE][idPolyline];
          //     res = true;
          //   }
          // }
        }
      }
    }
    return res;
  };

  public hideArrowPolylineOnMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.arrowPolylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline].polyline) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline].show = false;
              res = true;
            }
          }
        }
      }
    }
    return res;
  };

  public showArrowPolylineOnMap = (domId: string, idPolyline: string): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.cesiumService.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (this.cesiumService.cesiumMapObjects.hasOwnProperty(mapDomId) && this.cesiumService.cesiumMapObjects[mapDomId] !== undefined) {
          // delete locationPoint
          if (this.cesiumService.cesiumMapObjects[mapDomId].hasOwnProperty(TYPE_OBJECTS_CE.arrowPolylineCE)) {
            if (this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE].hasOwnProperty(idPolyline) &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline] !== {} &&
              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline].polyline) {

              this.cesiumService.cesiumMapObjects[mapDomId][TYPE_OBJECTS_CE.arrowPolylineCE][idPolyline].show = true;
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
    let clickPosition: POINT3D;
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
    let clickPosition: POINT3D;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.endPosition);
    if (clickPosition) {
      const pickedObjects = this.cesiumService.cesiumViewer[mapDomId].scene.drillPick(clickPositionMap.endPosition);
      // const obj: any = false;
      //TODO:
      // const object: { arr: Array<any>, cesiumEntity: any } = {arr: [], cesiumEntity: undefined};
      let item = {};
      // const IDs = {};
      pickedObjects.forEach((pickedObject) => {
        if (Cesium.defined(pickedObject) && pickedObject.id /*&& pickedObject.id._id !== 'cesium drawing distance'*/) {
          // need to check if _id exists so that the item isn't saved twice when border is picked
          item = _.get(pickedObject, 'id.options') || {};
          // let id;
        //   if(item.obj) {
        //     id = (item.type in SelectableItemTypes) ? item.obj._id : item.type + (item.obj.AssetId || item.obj.GspLineId || item.obj.GspObjectId || item.obj.AreaId);
        //   }
        //
        //   if ((item.type in SelectableItemTypes || item.type in ShapeTypes) && !IDs.hasOwnProperty(id)) {
        //     IDs[id] = true;
        //     object.arr.push(pickedObject.id);
        //   } else {
        //     object.cesiumEntity = pickedObject.id;
        //   }
        //
        }
      });

      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.endPosition,
              pointLatLng: clickPosition,
              object: item
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
    let clickPosition: POINT3D;
    clickPosition = this.pixelsToLatlong(mapDomId, clickPositionMap.position);
    const distance = this.calculatePixelToMeter(mapDomId, clickPositionMap.position);

    if (clickPosition) {
      const pickedObjects = this.cesiumService.cesiumViewer[mapDomId].scene.drillPick(clickPositionMap.position);
      let item = {};
      pickedObjects.forEach((pickedObject) => {
        if (Cesium.defined(pickedObject) && pickedObject.id) {
          item = _.get(pickedObject, 'id.options') || {};
        }
      });
      for (const listenerName in leftClickListeners) {
        if (leftClickListeners.hasOwnProperty(listenerName)) {
          try {
            leftClickListeners[listenerName]({
              type: type,
              pointPX: clickPositionMap.position,
              pointLatLng: clickPosition,
              distance: distance,
              object: item
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
    let clickPosition: POINT3D;
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
    let clickPosition: POINT3D;
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

  public pixelsToLatlong = (mapDomId: string, clickPositionMap: { x: number, y: number }): POINT3D => {
    let clickPosition: POINT3D;
    if (clickPositionMap !== undefined) {
      const cartesian = this.cesiumService.cesiumViewer[mapDomId].camera.pickEllipsoid(clickPositionMap,
        this.cesiumService.cesiumViewer[mapDomId].scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude)/*.toFixed(2)*/;
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude)/*.toFixed(2)*/;
        clickPosition = [+longitudeString, +latitudeString, 0];
      }
    }
    return clickPosition;
  };

  public arrayPointsToCartesian3 = (positions: POINT3D[]): CARTESIAN3[] => {
    const _positions: CARTESIAN3[] = [];
    for (let i = 0; i < positions.length; i++) {
      _positions.push(this.pointDegreesToCartesian3(positions[i]));
    }
    return _positions;
  };

  private pointDegreesToCartesian3 = (position: POINT3D): CARTESIAN3 => {
    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2] || 0);
  };

  public rgbaToCesiumColor = (rgba) => {
    return Cesium.Color.fromCssColorString(rgba || 'rgba(255, 255 ,255 ,1)');
  };
}
