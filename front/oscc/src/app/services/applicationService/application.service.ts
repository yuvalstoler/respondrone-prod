import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN, HEADER_BUTTONS, LEFT_PANEL_ICON, STATE_DRAW} from 'src/types';
import {EVENT_DATA_UI, FILE_FS_DATA, REPORT_DATA_UI, TASK_DATA_UI} from '../../../../../../classes/typings/all.typings';
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
  selectedViewMedia: FILE_FS_DATA;
  panelIcon: LEFT_PANEL_ICON = LEFT_PANEL_ICON.expand;
  stateDraw: STATE_DRAW = STATE_DRAW.notDraw;


  now = Date.now();
  typesConfig = {reportTypes: [], eventTypes: [], taskTypes: []};
  geoCounter: number = 0;

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
      showRightPanel: true,
      showAirResources: true,
      showGrandResources: true,
      showSituationPicture: true,
      showMissionControl: false,
      showViewMedia: false
    };
  }
}
