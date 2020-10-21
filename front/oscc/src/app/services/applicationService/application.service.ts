import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN, HEADER_BUTTONS, LEFT_PANEL_ICON, STATE_DRAW} from 'src/types';
import {EVENT_DATA_UI, REPORT_DATA_UI, TASK_DATA_UI} from '../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../connectionService/connection.service';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  selectedHeaderPanelButton: HEADER_BUTTONS = HEADER_BUTTONS.situationPictures;
  screen: DISPLAY_ON_SCREEN;
  selectedReports: REPORT_DATA_UI[] = [];
  selectedEvents: EVENT_DATA_UI[] = [];
  selectedTasks: TASK_DATA_UI[] = [];
  panelIcon: LEFT_PANEL_ICON = LEFT_PANEL_ICON.expand;
  stateDraw: STATE_DRAW = STATE_DRAW.notDraw;
  now = Date.now();
  typesConfig = {reportTypes: [], eventTypes: [], taskTypes: []};

  constructor(private connectionService: ConnectionService) {

    this.connectionService.getJson('../../../../../../typesConfig.json')
      .then((data) => {
        if (data) {
          this.typesConfig = data;
        }
      })
      .catch((data) => {
        console.log(data);
      });


    setInterval(() => {
      this.now = Date.now();
    }, 1000);

    this.screen = {
      showLeftPanel: true,
      showSituationPicture: true,
      showMissionControl: false
    };
  }
}
