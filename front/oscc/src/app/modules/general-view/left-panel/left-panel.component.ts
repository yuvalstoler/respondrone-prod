import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {Header_Buttons} from 'src/types';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {

  Header_Buttons = Header_Buttons;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  closeSituationPicture = () => {
    this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    this.applicationService.screen.showLeftPanel = false;
  };
  
}
