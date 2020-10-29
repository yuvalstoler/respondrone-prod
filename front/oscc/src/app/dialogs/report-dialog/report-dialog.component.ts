import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  COMMENT,
  FILE_FS_DATA,
  GEOPOINT3D, LINKED_EVENT_DATA, LOCATION_NAMES,
  LOCATION_TYPE,
  PRIORITY,
  REPORT_DATA_UI,
  SOURCE_TYPE
} from '../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../services/applicationService/application.service';
import {LocationService} from '../../services/locationService/location.service';
import {ReportService} from '../../services/reportService/report.service';
import {CustomToasterService} from '../../services/toasterService/custom-toaster.service';
import {EventService} from '../../services/eventService/event.service';
import {HEADER_BUTTONS, STATE_DRAW} from '../../../types';
import * as _ from 'lodash';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

  reportModel: REPORT_DATA_UI;
  types = this.applicationService.typesConfig.reportTypes;
  priorities = Object.values(PRIORITY);
  locations = Object.values([LOCATION_NAMES.noLocation, LOCATION_NAMES.address, LOCATION_NAMES.locationPoint]);
  comment = '';

  defaultReport: REPORT_DATA_UI = {
    source: SOURCE_TYPE.OSCC,
    createdBy: undefined,
    time: undefined,
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location: {longitude: undefined, latitude: undefined},
    address: '',
    eventIds: [],
    comments: [],
    events: [],
    media: [],
    idView: '',
    modeDefine: undefined,
    mediaFileIds: undefined
  };

  LOCATION_TYPE = LOCATION_TYPE;
  LOCATION_NAMES = LOCATION_NAMES;

  locationTypeByName = {
    [LOCATION_NAMES.noLocation]: LOCATION_TYPE.none,
    [LOCATION_NAMES.address]: LOCATION_TYPE.address,
    [LOCATION_NAMES.locationPoint]: LOCATION_TYPE.locationPoint,
    [LOCATION_NAMES.polygon]: LOCATION_TYPE.polygon,
  };

  constructor(public applicationService: ApplicationService,
              public locationService: LocationService,
              public reportService: ReportService,
              public customToasterService: CustomToasterService,
              public eventService: EventService,
              public dialogRef: MatDialogRef<ReportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string}) {
    this.initReportModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint) {
        this.reportModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};
      }
    });
  }

  onNoClick(): void {
    this.clearPanel();
    this.dialogRef.close(false);
  }

  onCreateClick(): void {
    this.dialogRef.close(this.reportModel);
    this.clearPanel();
  }

  private initReportModel = () => {
    if (this.applicationService.selectedReports.length === 1) {
      this.reportModel = _.cloneDeep(this.applicationService.selectedReports[0]);
    } else {
      this.reportModel = _.cloneDeep(this.defaultReport);
    }
  };

  onChangeLocation = (location: string) => {
    if (location === LOCATION_NAMES.noLocation) {
      this.reportModel.locationType = LOCATION_TYPE.none;
      this.reportModel.location = {longitude: undefined, latitude: undefined};
      this.reportModel.address = '';
      this.locationService.deleteLocationPointTemp('0');

    } else if (location === LOCATION_NAMES.address) {
      this.reportModel.location = {longitude: undefined, latitude: undefined};
      this.reportModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.deleteLocationPointTemp('0');

    } else if (location === LOCATION_NAMES.locationPoint) {
      this.customToasterService.info({message: 'Click on map to set the report\'s location', title: 'location'});
      this.reportModel.address = '';
      // if (this.reportModel.location.latitude === undefined && this.reportModel.location.longitude === undefined) {
        this.reportModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      // }
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      // this.locationService.removeBillboard();
      if (this.reportModel.location.latitude !== undefined && this.reportModel.location.longitude !== undefined) {
        const locationPoint: GEOPOINT3D = {
          longitude: this.reportModel.location.longitude,
          latitude: this.reportModel.location.latitude
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
      }
    }
  };

  onAddMedia = (newMedia: FILE_FS_DATA) => {
    this.reportModel.media.unshift(newMedia);
  };

  onDeleteMedia = (newMedia: FILE_FS_DATA) => {
    const index = this.reportModel.media.findIndex((data: FILE_FS_DATA) => data.id === newMedia.id);
    if (index !== -1) {
      this.reportModel.media.splice(index, 1);
    }
  };

  clearPanel = () => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
    this.reportModel = _.cloneDeep(this.defaultReport);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.locationService.deleteLocationPointTemp('0');
  };


  onUpdateLinkedEvents = (linkedEventIds: string[]) => {
    if (linkedEventIds && Array.isArray(linkedEventIds)) {
      this.reportModel.eventIds = linkedEventIds;
      const linkedEvents = [];
      this.reportModel.eventIds.forEach((eventId: string) => {
        const linkedEvent: LINKED_EVENT_DATA = this.eventService.getLinkedEvent(eventId);
        linkedEvents.push(linkedEvent);
      });
      this.reportModel.events = linkedEvents;
    }
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.reportModel.comments = comments;
  };

}
