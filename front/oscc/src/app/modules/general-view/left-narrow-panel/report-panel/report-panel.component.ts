import {Component, OnInit} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {HEADER_BUTTONS} from '../../../../../types';
import {
  LOCATION_TYPE,
  FILE_FS_DATA,
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
    locationType: LOCATION_TYPE.none,
    location: undefined,
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
      this.reportModel.location = {address: '', longitude: undefined, latitude: undefined};
      this.reportModel.locationType = LOCATION_TYPE.address;
    } else if (location === 'Choose a location point') {
      this.reportModel.location = undefined;
      this.reportModel.locationType = LOCATION_TYPE.locationPoint;
      // TODO: choose from map
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
    this.reportService.createReport(this.reportModel);
    this.clearPanel();
  };

  onDeleteClick = () => {
    console.log('delete');
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
