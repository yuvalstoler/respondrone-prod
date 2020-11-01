import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {HEADER_BUTTONS, VIEW_LIST} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {

  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

  Header_Buttons = HEADER_BUTTONS;

  viewItems: string[] = Object.values(VIEW_LIST);
  viewItemModel: string[] = [];

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

  onChangeCheckbox = (event, item: string) => {
    if (event.checked) {
      const selectedIndex = this.viewItemModel.findIndex(data => data === item);
      if (selectedIndex === -1 && event) {
        this.viewItemModel.push(item);
      }
    } else {
      const selectedIndex = this.viewItemModel.findIndex(data => data === item);
      if (selectedIndex !== -1) {
        this.viewItemModel.splice(selectedIndex, 1);
      }
    }

  };

  onCancel = () => {
    this.checkboxes['_results'].forEach((element) => {
      element.checked = false;
    });
    this.viewItemModel = [];
  };

  onApply = (event) => {
    if (this.viewItemModel.length > 0) {
      console.log(this.viewItemModel);
    } else {
      // event.stopPropagation();
      // event.preventDefault();
    }

  };



}
