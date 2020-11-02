import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  COMMENT,
  EVENT_DATA_UI,
  GEOPOINT3D, LINKED_REPORT_DATA, LOCATION_NAMES,
  LOCATION_TYPE, POINT3D,
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

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {

  eventModel: EVENT_DATA_UI;
  types = this.applicationService.typesConfig.eventTypes;
  priorities = Object.values(PRIORITY);
  locations = Object.values(LOCATION_NAMES);
  comment = '';

  defaultEvent: EVENT_DATA_UI = {
    createdBy: undefined,
    time: undefined,
    title: '',
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location: {longitude: undefined, latitude: undefined},
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
              public dialogRef: MatDialogRef<EventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string}) {
    this.initEventModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint) {
        this.eventModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};
      }
    });

    this.polygonService.polygon$.subscribe((positions: POINT3D[]) => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawPolygon) {
        this.eventModel.polygon = positions;
      }
    });
  }

  private initEventModel = () => {
    if (this.applicationService.selectedEvents.length === 1) {
      this.eventModel = _.cloneDeep(this.applicationService.selectedEvents[0]);
    } else {
      this.eventModel = _.cloneDeep(this.defaultEvent);
    }
  };


  onNoClick(): void {
    this.clearPanel();
    this.dialogRef.close(false);
  }

  onCreateClick(): void {
    this.dialogRef.close(this.eventModel);
    this.clearPanel();
  }

  onChangeLocation = (event, location: string) => {
    if (location === LOCATION_NAMES.noLocation) {
      this.eventModel.locationType = LOCATION_TYPE.none;
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.address = '';
      this.eventModel.polygon = [];
      this.locationService.deleteLocationPointTemp('0');
      this.polygonService.deletePolygonManually('0');

    } else if (location === LOCATION_NAMES.address) {
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.deleteLocationPointTemp('0');
      this.polygonService.deletePolygonManually('0');

    } else if (location === LOCATION_NAMES.locationPoint) {
      // toaster
      this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
      this.eventModel.address = '';
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.locationPoint;
      this.polygonService.deletePolygonManually('0');

      // if (this.eventModel.location.latitude === undefined && this.eventModel.location.longitude === undefined) {
        this.eventModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      // }

    } else if (location === LOCATION_NAMES.polygon) {
      // toaster
      this.customToasterService.info(
        {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
      this.locationService.deleteLocationPointTemp('0');
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.address = '';
      this.eventModel.locationType = LOCATION_TYPE.polygon;
      this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      if (this.eventModel.location.latitude !== undefined && this.eventModel.location.longitude !== undefined) {
        const locationPoint: GEOPOINT3D = {
          longitude: this.eventModel.location.longitude,
          latitude: this.eventModel.location.latitude
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
      }
    }
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
    this.eventModel = _.cloneDeep(this.defaultEvent);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.locationService.deleteLocationPointTemp('0');
    this.polygonService.deletePolygonManually('0');
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

}
