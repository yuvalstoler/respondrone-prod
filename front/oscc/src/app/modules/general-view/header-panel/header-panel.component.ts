import { Component, OnInit } from '@angular/core';
import {Header_Buttons} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {

  Header_Buttons = Header_Buttons;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onSituationPicture = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.situationPictures){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
      this.applicationService.screen.showLeftPanel = false;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.situationPictures;
      this.applicationService.screen.showLeftPanel = true;
    }
  };

  onMissionControl = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.missionControl){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.missionControl;
    }
  };

  onLiveVideo = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.liveVideo){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.liveVideo;
    }
  };

  onMedia = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.media){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.media;
    }
  };

  onToolbox = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.toolbox){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.toolbox;
    }
  };

  onView = () => {
    if (this.applicationService.selectedHeaderPanelButton === Header_Buttons.view){
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = Header_Buttons.view;
    }
  };

}
