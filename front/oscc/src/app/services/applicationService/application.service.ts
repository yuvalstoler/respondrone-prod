import {Injectable} from '@angular/core';
import {DISPLAY_ON_SCREEN, HEADER_BUTTONS, LEFT_PANEL_ICON, STATE_DRAW, VIDEO_OR_MAP} from 'src/types';
import {
  AV_DATA_UI,
  EVENT_DATA_UI,
  FILE_FS_DATA, GEOPOINT3D,
  MISSION_REQUEST_DATA_UI,
  REPORT_DATA_UI,
  TASK_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../connectionService/connection.service';
import {StateGroup} from '../../modules/general-view/search-panel/search-panel.component';


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
  private _selectedAirVehicle: AV_DATA_UI;


  now = Date.now();
  typesConfig = {reportTypes: [], eventTypes: [], taskTypes: []};
  geoCounter: number = 0;

  public currentTabIndex = 0;  //default tab index is 0
  isDialogOpen = false;
  cursorPosition: GEOPOINT3D = {longitude: undefined, latitude: undefined, altitude: undefined};
  hoverTextData: { top: string, left: string, text: string };

  // mapDisplay: DISPLAY_ON_MAP;

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
      showVideo: false,
      showVideoCanvas: false,

      showFRLocations: true,
      showReports: true,
      showEvents: true,
      showTasks: true,
      showMissions: true,
      showMissionPlans: true,
      showUAV: true,
      showNFZ: true,
      showGraphicOverlays: true,
    };
  }

  get selectedAirVehicle(): AV_DATA_UI {
    return this._selectedAirVehicle;
  }

  set selectedAirVehicle(value: AV_DATA_UI) {
    this._selectedAirVehicle = value;
  }

  getGeoCounter = () => {
    return 'tmp' + this.geoCounter;
  };

}
