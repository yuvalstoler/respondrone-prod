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
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      // open panel
      this.applicationService.screen.showSituationPicture = true;
      //close others
      this.applicationService.screen.showMissionControl = false;

    }
  };

  onMissionControl = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.missionControl) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.screen.showMissionControl = true;
      //close others
      this.applicationService.screen.showSituationPicture = false;

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
