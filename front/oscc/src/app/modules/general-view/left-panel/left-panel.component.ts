import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS, LEFT_PANEL_ICON} from 'src/types';
import {ContextMenuService} from '../../../services/contextMenuService/context-menu.service';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;

  constructor(public applicationService: ApplicationService,
              public contextMenuService: ContextMenuService) { }

  ngOnInit(): void {
  }

 minimizationPanel = () => {
    if (this.applicationService.panelIcon === LEFT_PANEL_ICON.expand) {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.minimize;
    } else {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.expand;
    }
  };

  closeMenu = () => {
    this.contextMenuService.closeLinkToMenu();
  };

  getSelectedIndex(): number {
    return this.applicationService.currentTabIndex;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.applicationService.currentTabIndex = event.index;
  }
  
}
