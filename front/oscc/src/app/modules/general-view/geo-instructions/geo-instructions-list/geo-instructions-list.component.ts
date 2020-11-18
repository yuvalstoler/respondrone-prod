import {Component, Input, OnInit} from '@angular/core';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  POINT, POINT3D
} from '../../../../../../../../classes/typings/all.typings';
import {LocationService} from '../../../../services/locationService/location.service';
import {PolygonService} from '../../../../services/polygonService/polygon.service';
import {ArrowService} from '../../../../services/arrowService/arrow.service';
import {PolylineService} from '../../../../services/polylineService/polyline.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MapGeneralService} from '../../../../services/mapGeneral/map-general.service';


@Component({
  selector: 'app-geo-instructions-list',
  templateUrl: './geo-instructions-list.component.html',
  styleUrls: ['./geo-instructions-list.component.scss']
})
export class GeoInstructionsListComponent implements OnInit {

  @Input() geographicInstructionsModel: GEOGRAPHIC_INSTRUCTION [] = [];

  constructor(public locationService: LocationService,
              public polygonService: PolygonService,
              public arrowService: ArrowService,
              public polylineService: PolylineService,
              public mapGeneralService: MapGeneralService) { }

  ngOnInit(): void {
  }

  removeGeoInstruction = (event, index: number) => {
    event.stopPropagation();
    const geoInstruction = this.geographicInstructionsModel[index];
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.arrowService.deleteArrowPolylineManually(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.locationService.deleteLocationPointTemp(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.polygonService.deletePolygonManually(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.polylineService.deletePolylineManually(geoInstruction.id);
        break;
    }
    this.geographicInstructionsModel.splice(index, 1);
  };

  flyToInstruction = (geoInstruction: GEOGRAPHIC_INSTRUCTION) => {
    let coordinate: POINT | POINT3D;
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        coordinate = geoInstruction.arrow[geoInstruction.arrow.length - 1];
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        // coordinate = geoInstruction.address;
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        coordinate = [geoInstruction.location.longitude, geoInstruction.location.latitude];
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        coordinate = geoInstruction.polygon[0];
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        coordinate = geoInstruction.polyline[0];
        break;
    }
    this.mapGeneralService.flyToObject(coordinate);
  };

  drop = (event: CdkDragDrop<GEOGRAPHIC_INSTRUCTION[]>) => {
    if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      moveItemInArray(this.geographicInstructionsModel, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        // event.container.data,
        this.geographicInstructionsModel,
        event.previousIndex,
        event.currentIndex);
    }
  };


}
