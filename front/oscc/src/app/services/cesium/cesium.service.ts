import { Injectable } from '@angular/core';
import {MAP} from 'src/types';
import {SceneMode} from 'angular-cesium';


@Injectable({
  providedIn: 'root'
})
export class CesiumService {

  maps: {id: string, sceneMode: any, containerId: any}[] = [
    {
      id: 'main-map',
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      containerId: 'map-container-one'
    }/*,
    {
      id: 'sub-map',
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      containerId: 'map-container-two'
    }*/
  ];
  cesiumViewer: MAP<any> = {};
  // keys - [domId][type][id of entity data (for example: AirVehicleId)]; value - Leaflet object
  cesiumMapObjects: MAP<MAP<MAP<any>>> = {};
  //scene
  scene: MAP<any> = {};

  constructor() { }

  public createMap = (mapId: string) => {

    // const cesiumViewer: any = new Cesium.Viewer(this.maps[0].containerId, {
    //   //  baseLayerPicker: false,
    //   //  resolutionScale: 0.5,
    //   terrainProvider : Cesium.createWorldTerrain({
    //     requestWaterMask: false,
    //     requestVertexNormals: true
    //   }),
    //
    //   sceneModePicker: true,
    //   sceneMode: Cesium.SceneMode.SCENE3D,
    //   navigationHelpButton: false,
    //   timeline: false,
    //   selectionIndicator: false,
    //   geocoder: false,
    //   navigationInstructionsInitiallyVisible: false,
    //   infoBox: false,
    //   animation: false,
    //   shadows: false,
    //   fullscreenButton: false,
    //   skyAtmosphere: false,
    //   homeButton: false,
    //   skyBox: false
    // });
    //
    // this.cesiumViewer[mapId] = this.cesiumViewer[mapId] || {};
    // this.cesiumViewer[mapId] = cesiumViewer;
    //
    //
    // this.scene[mapId] = this.scene[mapId] || {};
    // this.scene[mapId] = this.cesiumViewer[mapId].scene;
    //
    //
    // this.cesiumMapObjects[mapId] = this.cesiumMapObjects[mapId] || {};
    //
    // cesiumViewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(34.895, 32.423, 5000.0),
    //   duration: 2,
    // });
  };
}
