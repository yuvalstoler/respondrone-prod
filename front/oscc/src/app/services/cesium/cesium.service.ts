import {Injectable} from '@angular/core';
import {MAP} from 'src/types';
import {ViewerConfiguration} from 'angular-cesium';


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
    const cesiumViewer: any = new Cesium.Viewer(
      this.maps[0].containerId,
      {
        //  baseLayerPicker: false,
        //  resolutionScale: 0.5,
        terrainProvider : Cesium.createWorldTerrain({
          requestWaterMask: false,
          requestVertexNormals: true
        }),

        sceneModePicker: true,
        sceneMode: Cesium.SceneMode.SCENE3D,
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
        // requestRenderMode: true
      }
    );

    this.cesiumViewer[mapId] = this.cesiumViewer[mapId] || {};
    this.cesiumViewer[mapId] = cesiumViewer;


    this.scene[mapId] = this.scene[mapId] || {};
    this.scene[mapId] = this.cesiumViewer[mapId].scene;


    this.cesiumMapObjects[mapId] = this.cesiumMapObjects[mapId] || {};

    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(34.895, 32.423, 5000.0),
      duration: 2,
    });
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

}
