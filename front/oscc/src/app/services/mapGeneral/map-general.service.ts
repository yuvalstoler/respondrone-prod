import { Injectable } from '@angular/core';
import {CesiumService} from '../cesium/cesium.service';

@Injectable({
  providedIn: 'root'
})
export class MapGeneralService {

  constructor(private cesiumService: CesiumService) { }

  public createCesiumMap = (mapId: string[]): void => {
    // if (this.mapSelected === MAP_TYPE.Cesium || this.mapSelected === MAP_TYPE.AllMaps) {
      this.cesiumService.createMap(mapId[0]);
      // this.cesiumDomId = mapId[0];
      // this.setListenerCallbacks(mapId[0]);
    // }
  };
  
}
