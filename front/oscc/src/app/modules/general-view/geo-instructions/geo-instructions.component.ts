import {Component, Input, OnInit} from '@angular/core';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  GEOPOINT3D,
  POINT3D,
  TASK_DATA_UI
} from '../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {STATE_DRAW} from '../../../../types';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {CustomToasterService} from '../../../services/toasterService/custom-toaster.service';
import {LocationService} from '../../../services/locationService/location.service';
import {PolygonService} from '../../../services/polygonService/polygon.service';
import {ArrowService} from '../../../services/arrowService/arrow.service';
import {PolylineService} from '../../../services/polylineService/polyline.service';

@Component({
  selector: 'app-geo-instructions',
  templateUrl: './geo-instructions.component.html',
  styleUrls: ['./geo-instructions.component.scss']
})
export class GeoInstructionsComponent implements OnInit {

  @Input() element: TASK_DATA_UI;
  panelOpenState = true;
  geoInstructions = Object.values(GEOGRAPHIC_INSTRUCTION_TYPE);
  selectedGeoInstruction: GEOGRAPHIC_INSTRUCTION_TYPE;
  GEOGRAPHIC_INSTRUCTION_TYPE = GEOGRAPHIC_INSTRUCTION_TYPE;
  geoInstructionModel: GEOGRAPHIC_INSTRUCTION;
  geographicInstructionsModel: GEOGRAPHIC_INSTRUCTION [] = [];
  icon: string;
  defaultModel: GEOGRAPHIC_INSTRUCTION = {
    idTemp: undefined,
    type: undefined,
    description: '',
    location: {longitude: undefined, latitude: undefined},
    styles: {icon: ''},
    address: '',
    polygon: []
  };
  isSave: boolean = false;


  constructor(public applicationService: ApplicationService,
              public customToasterService: CustomToasterService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public arrowService: ArrowService,
              public polylineService: PolylineService) {
    this.geoInstructionModel =  _.cloneDeep(this.defaultModel);
    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      this.geoInstructionModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};
    });

    this.polygonService.polygon$.subscribe((positions: POINT3D[]) => {
      this.geoInstructionModel.polygon = positions;
    });
  }

  ngOnInit(): void {
  }

  onAddInstruction = () => {

  };

  public expendPanelGeoInstruction = (index: boolean) => {
    this.panelOpenState = index;
  };

  setSelectedInstruction = (item: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    this.selectedGeoInstruction = item;
    this.isSave = true;
    switch (item) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.applicationService.stateDraw = STATE_DRAW.drawArrow;
        this.customToasterService.info(
          {message: 'Click minimum 2 points to set a arrow. Click double click to finish', title: 'arrow'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
        this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
        this.customToasterService.info(
          {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.applicationService.stateDraw = STATE_DRAW.drawPolyline;
        this.customToasterService.info(
          {message: 'Click minimum 2 points to set a polyline. Click double click to finish', title: 'polyline'});
        break;
    }
  };

  saveInstruction = (type: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    this.isSave = false;
    this.geoInstructionModel.type = type;
    this.geoInstructionModel.styles.icon = this.setIcon(type);
    this.geoInstructionModel.idTemp = this.applicationService.geoCounter.toString();
    this.geographicInstructionsModel.push(this.geoInstructionModel);
    this.applicationService.geoCounter = this.geographicInstructionsModel.length;

    this.selectedGeoInstruction = undefined;
    this.geoInstructionModel = _.cloneDeep(this.defaultModel);
    this.element.geographicInstructions = this.geographicInstructionsModel;
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
  };

  setIcon = (type: GEOGRAPHIC_INSTRUCTION_TYPE): string => {
    let res: string;
    switch (type) {
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

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      if (this.geoInstructionModel.location.latitude !== undefined && this.geoInstructionModel.location.longitude !== undefined) {
        const locationPoint: GEOPOINT3D = {
          longitude: this.geoInstructionModel.location.longitude,
          latitude: this.geoInstructionModel.location.latitude
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
      }
    }
  };

}
