import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN, HEADER_BUTTONS, LEFT_PANEL_ICON, STATE_DRAW, VIDEO_OR_MAP} from 'src/types';
import {
  EVENT_DATA_UI,
  FILE_FS_DATA, GEOPOINT3D_SHORT,
  MISSION_REQUEST_DATA_UI, POINT3D,
  REPORT_DATA_UI,
  TASK_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../connectionService/connection.service';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  selectedHeaderPanelButton: HEADER_BUTTONS = HEADER_BUTTONS.situationPictures;
  selectedWindow: VIDEO_OR_MAP = VIDEO_OR_MAP.map;
  screen: DISPLAY_ON_SCREEN;
  selectedReports: REPORT_DATA_UI[] = [];
  selectedEvents: EVENT_DATA_UI[] = [];
  selectedTasks: TASK_DATA_UI[] = [];
  // TODO : add type selectedMissions
  selectedMissionRequests: MISSION_REQUEST_DATA_UI[] = [];
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
      showViewMedia: false,
      showVideo: false
    };
  }

  point3d_to_geoPoint3d_short_arr = (points: POINT3D[]): GEOPOINT3D_SHORT[] => {
    const geopoints = points.map(point => this.point3d_to_geoPoint3d_short(point));
    return geopoints;
  }
  point3d_to_geoPoint3d_short = (point: POINT3D): GEOPOINT3D_SHORT => {
    return {lon: point[0], lat: point[1], alt: point[2]}
  }
}
