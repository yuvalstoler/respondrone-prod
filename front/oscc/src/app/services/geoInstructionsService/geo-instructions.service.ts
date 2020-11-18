import {Injectable} from '@angular/core';
import {GEOGRAPHIC_INSTRUCTION, GEOGRAPHIC_INSTRUCTION_TYPE} from '../../../../../../classes/typings/all.typings';
import {LocationService} from '../locationService/location.service';
import {PolygonService} from '../polygonService/polygon.service';
import {PolylineService} from '../polylineService/polyline.service';
import {ArrowService} from '../arrowService/arrow.service';

@Injectable({
  providedIn: 'root'
})
export class GeoInstructionsService {

  constructor(public locationService: LocationService,
              public polygonService: PolygonService,
              public polylineService: PolylineService,
              public arrowService: ArrowService) {
  }

  public removeGeoInstructionsFromMap = (geoInstructions: GEOGRAPHIC_INSTRUCTION[]) => {
    geoInstructions.forEach(geoInstruction => {
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.arrow) {
        this.arrowService.deleteArrowPolylineManually(geoInstruction.id);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polyline) {
        this.polylineService.deletePolylineManually(geoInstruction.id);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polygon) {
        this.polygonService.deletePolygonManually(geoInstruction.id);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.point) {
        this.locationService.deleteLocationPointTemp(geoInstruction.id);
      }
    });
  };
}
