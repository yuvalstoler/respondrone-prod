import {Component, OnInit} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS} from 'src/types';

@Component({
  selector: 'app-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss']
})
export class EventPanelComponent implements OnInit {

  eventModel: any;
  types = ['Fire Alarm', 'Road Block', 'Accident'];
  priorities = ['Low', 'Normal', 'High'];
  locations = ['Add an address', 'Choose a location point', 'Create a polygon'];

  constructor(public applicationService: ApplicationService) {
    this.eventModel = {
      title: '',
      type: 'fire',
      priority: 'normal',
      description: '',
      location: {address: '', lat: null, long: null, button: ''},
      linkedreports: [
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

  ngOnInit(): void {
  }

  onCreateClick = () => {
    console.log(this.eventModel);
    this.clearPanel();
  };

  onDeleteClick = () => {
    console.log('delete');
    this.clearPanel();
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    this.eventModel = {
      title: '',
      type: 'fire',
      priority: 'normal',
      description: '',
      location: {address: '', lat: null, long: null, button: ''},
      linkedreports: [
        {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
        {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
        {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
        {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
        {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
      ],
      comments: ''
    };
  }

  onSendComment = () => {
    if (this.eventModel.comments !== '' && this.eventModel.comments !== undefined) {
      console.log(this.eventModel.comments);


    }
  };

}
