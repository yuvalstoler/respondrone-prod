import {Component, OnInit} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {HEADER_BUTTONS, STATE_DRAW} from '../../../../../types';
import {
  FILE_FS_DATA,
  GEOPOINT3D,
  LINKED_EVENT_DATA,
  LOCATION_TYPE,
  PRIORITY,
  REPORT_DATA_UI,
  REPORT_TYPE,
  SOURCE_TYPE,
} from '../../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {ReportService} from '../../../../services/reportService/report.service';
import {EventService} from '../../../../services/eventService/event.service';
import {LocationService} from '../../../../services/locationService/location.service';
import {CustomToasterService} from '../../../../services/toasterService/custom-toaster.service';

@Component({
  selector: 'app-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit {

  reportModel: REPORT_DATA_UI;
  types = Object.values(REPORT_TYPE);
  priorities = Object.values(PRIORITY);
  locations = ['No location', 'Add an address', 'Choose a location point'];
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

  constructor(public applicationService: ApplicationService,
              public locationService: LocationService,
              public reportService: ReportService,
              public customToasterService: CustomToasterService,
              public eventService: EventService) {
    this.initReportModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      this.reportModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};
    });
  }

  ngOnInit(): void {
  }

  private initReportModel = () => {
    if (this.applicationService.selectedReports.length === 1) {
      this.reportModel = _.cloneDeep(this.applicationService.selectedReports[0]);
    } else {
      this.reportModel = _.cloneDeep(this.defaultReport);
    }
  };

  onChangeLocation = (location: string) => {
    if (location === 'No location') {
      this.reportModel.locationType = LOCATION_TYPE.none;
      this.reportModel.location = {longitude: undefined, latitude: undefined};
      this.reportModel.address = '';
      this.locationService.deleteLocationPointTemp();
      this.locationService.removeBillboard();

    } else if (location === 'Add an address') {
      this.reportModel.location = {longitude: undefined, latitude: undefined};
      this.reportModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.deleteLocationPointTemp();
      this.locationService.removeBillboard();

    } else if (location === 'Choose a location point') {
      // TODO: toaster
      this.customToasterService.info({message: 'Click on map to set the report\'s location', title: 'location'});
      this.reportModel.address = '';
      if (this.reportModel.location.latitude === undefined && this.reportModel.location.longitude === undefined) {
        this.reportModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      }
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.removeBillboard();
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

  onCreateClick = () => {
    this.reportService.createReport(this.reportModel, (report: REPORT_DATA_UI) => {
      this.eventService.linkEventsToReport(report.eventIds, report.id); // TODO
    });
    this.clearPanel();
  };

  onCancelClick = () => {
    if (!this.reportModel.id) {
      this.reportModel.media.forEach((data: FILE_FS_DATA) => {
        // TODO: remove media
      });
    }
    this.clearPanel();

  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    this.applicationService.screen.showReportPanel = false;
    this.reportModel = _.cloneDeep(this.defaultReport);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.locationService.deleteLocationPointTemp();
    this.locationService.removeBillboard();
  };

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      this.reportModel.comments.push({source: '', time: Date.now(), text: this.comment});
      this.comment = '';
    }
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
  }

}
