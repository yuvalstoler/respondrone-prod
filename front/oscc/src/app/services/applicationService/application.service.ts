import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN, LEFT_PANEL_ICON, STATE_DRAW} from 'src/types';
import {EVENT_DATA_UI, REPORT_DATA_UI} from '../../../../../../classes/typings/all.typings';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  selectedHeaderPanelButton = undefined;
  screen: DISPLAY_ON_SCREEN;
  selectedReport: REPORT_DATA_UI = undefined;
  selectedEvent: EVENT_DATA_UI = undefined;
  panelIcon: LEFT_PANEL_ICON = LEFT_PANEL_ICON.expand;
  stateDraw: STATE_DRAW = STATE_DRAW.notDraw;

  constructor() {
    this.screen = {
      showLeftPanel: false,
      showLeftNarrowPanel: false,
      showEventPanel: false,
      showReportPanel: false
    };
  }
}
