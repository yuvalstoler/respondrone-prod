import {Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  COMMENT,
  EVENT_DATA_UI,
  GEOPOINT3D_SHORT,
  LINKED_REPORT_DATA,
  LOCATION_NAMES,
  LOCATION_TYPE,
  POINT3D,
  PRIORITY
} from '../../../../../../classes/typings/all.typings';
import {HEADER_BUTTONS, STATE_DRAW} from '../../../types';
import {ApplicationService} from '../../services/applicationService/application.service';
import {EventService} from '../../services/eventService/event.service';
import {LocationService} from '../../services/locationService/location.service';
import {PolygonService} from '../../services/polygonService/polygon.service';
import {CustomToasterService} from '../../services/toasterService/custom-toaster.service';
import {ReportService} from '../../services/reportService/report.service';
import * as _ from 'lodash';
import {MapGeneralService} from '../../services/mapGeneral/map-general.service';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {

  // @ViewChild('title', {static: true}) firstItem: ElementRef;

  eventModel: EVENT_DATA_UI;
  types = this.applicationService.typesConfig.eventTypes;
  priorities = Object.values(PRIORITY);
  locations = Object.values(LOCATION_NAMES);
  comment = '';

  defaultEvent: EVENT_DATA_UI = {
    createdBy: this.loginService.getUserName(),
    time: undefined,
    title: '',
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location: {lon: undefined, lat: undefined, alt: 0},
    address: '',
    polygon: [],
    reportIds: [],
    comments: [],
    reports: [],
    idView: '',
    modeDefine: undefined
  };

  LOCATION_NAMES = LOCATION_NAMES;
  LOCATION_TYPE = LOCATION_TYPE;

  locationTypeByName = {
    [LOCATION_NAMES.noLocation]: LOCATION_TYPE.none,
    [LOCATION_NAMES.address]: LOCATION_TYPE.address,
    [LOCATION_NAMES.locationPoint]: LOCATION_TYPE.locationPoint,
    [LOCATION_NAMES.polygon]: LOCATION_TYPE.polygon,
  };

  constructor(public applicationService: ApplicationService,
              public eventService: EventService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public customToasterService: CustomToasterService,
              public reportService: ReportService,
              public mapGeneralService: MapGeneralService,
              public zone: NgZone,
              public dialogRef: MatDialogRef<EventDialogComponent>,
              private loginService: LoginService,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
    this.initEventModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint  || this.applicationService.stateDraw === STATE_DRAW.editLocationPoint) {
        this.eventModel.location = {lon: latlon.lon, lat: latlon.lat, alt: 0};
      }
    });

    this.polygonService.polygon$.subscribe((positions: POINT3D[]) => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawPolygon) {
        this.eventModel.polygon = positions;
      }
    });
  }

  ngOnInit() {
    // this.firstItem.nativeElement.focus();
  }

  private initEventModel = () => {
    if (this.applicationService.selectedEvents.length === 1) {
      this.eventModel = _.cloneDeep(this.applicationService.selectedEvents[0]);
      this.setTempObjectCE(this.applicationService.selectedEvents[0]);
    } else {
      this.eventModel = _.cloneDeep(this.defaultEvent);
    }
  };

  setTempObjectCE = (event: EVENT_DATA_UI) => {
    switch (event.locationType) {
      case LOCATION_TYPE.none: {
        this.eventService.tempEventObjectCE = {type: LOCATION_TYPE.none, objectCE: undefined, id: event.id, event};
        break;
      }
      case LOCATION_TYPE.address: {
        this.eventService.tempEventObjectCE = {type: LOCATION_TYPE.address, objectCE: event.location, id: event.id, event};
        break;
      }
      case LOCATION_TYPE.polygon: {
        this.eventService.tempEventObjectCE = {type: LOCATION_TYPE.polygon, objectCE: event.polygon, id: event.id, event};
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.eventService.tempEventObjectCE = {type: LOCATION_TYPE.locationPoint, objectCE: event.location, id: event.id, event};
        break;
      }
    }
  };

  // geo instructions
  onChangeLocation = (event, location: string) => {
    if (this.eventService.tempEventObjectCE !== undefined) {
      this.eventService.hideObjectOnMap(this.eventService.tempEventObjectCE);
    }
    if (location === LOCATION_NAMES.noLocation) {
      this.eventModel.locationType = LOCATION_TYPE.none;
      this.eventModel.location = {lon: undefined, lat: undefined, alt: 0};
      this.eventModel.address =  '';
      this.eventModel.polygon = [];
      this.locationService.deleteLocationPointTemp('tmp' + '0');
      this.polygonService.deletePolygonManually('tmp' + '0');

    }
    else if (location === LOCATION_NAMES.address) {
      this.eventModel.address = '';
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      this.locationService.deleteLocationPointTemp('tmp' + '0');
      this.polygonService.deletePolygonManually('tmp' + '0');
    }
    else if (location === LOCATION_NAMES.locationPoint) {
      this.eventModel.location = {lon: undefined, lat: undefined, alt: 0};
      // toaster
      this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
      this.eventModel.address =  '';
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.locationPoint;
      this.polygonService.deletePolygonManually('tmp' + '0');
      this.locationService.deleteLocationPointTemp('tmp' + '0');

      // if (this.eventModel.location.lat === undefined && this.eventModel.location.lon === undefined) {
      this.eventModel.locationType = LOCATION_TYPE.locationPoint;
      this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      this.mapGeneralService.changeCursor(true);
      // }

    }
    else if (location === LOCATION_NAMES.polygon) {
      // toaster
      this.customToasterService.info(
        {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
      this.locationService.deleteLocationPointTemp('tmp' + '0');
      this.eventModel.location = {lon: undefined, lat: undefined, alt: 0};
      this.eventModel.address =  '';
      this.eventModel.locationType = LOCATION_TYPE.polygon;
      this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
      this.mapGeneralService.changeCursor(true);
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      if (this.eventModel.location.lat !== undefined && this.eventModel.location.lon !== undefined) {
        const locationPoint: GEOPOINT3D_SHORT = {
          lon: this.eventModel.location.lon,
          lat: this.eventModel.location.lat,
          alt: 0
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  };

  // =========================================================================
  onNoClick(): void {
    if (this.eventService.tempEventObjectCE && this.eventService.tempEventObjectCE.hasOwnProperty('event')) {
      this.eventService.showEventOnMap(this.eventService.tempEventObjectCE.event);
    }
    this.clearPanel();
    this.dialogRef.close(false);
  }

  onCreateClick(): void {
    this.dialogRef.close(this.eventModel);
    // console.log(this.eventModel);
    this.clearPanel();
  }

  clearPanel = () => {
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
    this.eventModel = _.cloneDeep(this.defaultEvent);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.locationService.deleteLocationPointTemp('tmp' + '0');
    this.polygonService.deletePolygonManually('tmp' + '0');
    this.applicationService.isDialogOpen = false;
  };

  onUpdateLinkedReports = (linkedReportIds: string[]) => {
    if (linkedReportIds && Array.isArray(linkedReportIds)) {
      this.eventModel.reportIds = linkedReportIds;
      const linkedReports = [];
      this.eventModel.reportIds.forEach((reportId: string) => {
        const linkedReport: LINKED_REPORT_DATA = this.reportService.getLinkedReport(reportId);
        linkedReports.push(linkedReport);
      });
      this.eventModel.reports = linkedReports;
    }
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.eventModel.comments = comments;
  };

  getDisabled = (): boolean => {
    let res = false;
    if (this.eventModel.title === '' || this.eventModel.title === undefined) {
      res = true;
    }
    if (this.getLocationDisabled()) {
      res = true;
    }
    return res;
  };

  getLocationDisabled = (): boolean => {
    let res = false;
    if (this.eventModel.locationType === LOCATION_TYPE.locationPoint &&
      (this.eventModel.location.lat === undefined ||
        this.eventModel.location.lon === undefined)) {
      res = true;
    }
    if (this.eventModel.locationType === LOCATION_TYPE.address && this.eventModel.address === '' ) {
      res = true;
    }
    if (this.eventModel.locationType === LOCATION_TYPE.polygon &&
      (this.eventModel.polygon === undefined || this.eventModel.polygon.length === 0)) {
      res = true;
    }
    return res;
  };

  getAddress = (place: any) => {
    // this.zone.run(() => this.formattedAddress = place['formatted_address'])
    if (this.eventService.tempEventObjectCE !== undefined) {
      this.eventService.hideObjectOnMap(this.eventService.tempEventObjectCE);
    }
    const geometry = place.geometry;
    if (geometry.viewport) {
      const lat = geometry.viewport.getCenter().lat();
      const lng = geometry.viewport.getCenter().lng();
      this.eventModel.location = {lat: lat, lon: lng, alt: 0};
      this.eventModel.address = place['formatted_address'];
      this.locationService.createOrUpdateLocationTemp({ lat: lat, lon: lng, alt: 0 });
      this.mapGeneralService.flyToObject([lng, lat, 0]);
    }
  };

}
