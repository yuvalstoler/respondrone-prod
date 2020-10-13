import {Component, OnInit} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS, STATE_DRAW} from 'src/types';
import {
  EVENT_DATA_UI,
  EVENT_TYPE,
  GEOPOINT3D,
  LINKED_REPORT_DATA,
  LOCATION_TYPE,
  PRIORITY,
} from '../../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {EventService} from '../../../../services/eventService/event.service';
import {ReportService} from '../../../../services/reportService/report.service';
import {LocationService} from '../../../../services/locationService/location.service';
import {PolygonService} from '../../../../services/polygonService/polygon.service';

@Component({
  selector: 'app-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss']
})
export class EventPanelComponent implements OnInit {

  eventModel: EVENT_DATA_UI;
  types = Object.values(EVENT_TYPE);
  priorities = Object.values(PRIORITY);
  locations = ['Add an address', 'Choose a location point', 'Create a polygon'];
  comment = '';

  defaultEvent: EVENT_DATA_UI = {
    createdBy: undefined,
    time: undefined,
    title: '',
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location:  {longitude: undefined, latitude: undefined},
    address: '',
    polygon: [],
    reportIds: [],
    comments: [],
    reports: [],
    modeDefine: undefined
  };

  LOCATION_TYPE = LOCATION_TYPE;

  constructor(public applicationService: ApplicationService,
              public eventService: EventService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public reportService: ReportService) {
    this.initEventModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      this.eventModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};
    });
  }

  ngOnInit(): void {
  }

  private initEventModel = () => {
    if (this.applicationService.selectedEvent) {
      this.eventModel = _.cloneDeep(this.applicationService.selectedEvent);
    } else {
      this.eventModel = _.cloneDeep(this.defaultEvent);
    }
  };

  onChangeLocation = (location: string) => {
    if (location === 'Add an address') {
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.deleteLocationPointTemp();
      this.locationService.removeBillboard();


    } else if (location === 'Choose a location point') {
      this.eventModel.address = '';
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.locationPoint;
      // choose from map

      if (this.eventModel.location.latitude === undefined && this.eventModel.location.longitude === undefined) {
        this.eventModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      }

    } else if (location === 'Create a polygon') {
      this.locationService.deleteLocationPointTemp();
      this.locationService.removeBillboard();
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.address = '';
      this.eventModel.locationType = LOCATION_TYPE.polygon;
      this.applicationService.stateDraw = STATE_DRAW.drawBillboard;
      // TODO: choose from map
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.locationService.removeBillboard();
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

  onCreateClick = () => {
    this.eventService.createEvent(this.eventModel, (event: EVENT_DATA_UI) => {
      this.reportService.linkReportsToEvent(event.reportIds, event.id);
    });
    this.reportService.linkReportsToEvent(this.eventModel.reportIds, this.eventModel.id); // TODO
    this.clearPanel();
  };

  onCancelClick = () => {
    this.clearPanel();
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    this.eventModel = _.cloneDeep(this.defaultEvent);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.locationService.deleteLocationPointTemp();
    this.locationService.removeBillboard();

  };

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      this.eventModel.comments.push({source: '', time: Date.now(), text: this.comment});
      this.comment = '';
    }
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
  }

}
