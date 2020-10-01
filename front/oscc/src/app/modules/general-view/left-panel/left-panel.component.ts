import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS} from 'src/types';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  closeSituationPicture = () => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    this.applicationService.screen.showLeftPanel = false;
  };
  
}
