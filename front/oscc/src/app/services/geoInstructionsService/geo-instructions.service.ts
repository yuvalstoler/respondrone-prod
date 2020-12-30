import {Injectable} from '@angular/core';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE, LOCATION_TYPE,
  POINT, POINT3D, REPORT_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {LocationService} from '../locationService/location.service';
import {PolygonService} from '../polygonService/polygon.service';
import {PolylineService} from '../polylineService/polyline.service';
import {ArrowService} from '../arrowService/arrow.service';
import {MapGeneralService} from '../mapGeneral/map-general.service';

@Injectable({
  providedIn: 'root'
})
export class GeoInstructionsService {

  tempGeoInstructionObjectCE: {type: LOCATION_TYPE, objectCE: any, id: string, report: GEOGRAPHIC_INSTRUCTION};

  constructor(public locationService: LocationService,
              public polygonService: PolygonService,
              public polylineService: PolylineService,
              public arrowService: ArrowService,
              public mapGeneralService: MapGeneralService) {
  }

  public removeGeoInstructionsFromMap = (geoInstructions: GEOGRAPHIC_INSTRUCTION[]) => {
    geoInstructions.forEach(geoInstruction => {
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.arrow) {
        this.arrowService.deleteArrowPolylineManually(geoInstruction.id);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.address) {
        this.locationService.deleteLocationPointTemp(geoInstruction.id);
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


  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

  public hideObjectOnMap = (tempObjectCE) => {
    switch (tempObjectCE.type) {
      case LOCATION_TYPE.address: {
        this.mapGeneralService.hideIcon(tempObjectCE.id);
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.mapGeneralService.hideIcon(tempObjectCE.id);
        break;
      }
    }
  };
}
