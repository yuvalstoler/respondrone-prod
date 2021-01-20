import {AirVehicleService} from '../../../../services/airVehicleService/airVehicle.service';
import {Component, Input, OnInit} from '@angular/core';
import {HEADER_BUTTONS, MAP, VIDEO_OR_MAP} from '../../../../../types';
import {
  AV_DATA_UI,
  MISSION_MODEL_UI,
  MISSION_TYPE,
  OPERATIONAL_STATUS
} from '../../../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {MissionDialogComponent} from '../../../../dialogs/mission-dialog/mission-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MissionRequestService} from '../../../../services/missionRequestService/missionRequest.service';
import {ContextMenuService} from '../../../../services/contextMenuService/context-menu.service';

@Component({
  selector: 'app-air-resources',
  templateUrl: './air-resources.component.html',
  styleUrls: ['./air-resources.component.scss']
})
export class AirResourcesComponent implements OnInit {


  @Input() optionSelected: {type: string, field: string };
  @Input() screenWidth: number;
  isOpenMenu: MAP<any> = {};
  MISSION_TYPE = MISSION_TYPE;
  OPERATIONAL_STATUS = OPERATIONAL_STATUS;

  constructor(public airVehicleService: AirVehicleService,
              public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public contextMenuService: ContextMenuService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  onOpenMenu = ($event, id) => {
    $event.stopPropagation();
    this.isOpenMenu[id] = true;
  };

  onCloseMenu = ($event, id) => {
    $event.stopPropagation();
    this.isOpenMenu[id] = false;
  };

  onSelect = (item: AV_DATA_UI) => {
    this.airVehicleService.unselectIcon(this.airVehicleService.selectedElement);
    this.airVehicleService.selectedElement = (this.airVehicleService.selectedElement && this.airVehicleService.selectedElement.id === item.id) ? undefined : item;
    if (this.airVehicleService.selectedElement) {
      this.airVehicleService.selectIcon(this.airVehicleService.selectedElement);
      this.airVehicleService.flyToObject(item);
    }
  };

  onMissionOptions = (missionType: MISSION_TYPE, airVehicle: AV_DATA_UI) => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    // open panel
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.screen.showMissionControl = true;
    // choose missionTab on MissionControl
    this.applicationService.currentTabIndexMissionControl = 1; /*(0 = TaskTab, 1 = MissionTab)*/
    //close others
    this.applicationService.screen.showSituationPicture = false;
    this.applicationService.screen.showVideo = false;

    switch (missionType) {
      case MISSION_TYPE.CommRelay: {
        this.openPanel('Create new mission request', MISSION_TYPE.CommRelay, airVehicle);
        break;
      }
      case MISSION_TYPE.Observation: {
        this.openPanel('Create new mission request', MISSION_TYPE.Observation, airVehicle);
        break;
      }
      case MISSION_TYPE.Patrol: {
        this.openPanel('Create new mission request', MISSION_TYPE.Patrol, airVehicle);
        break;
      }
      case MISSION_TYPE.Delivery: {
        this.openPanel('Create new mission request', MISSION_TYPE.Delivery, airVehicle);
        break;
      }
      case MISSION_TYPE.Scan: {
        this.openPanel('Create new mission request', MISSION_TYPE.Scan, airVehicle);
        break;
      }
      case MISSION_TYPE.Servoing: {
        this.openPanel('Create new mission request', MISSION_TYPE.Servoing, airVehicle);
        break;
      }
    }
  };

  private openPanel = (title: string, missionType: MISSION_TYPE, airVehicle: AV_DATA_UI) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title, missionType: missionType, airVehicle: airVehicle}
    });
    this.applicationService.isDialogOpen = true;

    dialogRef.afterClosed().subscribe((missionModel: MISSION_MODEL_UI) => {
      if (missionModel) {
        switch (missionModel.missionType) {
          case MISSION_TYPE.Observation:
            this.missionRequestService.createObservationMission(missionModel);
            break;
          case MISSION_TYPE.Scan:
            this.missionRequestService.createScanMission(missionModel);
            break;
          case MISSION_TYPE.Patrol:
            this.missionRequestService.createPatrolMission(missionModel);
            break;
          case MISSION_TYPE.CommRelay:
            this.missionRequestService.createCommRelayMission(missionModel);
            break;
          case MISSION_TYPE.Servoing:
            this.missionRequestService.createServoingMission(missionModel);
            break;
          case MISSION_TYPE.Delivery:
            this.missionRequestService.createDeliveryMission(missionModel);
            break;
        }
      }
    });
  };

  onViewLiveVideo = (airVehicle: AV_DATA_UI) => {
    this.applicationService.screen.showVideoCanvas = false; // to reset canvas
    setTimeout(() => {
      this.applicationService.screen.showVideoCanvas = true;
    }, 500);

    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
    // open panel
    this.applicationService.screen.showVideo = true;
    this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
    //close others
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showMissionControl = false;
    if (this.dialog) {
      this.dialog.closeAll();
    }

    this.contextMenuService.closeContextMenu();
    this.applicationService.selectedAirVehicle = airVehicle;
    // const av = this.applicationService.selectedAirVehicle;

  };

  onClickMission = (airVehicle: AV_DATA_UI, $event) => {
    $event.stopPropagation();
    this.missionRequestService.goToMissionRequest(airVehicle.missionRequestId);
  };

  // getSeparateString = (column) => {
  //   return column.split(/(?=[A-Z])/).join(' ');
  // };

}
