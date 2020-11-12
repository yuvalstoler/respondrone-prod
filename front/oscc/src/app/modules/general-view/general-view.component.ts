import { Component, OnInit } from '@angular/core';
import {DISPLAY_ON_SCREEN, HEADER_BUTTONS, LEFT_PANEL_ICON, VIDEO_OR_MAP} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {CesiumService} from '../../services/cesium/cesium.service';
import {ListenerMapService} from '../../services/cesium/listenerMap/listener-map.service';
import {TasksService} from '../../services/tasksService/tasks.service';
import {FRService} from '../../services/frService/fr.service';
import {AirVehicleService} from '../../services/airVehicleService/airVehicle.service';
import {MissionRequestService} from "../../services/missionRequestService/missionRequest.service";
import {MissionService} from "../../services/missionService/mission.service";
import {MissionRouteService} from "../../services/missionRouteService/missionRoute.service";

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss']
})
export class GeneralViewComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;
  LEFT_PANEL_ICON =  LEFT_PANEL_ICON;
  VIDEO_OR_MAP = VIDEO_OR_MAP;

  constructor(public applicationService: ApplicationService,
              public cesiumService: CesiumService,
              public tasksService: TasksService,
              public frs: FRService,
              public missionRequestService: MissionRequestService,
              public missionService: MissionService,
              public missionRouteService: MissionRouteService,
              public airVehicleService: AirVehicleService,
              public listenerMapService: ListenerMapService) { }

  ngOnInit(): void {
  }

  onExpendVideo = () => {
    if ( this.applicationService.selectedWindow === VIDEO_OR_MAP.map) {
      this.applicationService.selectedWindow = VIDEO_OR_MAP.video;

    } else {
      this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
    }

  };

}
