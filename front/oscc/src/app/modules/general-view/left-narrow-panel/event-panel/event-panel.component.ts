import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss']
})
export class EventPanelComponent implements OnInit {

  eventModel: any;
  types = ['Fire Alarm', 'Road Block', 'Accident'];
  priorities = ['Low', 'Normal', 'High']

  constructor() {
    this.eventModel = {
      title: '',
      type: 'fire',
      priority: 'normal',
      description: '',
      location: null,
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

  ngOnInit(): void {
  }

}
