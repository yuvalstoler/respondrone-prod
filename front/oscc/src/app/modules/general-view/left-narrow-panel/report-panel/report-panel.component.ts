import {Component, OnInit} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {EVENT_LISTENER_DATA, HEADER_BUTTONS, STATE_DRAW} from '../../../../../types';
import {
  GEOPOINT3D,
  LOCATION_TYPE,
  MEDIA_DATA, POINT,
  PRIORITY,
  REPORT_DATA_UI,
  REPORT_TYPE,
  SOURCE_TYPE
} from '../../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {ReportService} from '../../../../services/reportService/report.service';

@Component({
  selector: 'app-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit {

  reportModel: REPORT_DATA_UI;
  types = Object.values(REPORT_TYPE);
  priorities = Object.values(PRIORITY);
  locations = ['Add an address', 'Choose a location point'];
  comment = '';

  defaultReport: REPORT_DATA_UI = {
    source: SOURCE_TYPE.OSCC,
    createdBy: undefined,
    time: undefined,
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.address,
    location:  {longitude: undefined, latitude: undefined},
    address: '',
    eventIds: [],
    commentIds: [],
    events: [],
    media: [],
    comments: [],
    modeDefine: undefined
  };

  LOCATION_TYPE = LOCATION_TYPE;

  constructor(public applicationService: ApplicationService,
              public reportService: ReportService) {
    this.initReportModel();

    // TODO: add location on panel
    this.reportService.locationPoint$.subscribe(latlon => {
      this.reportModel.location = {longitude: latlon.longitude, latitude: latlon.latitude};

    });
  }

  ngOnInit(): void {
  }

  private initReportModel = () => {
    if (this.applicationService.selectedReport) {
      this.reportModel = _.cloneDeep(this.applicationService.selectedReport);
    } else {
      this.reportModel = _.cloneDeep(this.defaultReport);
    }
  };

  onChangeLocation = (location: string) => {
    if (location === 'Add an address') {
      this.reportModel.location = {longitude: undefined, latitude: undefined};
      this.reportModel.locationType = LOCATION_TYPE.address;
      this.reportService.deleteLocationPointTemp();

    } else if (location === 'Choose a location point') {
      this.reportModel.address = '';
      if (this.reportModel.location.latitude === undefined && this.reportModel.location.longitude === undefined) {
        this.reportModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      }
    }
  };

  locationChanged = (event) => {
    console.log(event.currentTarget.value);
    console.log(this.reportModel.location);

    this.applicationService.stateDraw = STATE_DRAW.notDraw;
   if (this.reportModel.location.latitude !== undefined && this.reportModel.location.longitude !== undefined) {
     const locationPoint: GEOPOINT3D = {
       longitude: this.reportModel.location.longitude,
       latitude: this.reportModel.location.latitude
     };
     this.reportService.createOrUpdateLocationTemp(locationPoint);
   }
  };

  onAddMedia = (newMedia: MEDIA_DATA) => {
    this.reportModel.media.unshift(newMedia);
  };

  onDeleteMedia = (newMedia: MEDIA_DATA) => {
    const index = this.reportModel.media.findIndex((data: MEDIA_DATA) => data.id === newMedia.id);
    if (index !== -1) {
      this.reportModel.media.splice(index, 1);
    }
  };

  onCreateClick = () => {
    this.reportService.createReport(this.reportModel);
    this.clearPanel();
  };

  onDeleteClick = () => {
    console.log('delete');
    if (!this.reportModel.id) {
      this.reportModel.media.forEach((data: MEDIA_DATA) => {
        // TODO: remove media
      });
    }
    this.clearPanel();
  //   todo: delete temp location
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    // if (this.applicationService.selectedReport === undefined) {
      this.reportModel = _.cloneDeep(this.defaultReport);
    // }
  };


  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      console.log(this.comment);
    }
  };

}
