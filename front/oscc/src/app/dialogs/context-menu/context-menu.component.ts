import { Component, OnInit } from '@angular/core';
import {ContextMenuService} from '../../services/contextMenuService/context-menu.service';
import {AV_DATA_UI, MISSION_MODEL_UI, MISSION_TYPE, POINT} from '../../../../../../classes/typings/all.typings';
import {MissionDialogComponent} from '../mission-dialog/mission-dialog.component';
import {ApplicationService} from '../../services/applicationService/application.service';
import {HEADER_BUTTONS} from '../../../types';
import {MatDialog} from '@angular/material/dialog';
import {MissionRequestService} from '../../services/missionRequestService/missionRequest.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService,
              public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onClick = () => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    // open panel
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.screen.showMissionControl = true;
    // choose missionTab on MissionControl
    this.applicationService.currentTabIndex = 1; /*(0 = TaskTab, 1 = MissionTab)*/
    //close others
    this.applicationService.screen.showSituationPicture = false;
    this.applicationService.screen.showVideo = false;
    const airVehicle = this.contextMenuService.selectedBlob.airVehicle;
    const options = this.contextMenuService.selectedBlob.options;
    this.openPanel('Create new mission request', MISSION_TYPE.Servoing, airVehicle, options);
  };

  private openPanel = (title: string, missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, options: {selectedId: number, point: POINT}) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title, missionType: missionType, airVehicle: airVehicle, idBlob: options.selectedId}
    });
    this.applicationService.isDialogOpen = true;
    this.contextMenuService.isOpenBlob = false;
    this.contextMenuService.selectedBlob.options = {selectedId: undefined, point: undefined};
    dialogRef.afterClosed().subscribe((missionModel: MISSION_MODEL_UI) => {
      if (missionModel) {
        this.missionRequestService.createServoingMission(missionModel);
      }
    });
  };

}
