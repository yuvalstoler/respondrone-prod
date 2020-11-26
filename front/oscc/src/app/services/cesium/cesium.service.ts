import {Injectable} from '@angular/core';
import {MAP} from 'src/types';
import {ViewerConfiguration} from 'angular-cesium';
import {CARTESIAN3, POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
import * as turf from '@turf/turf';
import {mapDefaultPosition} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CesiumService {

  maps: { id: string, sceneMode: any, containerId: any }[] = [
    {
      id: 'main-map',
      sceneMode: Cesium.SceneMode.SCENE3D,
      containerId: 'map-container-one'
    }/*,
    {
      id: 'sub-map',
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      containerId: 'map-container-two'
    }*/
  ];
  cesiumViewer: MAP<any> = {};
  // keys - [domId][type][id of entity data (for example: AirVehicleId)]; value - Cesium object
  cesiumMapObjects: MAP<MAP<MAP<any>>> = {};
  //scene
  scene: MAP<any> = {};

  colors = {
    polygonNFZ: 'rgba(255, 52, 47, 1)',
    dynamicNFZ: 'rgba(23, 173, 17, 1)',
    polygon: 'rgba(26, 115, 255, 1)',
    polygonFromServer: 'rgba(255, 208, 11, 1)',
    selected: 'rgba(250, 17, 255, 1)',
    notSelected: 'rgba(255, 253, 34, 1)',
    polylineStop: '#ffffff',
    polylineStart: 'rgba(89, 177, 241, 1)',
    borderColor: '#000000'
  };

  constructor(private viewerConf: ViewerConfiguration) {
    // viewerConf.viewerOptions = [{
    //   selectionIndicator: false,
    //   timeline: false,
    //   infoBox: false,
    //   fullscreenButton: false,
    //   baseLayerPicker: false,
    //   animation: false,
    //   shouldAnimate: false,
    //   homeButton: false,
    //   geocoder: false,
    //   navigationHelpButton: false,
    //   navigationInstructionsInitiallyVisible: false,
    //   mapMode2D: Cesium.MapMode2D.ROTATE,
    //   sceneMode: Cesium.SceneMode.SCENE3D,
    //
    //   sceneModePicker: true,
    //   shadows: false,
    //   skyAtmosphere: false,
    //   skyBox: false,
    //
    //     // terrainProvider : Cesium.createWorldTerrain({
    //     //   requestWaterMask: false,
    //     //   requestVertexNormals: true
    //     // }),
    // }];

    // // Will be called on viewer initialistion
    // viewerConf.viewerModifier = (viewer: any) => {
    //   // Remove default double click zoom behaviour
    //   viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // };
  }

  public createMap = (mapId: string) => {
    // Your access token can be found at: https://cesium.com/ion/tokens.
    // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzA2MGYzNi1mOWU5LTQwMzItYjcxNi1hYTQ0YzlhNzY5MzgiLCJpZCI6MzcyNzEsImlhdCI6MTYwNDgzMjcxMH0.s8iZsRvt0A0-j9rSE5AxJFyktfLnFWvX5JlXgx5fazI';
    const cesiumViewer: any = new Cesium.Viewer(
      this.maps[0].containerId,
      {
        //  baseLayerPicker: false,
        //  resolutionScale: 0.5,
        terrainProvider: Cesium.createWorldTerrain({
          requestWaterMask: false,
          requestVertexNormals: true
        }),

        sceneModePicker: true,
        sceneMode: Cesium.SceneMode.SCENE2D,
        navigationHelpButton: false,
        timeline: false,
        selectionIndicator: false,
        geocoder: false,
        navigationInstructionsInitiallyVisible: false,
        infoBox: false,
        animation: false,
        shadows: false,
        fullscreenButton: false,
        skyAtmosphere: false,
        homeButton: false,
        skyBox: false,
        requestRenderMode: true,
        maximumRenderTime: Infinity,
      }
    );

    this.cesiumViewer[mapId] = this.cesiumViewer[mapId] || {};
    this.cesiumViewer[mapId] = cesiumViewer;


    this.scene[mapId] = this.scene[mapId] || {};
    this.scene[mapId] = this.cesiumViewer[mapId].scene;


    this.cesiumMapObjects[mapId] = this.cesiumMapObjects[mapId] || {};
    cesiumViewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(mapDefaultPosition.lon, mapDefaultPosition.lat,  mapDefaultPosition.height),
      duration: 2,
    });

    setInterval(() => {
      cesiumViewer.scene.requestRender();
    }, 100);
  };

  public getMapByDomId = (domId): MAP<any> => {
    const res: MAP<any> = {};
    if (domId === undefined) {
      for (const myMapKey in this.cesiumViewer) {
        if (this.cesiumViewer.hasOwnProperty(myMapKey)) {
          if (this.cesiumViewer[myMapKey] !== undefined) {
            res[myMapKey] = this.cesiumViewer[myMapKey];
          }
        }
      }
    } else {
      if (this.cesiumViewer[domId] !== undefined) {
        res[domId] = this.cesiumViewer[domId];
      }
    }
    return res;
  };

  public removeItemCEFromMap = (mapDomId: string, cesiumObject) => {
    this.cesiumViewer[mapDomId].entities.remove(cesiumObject);
  };

  public updateItemCEOnMap = (mapDomId: string, entityCE, options) => {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        entityCE[key] = options[key];
      }
    }
    return entityCE;
  };

  public flyToObject = (domId: string, coordinates: POINT | POINT3D): boolean => {
    let res = false;
    const mapsCE: MAP<any> = this.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        this.flyTo(mapDomId, coordinates);
        res = true;
      }
    }
    return res;
  };

  public flyTo = (mapDomId: string, coordinates: POINT | POINT3D) => {
    this.cesiumViewer[mapDomId].camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 500),
      duration: 2,
    });
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

  public getPolygonCenter = (positions: POINT[] | POINT3D[]): POINT3D => {
    const poly = turf.polygon([positions]);
    const center = turf.centroid(poly).geometry.coordinates;
    // positions = this.arrayPointsToCartesian3(item.Points);
    return [center[0], center[1], 0];
  };

  public changeCursor = (domId: string, state: boolean) => {
    const mapsCE: MAP<any> = this.getMapByDomId(domId);
    for (const mapDomId in mapsCE) {
      if (mapsCE.hasOwnProperty(mapDomId)) {
        if (state) {
          this.cesiumViewer[mapDomId]._container.style.cursor = 'crosshair';
        } else {
          this.cesiumViewer[mapDomId]._container.style.cursor = 'default';
        }
      }
    }
  };

}
