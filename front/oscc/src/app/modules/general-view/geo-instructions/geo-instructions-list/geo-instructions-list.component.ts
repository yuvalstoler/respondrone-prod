import {Component, Input, OnInit} from '@angular/core';
import {GEOGRAPHIC_INSTRUCTION, GEOGRAPHIC_INSTRUCTION_TYPE} from '../../../../../../../../classes/typings/all.typings';
import {LocationService} from '../../../../services/locationService/location.service';
import {PolygonService} from '../../../../services/polygonService/polygon.service';
import {ArrowService} from '../../../../services/arrowService/arrow.service';
import {PolylineService} from '../../../../services/polylineService/polyline.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


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
              public polylineService: PolylineService) { }

  ngOnInit(): void {
  }

  removeGeoInstruction = (event, index: number) => {
    event.stopPropagation();
    const geoInstruction = this.geographicInstructionsModel[index];
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.arrowService.deleteArrowPolylineManually(geoInstruction.idTemp);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.locationService.deleteLocationPointTemp(geoInstruction.idTemp);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.polygonService.deletePolygonManually(geoInstruction.idTemp);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.polylineService.deletePolylineManually(geoInstruction.idTemp);
        break;
    }
    this.geographicInstructionsModel.splice(index, 1);
  };

  drop(event: CdkDragDrop<GEOGRAPHIC_INSTRUCTION[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      moveItemInArray(this.geographicInstructionsModel, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

  }

}
