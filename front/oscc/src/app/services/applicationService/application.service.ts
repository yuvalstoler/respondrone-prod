import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN, LEFT_PANEL_ICON} from 'src/types';
import {ReportsSituation} from '../../modules/general-view/left-panel/reports-situation-picture/reports-situation-table/reports-situation-table.component';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  selectedHeaderPanelButton = undefined;
  screen: DISPLAY_ON_SCREEN;
  selectedReport: ReportsSituation = undefined;
  panelIcon: LEFT_PANEL_ICON = LEFT_PANEL_ICON.expand;
  
  constructor() {
    this.screen = {
      showLeftPanel: false,
      showLeftNarrowPanel: false,
      showEventPanel: false,
      showReportPanel: false
    };
  }
}
