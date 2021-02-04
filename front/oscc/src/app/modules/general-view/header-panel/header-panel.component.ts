import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {HEADER_BUTTONS, VIDEO_OR_MAP, VIEW_LIST} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {DefaultValueAccessor} from '@angular/forms';
import {FRService} from '../../../services/frService/fr.service';
import {ReportService} from '../../../services/reportService/report.service';
import {EventService} from '../../../services/eventService/event.service';
import {TasksService} from '../../../services/tasksService/tasks.service';
import {MissionService} from '../../../services/missionService/mission.service';
import {MissionRequestService} from '../../../services/missionRequestService/missionRequest.service';
import {AirVehicleService} from '../../../services/airVehicleService/airVehicle.service';
import {GraphicOverlayService} from '../../../services/graphicOverlayService/graphicOverlay.service';
import {GimbalService} from '../../../services/gimbalService/gimbal.service';
import {NFZService} from '../../../services/nfzService/nfz.service';
import {ContextMenuService} from '../../../services/contextMenuService/context-menu.service';
import {LoginService} from '../../../services/login/login.service';
import {ResponsiveService} from '../../../services/responsiveService/responsive.service';
import {MissionRouteService} from '../../../services/missionRouteService/missionRoute.service';
import {StatusIndicatorService} from '../../../services/statusIndicatorService/status-indicator.service';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss'],
})
export class HeaderPanelComponent implements OnInit {

  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild(DefaultValueAccessor) inputModel: DefaultValueAccessor;

  Header_Buttons = HEADER_BUTTONS;

  viewItems: string[] = Object.keys(VIEW_LIST);
  viewItemModel: string[] = [];
  screenWidth: number;

  // _value = '';
  // expanded = false;
  VIEW_LIST = VIEW_LIST;

  constructor(public applicationService: ApplicationService,
              public contextMenuService: ContextMenuService,
              private frService: FRService,
              private reportService: ReportService,
              private eventService: EventService,
              private taskService: TasksService,
              private missionService: MissionService,
              private missionRequestService: MissionRequestService,
              private airVehicleService: AirVehicleService,
              private graphicOverlayService: GraphicOverlayService,
              private gimbalService: GimbalService,
              public loginService: LoginService,
              public responsiveService: ResponsiveService,
              private nfzService: NFZService,
              private missionRouteService: MissionRouteService,
              public statusIndicatorService: StatusIndicatorService) {
    this.responsiveService.screenWidth$.subscribe(res => {
      this.screenWidth = res;
    });
  }


  ngOnInit(): void {

  }

  onSituationPicture = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.situationPictures) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      // open panel
      this.applicationService.setLeftPanelTrue();
      console.log('screen.showLeftPanel = true');
      this.applicationService.screen.showSituationPicture = true;

      this.applicationService.currentTabIndexSituationPicture = 0;
      //close others
      this.applicationService.screen.showMissionControl = false;
      this.applicationService.screen.showVideo = false;

      this.contextMenuService.closeContextMenu();
    }
  };

  onMissionControl = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.missionControl) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.setLeftPanelTrue();
      console.log('screen.showLeftPanel = true');
      this.applicationService.screen.showMissionControl = true;
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;

      this.contextMenuService.closeContextMenu();
    }
  };

  onLiveVideo = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.liveVideo) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;

    } else {
      if (this.airVehicleService.airVehicles.data.length > 0) {
        this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
        if (this.applicationService.selectedAirVehicle === undefined) {
          this.applicationService.selectedAirVehicle = this.airVehicleService.airVehicles.data[0];
        }

        //close others
        this.applicationService.setLeftPanelFalse();
        this.applicationService.screen.showMissionControl = false;
        this.applicationService.screen.showSituationPicture = false;

        this.applicationService.screen.showVideoCanvas = false; // to reset canvas
        setTimeout(() => {
          this.applicationService.screen.showVideoCanvas = true;
          // open panel
          this.applicationService.screen.showVideo = true;
          this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
        }, 500);
      }
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

  onMore = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.more) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.more;
    }
  };

  onChangeCheckbox = (event, item: string) => {
    this.applicationService.screen[item] = !this.applicationService.screen[item];
    switch (item) {
      case 'showFRLocations':
        this.applicationService.screen[item] ? this.frService.showAll() : this.frService.hideAll();
        break;
      case 'showReports':
        this.applicationService.screen[item] ? this.reportService.showAll() : this.reportService.hideAll();
        break;
      case 'showEvents':
        this.applicationService.screen[item] ? this.eventService.showAll() : this.eventService.hideAll();
        break;
      case 'showTasks':
        this.applicationService.screen[item] ? this.taskService.showAll() : this.taskService.hideAll();
        break;
      case 'showMissions':
        this.applicationService.screen[item] ? this.missionService.showAll() : this.missionService.hideAll();
        this.applicationService.screen[item] ? this.missionRequestService.showAll() : this.missionRequestService.hideAll();
        break;
      case 'showMissionPlans':
        this.applicationService.screen[item] ? this.missionRouteService.showAll() : this.missionRouteService.hideAll();
        break;
      case 'showUAV':
        this.applicationService.screen[item] ? this.airVehicleService.showAll() : this.airVehicleService.hideAll();
        this.applicationService.screen[item] ? this.gimbalService.showAll() : this.gimbalService.hideAll();
        break;
      case 'showNFZ':
        this.applicationService.screen[item] ? this.nfzService.showAll() : this.nfzService.hideAll();
        break;
      case 'showGraphicOverlays':
        this.applicationService.screen[item] ? this.graphicOverlayService.showAll() : this.graphicOverlayService.hideAll();
        break;
    }
  };

  onLogout = () => {
    this.loginService.logout();
  };

}
