import { Component, OnInit } from '@angular/core';
import {HEADER_BUTTONS} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onSituationPicture = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.situationPictures) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
      this.applicationService.screen.showLeftPanel = false;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      this.applicationService.screen.showLeftPanel = true;
    }
  };

  onMissionControl = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.missionControl) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    }
  };

  onLiveVideo = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.liveVideo) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
    }
  };

  onMedia = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.media) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.media;
    }
  };

  onToolbox = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.toolbox) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.toolbox;
    }
  };

  onView = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.view) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.view;
    }
  };

}
