import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  POINT,
  POINT3D
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
  @Input() isNotViewOnly: boolean = true;
  @Output() changeGeographicInstructionsModel = new EventEmitter<any[]>();

  constructor(public locationService: LocationService,
              public polygonService: PolygonService,
              public arrowService: ArrowService,
              public polylineService: PolylineService,
              public mapGeneralService: MapGeneralService) {
  }

  ngOnInit(): void {
  }

  removeGeoInstruction = (event, geoInstruction, index: number) => {
    event.stopPropagation();
    // const geoInstruction = this.geographicInstructionsModel[index];
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        this.locationService.deleteLocationPoint(geoInstruction.id);
        this.mapGeneralService.deleteIcon(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.locationService.deleteLocationPoint(geoInstruction.id);
        this.mapGeneralService.deleteIcon(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.mapGeneralService.hideArrowPolyline(geoInstruction.id);
        // this.arrowService.deleteArrowPolylineManually(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.mapGeneralService.hidePolygon(geoInstruction.id);
        // this.polygonService.deletePolygonManually(geoInstruction.id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.mapGeneralService.hidePolyline(geoInstruction.id);
        // this.polylineService.deletePolylineManually(geoInstruction.id);
        break;
    }
    // todo: find index by obj geoInstruction
    this.geographicInstructionsModel.splice(index, 1);
    this.changeGeographicInstructionsModel.emit(this.geographicInstructionsModel);
  };

  flyToInstruction = (geoInstruction: GEOGRAPHIC_INSTRUCTION) => {
    let coordinate: POINT | POINT3D;
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        coordinate = geoInstruction.arrow[geoInstruction.arrow.length - 1];
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        coordinate = [geoInstruction.location.lon, geoInstruction.location.lat, 0];
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        coordinate = [geoInstruction.location.lon, geoInstruction.location.lat, 0];
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

  getIcon = (geoInstruction: GEOGRAPHIC_INSTRUCTION): string => {
    let res: string;
    switch (geoInstruction.type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        res = 'arrow_forward';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        res = 'location_on';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        res = 'location_on';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        res = 'crop_5_4';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        res = 'timeline';
        break;
    }
    return res;
  };


}
