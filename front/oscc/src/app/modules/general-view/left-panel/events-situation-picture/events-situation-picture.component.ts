import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';

@Component({
  selector: 'app-events-situation-picture',
  templateUrl: './events-situation-picture.component.html',
  styleUrls: ['./events-situation-picture.component.scss']
})
export class EventsSituationPictureComponent implements OnInit {
  
  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onCreateNewEvent = () => {
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showReportPanel = false;
    this.applicationService.screen.showEventPanel = true;
  };
}
