import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {HEADER_BUTTONS} from '../../../../../types';

@Component({
  selector: 'app-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit {

  reportModel: any;
  types = ['Fire Alarm', 'Road Block', 'Accident'];
  priorities = ['Low', 'Normal', 'High'];
  locations = ['Add an address', 'Choose a location point'];

  constructor(public applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.initReportModel();
  }

  private initReportModel = () => {
    if (this.applicationService.selectedReport !== undefined) {
      this.reportModel = {
        type: this.applicationService.selectedReport.type,
        priority: this.applicationService.selectedReport.priority,
        description: this.applicationService.selectedReport.description,
        location: {address: '', lat: null, long: null, button: ''},
        linkedevents: this.applicationService.selectedReport.linkedevents,
        media: this.applicationService.selectedReport.media,
        comments: ''
      };
    } else {
      this.reportModel = {
        type: 'fire',
        priority: 'normal',
        description: '',
        location: {address: '', lat: null, long: null, button: ''},
        linkedevents: [
          {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
          {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
          {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
          {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
          {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
        ],
        media: [
          {url: 'http://localhost:8100/api/file/1601525743958.jpg', id: '1601525743958.jpg', type: 'image'},
          {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
          {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
          {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
          {url: 'http://localhost:8100/api/file/1601533035168.mp4', id: '1601533035168.mp4', type: 'video'},
        ],
        comments: ''
      };
    }
  };

  onCreateClick = () => {
    console.log(this.reportModel);
    this.clearPanel();
  };

  onDeleteClick = () => {
    console.log('delete');
    this.clearPanel();
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    // if (this.applicationService.selectedReport === undefined) {
      this.reportModel = {
        type: 'fire',
        priority: 'normal',
        description: '',
        location: {address: '', lat: null, long: null, button: ''},
        linkedevents: [
          {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
          {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
          {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
          {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
          {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
        ],
        comments: ''
      };
    // }
  };

  onSendComment = () => {
    if (this.reportModel.comments !== '' && this.reportModel.comments !== undefined) {
      console.log(this.reportModel.comments);


    }
  };

}
