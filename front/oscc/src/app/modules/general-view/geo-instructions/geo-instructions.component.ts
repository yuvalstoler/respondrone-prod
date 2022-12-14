import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  GEOPOINT3D_SHORT,
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
import {MatMenuTrigger} from '@angular/material/menu';
import {MapGeneralService} from '../../../services/mapGeneral/map-general.service';
import {GeoInstructionsService} from '../../../services/geoInstructionsService/geo-instructions.service';

@Component({
  selector: 'app-geo-instructions',
  templateUrl: './geo-instructions.component.html',
  styleUrls: ['./geo-instructions.component.scss']
})
export class GeoInstructionsComponent implements OnInit, AfterViewChecked {

  @ViewChild(MatMenuTrigger) triggerBtn: MatMenuTrigger;
  @Input() element: TASK_DATA_UI;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrolledToBottom = false;

  geoInstructions = Object.values(GEOGRAPHIC_INSTRUCTION_TYPE);
  selectedGeoInstruction: GEOGRAPHIC_INSTRUCTION_TYPE;
  GEOGRAPHIC_INSTRUCTION_TYPE = GEOGRAPHIC_INSTRUCTION_TYPE;
  geoInstructionModel: GEOGRAPHIC_INSTRUCTION;
  geographicInstructionsModel: GEOGRAPHIC_INSTRUCTION [] = [];
  icon: string;
  defaultModel: GEOGRAPHIC_INSTRUCTION = {
    id: undefined,
    type: undefined,
    description: '',
    location: {lon: undefined, lat: undefined, alt: 0},
    modeDefine: {
      styles: {} as any
    },
    address: '',
    polygon: [],
    arrow: [],
    polyline: []
  };
  isNotSaveGeoInstructions: boolean = false;


  constructor(public applicationService: ApplicationService,
              public customToasterService: CustomToasterService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public arrowService: ArrowService,
              public mapGeneralService: MapGeneralService,
              public polylineService: PolylineService,
              public geoInstructionsService: GeoInstructionsService) {

    this.geoInstructionModel = _.cloneDeep(this.defaultModel);

    // add location to model
    this.locationService.locationPoint$.subscribe(latlon => {
      this.geoInstructionModel.location = {lon: latlon.lon, lat: latlon.lat, alt: latlon.alt};
    });

    // add polygon to model
    this.polygonService.polygon$.subscribe((positions: POINT3D[]) => {
      this.geoInstructionModel.polygon = positions;
    });

    // add arrow to model
    this.arrowService.arrow$.subscribe((positions: POINT3D[]) => {
      this.geoInstructionModel.arrow = positions;
    });

    // add polyline to model
    this.polylineService.polyline$.subscribe((positions: POINT3D[]) => {
      this.geoInstructionModel.polyline = positions;
    });
  }

  ngOnInit(): void {
    this.geographicInstructionsModel = _.cloneDeep(this.element.geographicInstructions);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onAddInstruction = () => {
    if (this.isNotSaveGeoInstructions) {
      this.triggerBtn.closeMenu();
    } else {
      this.triggerBtn.openMenu();
    }
  };

  setSelectedInstruction = (type: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    this.selectedGeoInstruction = type;
    this.isNotSaveGeoInstructions = true;
    this.scrolledToBottom = false;
    switch (type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.applicationService.stateDraw = STATE_DRAW.drawArrow;
        this.mapGeneralService.changeCursor(true);
        this.customToasterService.info(
          {message: 'Click minimum 2 points to set a arrow. Click double click to finish', title: 'arrow'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        this.geoInstructionModel.address = '';
        this.mapGeneralService.changeCursor(false);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
        this.mapGeneralService.changeCursor(true);
        this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
        this.mapGeneralService.changeCursor(true);
        this.customToasterService.info(
          {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.applicationService.stateDraw = STATE_DRAW.drawPolyline;
        this.mapGeneralService.changeCursor(true);
        this.customToasterService.info(
          {message: 'Click minimum 2 points to set a polyline. Click double click to finish', title: 'polyline'});
        break;
    }
  };

  cancelInstruction = (type: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    const id = this.applicationService.getGeoCounter();
    this.scrolledToBottom = false;
    switch (type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        this.arrowService.deleteArrowPolylineManually(id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        this.locationService.deleteLocationPointTemp(id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        this.locationService.deleteLocationPointTemp(id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        this.polygonService.deletePolygonManually(id);
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        this.polylineService.deletePolylineManually(id);
        break;
    }
    this.clearInstruction();
  };

  saveInstruction = (type: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    // this.isNotSaveGeoInstructions = false;
    this.geoInstructionModel.type = type;
    // this.geoInstructionModel.modeDefine.styles.mapIcon = this.setIcon(type);
    this.geoInstructionModel.id = this.applicationService.getGeoCounter();
    this.geographicInstructionsModel.push(this.geoInstructionModel);
    this.applicationService.geoCounter = this.geographicInstructionsModel.length;
    // clear
    this.clearInstruction();
  };

  clearInstruction = () => {
    this.isNotSaveGeoInstructions = false;
    this.selectedGeoInstruction = undefined;
    this.geoInstructionModel = _.cloneDeep(this.defaultModel);
    this.element.geographicInstructions = this.geographicInstructionsModel;
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
  };

  saveGIM = (geographicInstructionsModel) => {
    this.geographicInstructionsModel = geographicInstructionsModel;
    this.element.geographicInstructions = this.geographicInstructionsModel;
    console.log(this.geographicInstructionsModel);
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      if (this.geoInstructionModel.location.lat !== undefined && this.geoInstructionModel.location.lon !== undefined) {
        const locationPoint: GEOPOINT3D_SHORT = {
          lon: this.geoInstructionModel.location.lon,
          lat: this.geoInstructionModel.location.lat,
          alt: 0
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  };

  clearAddress = (event) => {
    this.geoInstructionModel.address = '';
    const idTemp = this.applicationService.getGeoCounter();
    this.locationService.deleteLocationPointTemp(idTemp);
    // console.log(event.target.value);
    // event.target.value = '';
  };

  getAddress = (place: any) => {
    const geometry = place.geometry;
    if (geometry.viewport) {
      const lat = geometry.viewport.getCenter().lat();
      const lng = geometry.viewport.getCenter().lng();
      this.geoInstructionModel.location = {lat: lat, lon: lng, alt: 0};
      this.geoInstructionModel.address = place['formatted_address'];

      const idTemp = this.applicationService.getGeoCounter();
      // this.locationService.deleteLocationPointTemp(idTemp);
      this.locationService.drawLocationFromServer({ lat: lat, lon: lng, alt: 0 }, idTemp);
      this.mapGeneralService.flyToObject([lng, lat, 0]);
    }
  };

  scrollToBottom(): void {
    try {
      if (!this.scrolledToBottom) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        this.scrolledToBottom = true;
      }
    } catch (err) { }
  }

  onScroll = () => {
    // this.scrolledToBottom = true;
  };

}
