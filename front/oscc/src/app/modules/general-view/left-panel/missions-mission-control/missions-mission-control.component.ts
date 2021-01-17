import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MISSION_MODEL_UI,
  MISSION_REQUEST_ACTION,
  MISSION_REQUEST_ACTION_OBJ,
  MISSION_REQUEST_DATA_UI,
  MISSION_STATUS_UI,
  MISSION_TYPE
} from '../../../../../../../../classes/typings/all.typings';
import {MatDialog} from '@angular/material/dialog';
import {MissionDialogComponent} from '../../../../dialogs/mission-dialog/mission-dialog.component';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {MissionsTableComponent} from './missions-situation-table/missions-table.component';
import {MissionRequestService} from '../../../../services/missionRequestService/missionRequest.service';
import {MissionUavDialogComponent} from '../../../../dialogs/mission-uav-dialog/mission-uav-dialog.component';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-missions-mission-control',
  templateUrl: './missions-mission-control.component.html',
  styleUrls: ['./missions-mission-control.component.scss']
})
export class MissionsMissionControlComponent implements OnInit {

  @ViewChild(MissionsTableComponent ) childComponent: MissionsTableComponent ;
  LEFT_PANEL_ICON = LEFT_PANEL_ICON;
  MISSION_REQUEST_ACTION = MISSION_REQUEST_ACTION;

  constructor( public dialog: MatDialog,
               public applicationService: ApplicationService,
               public missionRequestService: MissionRequestService) { }

  ngOnInit(): void {
  }

  onCreateNewMission = () => {
    this.childComponent.resetTable();
    this.openPanel('Create new mission request');
  };

  private openPanel = (title: string) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
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

  onMissionRequestAction = (action: MISSION_REQUEST_ACTION) => {
    if (this.applicationService.selectedMissionRequests[0]) {
      if (this.applicationService.selectedMissionRequests[0].missionStatus === MISSION_STATUS_UI.New) {
        if (action === MISSION_REQUEST_ACTION.Accept) {
          this.openPanelAddAV(this.applicationService.selectedMissionRequests[0], action);
        } else if (action === MISSION_REQUEST_ACTION.Reject) {
          this.openConfirmationDialog(action);
        }
      }
      else {
        const data: MISSION_REQUEST_ACTION_OBJ = {
          missionRequestId: this.applicationService.selectedMissionRequests[0].id,
          action: action
        };
        this.missionRequestService.sendMissionRequestAction(data);
      }

    }
  };

  openConfirmationDialog = (action: MISSION_REQUEST_ACTION) => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '35em',
      disableClose: true,
      data: ' you want to permanently delete the selected mission request'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data: MISSION_REQUEST_ACTION_OBJ = {
          missionRequestId: this.applicationService.selectedMissionRequests[0].id,
          action: action
        };
        this.missionRequestService.sendMissionRequestAction(data);
        this.childComponent.resetTable();
      }
    });

  }

  private openPanelAddAV = (selectedMissionRequest: MISSION_REQUEST_DATA_UI, action: MISSION_REQUEST_ACTION) => {
    const dialogRef = this.dialog.open(MissionUavDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: {title: 'Add mission’s UAV', missionType: selectedMissionRequest.missionType}
    });
    this.applicationService.isDialogOpen = true;
    dialogRef.afterClosed().subscribe((result: any) => {
     if (result) {
       const data: MISSION_REQUEST_ACTION_OBJ = {
         missionRequestId: this.applicationService.selectedMissionRequests[0].id,
         action: action,
         avIds: result
       };
       // TODO: add UAVs
       console.log(data);
       this.missionRequestService.sendMissionRequestAction(data);
     }
    });
  };


  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
