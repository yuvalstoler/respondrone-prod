import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MISSION_MODEL_UI,
  MISSION_REQUEST_ACTION,
  MISSION_REQUEST_ACTION_OBJ,
  MISSION_TYPE
} from '../../../../../../../../classes/typings/all.typings';
import {MatDialog} from '@angular/material/dialog';
import {MissionDialogComponent} from '../../../../dialogs/mission-dialog/mission-dialog.component';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {MissionsTableComponent} from './missions-situation-table/missions-table.component';
import {MissionRequestService} from '../../../../services/missionRequestService/missionRequest.service';

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
    this.openPanel('Create new mission request');
  };

  private openPanel = (title: string) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
    });

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
      const data: MISSION_REQUEST_ACTION_OBJ = {
        missionRequestId: this.applicationService.selectedMissionRequests[0].id,
        action: action
      };
      this.missionRequestService.sendMissionRequestAction(data);
    }
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
