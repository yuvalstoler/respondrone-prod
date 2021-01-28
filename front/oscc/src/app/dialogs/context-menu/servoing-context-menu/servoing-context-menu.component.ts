import { Component, OnInit } from '@angular/core';
import {HEADER_BUTTONS} from '../../../../types';
import {AV_DATA_UI, MISSION_MODEL_UI, MISSION_TYPE, POINT} from '../../../../../../../classes/typings/all.typings';
import {MissionDialogComponent} from '../../mission-dialog/mission-dialog.component';
import {ContextMenuService} from '../../../services/contextMenuService/context-menu.service';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {MissionRequestService} from '../../../services/missionRequestService/missionRequest.service';
import {MatDialog} from '@angular/material/dialog';
import {LiveVideoService} from '../../../services/liveVideoService/live-video.service';

@Component({
  selector: 'app-servoing-context-menu',
  templateUrl: './servoing-context-menu.component.html',
  styleUrls: ['./servoing-context-menu.component.scss']
})
export class ServoingContextMenuComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService,
              public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public dialog: MatDialog,
              public liveVideoService: LiveVideoService) { }

  ngOnInit(): void {
  }

  onClick = () => {
    this.liveVideoService.stopGetBlobs();
    this.liveVideoService.startDrawingOnCanvas();

    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    // open panel
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.screen.showMissionControl = true;
    // choose missionTab on MissionControl
    this.applicationService.currentTabIndexMissionControl = 1; /*(0 = TaskTab, 1 = MissionTab)*/
    //close others
    this.applicationService.screen.showSituationPicture = false;
    this.applicationService.screen.showVideoCanvas = false;
    this.applicationService.screen.showVideo = false;
    const airVehicle = this.contextMenuService.selectedBlob.airVehicle;
    const options = this.contextMenuService.selectedBlob.options;
    this.openPanel('Create new mission request', MISSION_TYPE.Servoing, airVehicle, options);
  };

  private openPanel = (title: string, missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, options: {selectedId: number, point: POINT}) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      maxWidth: '75%',
      minWidth: '75%',
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
