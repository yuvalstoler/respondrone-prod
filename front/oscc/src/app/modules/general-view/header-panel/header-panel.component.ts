import {Component, ElementRef, forwardRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {HEADER_BUTTONS, VIDEO_OR_MAP, VIEW_LIST} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {DefaultValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
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
import {ContextMenuService} from "../../../services/contextMenuService/context-menu.service";
import {LoginService} from "../../../services/login/login.service";

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     multi: true,
  //     useExisting: forwardRef(() => HeaderPanelComponent),
  //   }
  // ],
  // animations: [
  //   trigger('clearExpand', [
  //     transition(':enter', [
  //       style({width: '0', opacity: 0}),
  //       group([
  //         animate(200, style({width: '*'})),
  //         animate('100ms 100ms', style({opacity: '{{finalOpacity}}'}))
  //       ])
  //     ], {params: {finalOpacity: 1}}),
  //     transition(':leave', [
  //       group([
  //         animate(200, style({width: '0px'})),
  //         animate('100ms', style({opacity: 0}))
  //       ])
  //     ]),
  //     // TODO: opacity is not good enough. When hidden, button should also be disabled and aria-hidden (or removed completely)
  //     state('1', style({opacity: '*'})),
  //     state('0', style({opacity: '0'})),
  //     transition('1<=>0', animate(200)),
  //   ]),
  //   trigger('searchExpand', [
  //     state('1', style({width: '*', backgroundColor: '*', margin: '*'})),
  //     state('0', style({width: '60px', backgroundColor: 'transparent', color: 'white', margin: '0'})),
  //     transition('0=>1', [
  //       group([
  //         style({width: '60px', backgroundColor: 'transparent'}),
  //         animate(200, style({width: '*', backgroundColor: '*', color: '*'})),
  //         query('@inputExpand', [
  //           style({width: '0'}),
  //           animate(200, style({
  //             width: '*',
  //             margin: '*',
  //           })),
  //         ]),
  //         query('@clearExpand', [
  //           animateChild(),
  //         ])
  //       ])
  //     ]),
  //     transition('1=>0', [
  //       group([
  //         style({width: '*'}),
  //         animate(200, style({
  //           backgroundColor: 'transparent',
  //           width: '40px',
  //           color: 'white',
  //         })),
  //         query('@clearExpand', [
  //           animateChild(),
  //         ]),
  //         query('@inputExpand', [
  //           animate(200, style({
  //             width: '0',
  //             backgroundColor: 'transparent',
  //             opacity: '0',
  //             margin: '0',
  //           }))
  //         ]),
  //       ])
  //     ]),
  //   ]),
  //   trigger('inputExpand', [
  //     state('0', style({width: '0', margin: '0'})),
  //     // Without this transition, the input animates to an incorrect width
  //     transition('0=>1', []),
  //   ]),
  // ],
})
export class HeaderPanelComponent implements OnInit {

  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild(DefaultValueAccessor) inputModel: DefaultValueAccessor;

  Header_Buttons = HEADER_BUTTONS;

  viewItems: string[] = Object.keys(VIEW_LIST);
  viewItemModel: string[] = [];

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
              private nfzService: NFZService) { }

  ngOnInit(): void {

  }

  onSituationPicture = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.situationPictures) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
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
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showMissionControl = true;
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;

      this.contextMenuService.closeContextMenu();
    }
  };

  onLiveVideo = () => {
    if (this.applicationService.selectedAirVehicle) {
      if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.liveVideo) {
        // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
      } else {
        this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
        // open panel
        // TODO: open video
        this.applicationService.screen.showVideo = true;
        this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
        //close others
        this.applicationService.screen.showLeftPanel = false;
        this.applicationService.screen.showMissionControl = false;
        this.applicationService.screen.showSituationPicture = false;

        this.contextMenuService.closeContextMenu();
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
        break;
      case 'showMissionPlans':
        this.applicationService.screen[item] ? this.missionRequestService.showAll() : this.missionRequestService.hideAll();
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
