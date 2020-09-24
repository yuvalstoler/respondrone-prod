import { Component, OnInit, AfterViewInit } from '@angular/core';
import {MapGeneralService} from 'src/app/services/mapGeneral/map-general.service';
import {CesiumService} from 'src/app/services/cesium/cesium.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor(private mapGeneralService: MapGeneralService,
              public cesiumService: CesiumService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void { 
    this.mapGeneralService.createCesiumMap([this.cesiumService.maps[0].id]);
  }

}
