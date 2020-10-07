import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS, LEFT_PANEL_ICON} from 'src/types';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;
  // panelIcon: LEFT_PANEL_ICON = LEFT_PANEL_ICON.minimize;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  closeSituationPicture = () => {
    // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    // this.applicationService.screen.showLeftPanel = false;
    if (this.applicationService.panelIcon === LEFT_PANEL_ICON.expand) {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.minimize;
    //  todo: minimize panel
    } else {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.expand;
      //  todo: expand panel
    }

  };
  
}
