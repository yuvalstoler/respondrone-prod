import { Component, OnInit } from '@angular/core';
import {FRService} from '../../../services/frService/fr.service';
import {ContextMenuService} from '../../../services/contextMenuService/context-menu.service';
import {HEADER_BUTTONS} from '../../../../types';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {FR_DATA_UI, TASK_DATA_UI} from '../../../../../../../classes/typings/all.typings';
import {TaskDialogComponent} from '../../task-dialog/task-dialog.component';
import {TasksService} from '../../../services/tasksService/tasks.service';
import {GeoInstructionsService} from '../../../services/geoInstructionsService/geo-instructions.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-fr-context-menu',
  templateUrl: './fr-context-menu.component.html',
  styleUrls: ['./fr-context-menu.component.scss']
})
export class FrContextMenuComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService,
              public frService: FRService,
              private applicationService: ApplicationService,
              private tasksService: TasksService,
              private geoInstructionsService: GeoInstructionsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSendTask = () => {

    const fr = this.frService.selectedElement;
    if (fr) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showMissionControl = true;
      // choose missionTab on MissionControl
      this.applicationService.currentTabIndexMissionControl = 0; /*(0 = TaskTab, 1 = MissionTab)*/
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;

      this.applicationService.selectedTasks = [];
      const title = 'Create new task';
      this.openTaskPanel(title, fr);
      this.contextMenuService.closeContextMenu();
    }
  };

  private openTaskPanel = (title: string, fr: FR_DATA_UI) => {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: {title: title, fr: fr}
    });
    this.applicationService.isDialogOpen = true;
    dialogRef.afterClosed().subscribe((result: TASK_DATA_UI) => {
      if (result) {
        this.tasksService.createTask(result, (task: TASK_DATA_UI) => {
        });
        this.applicationService.geoCounter = 0;
        this.geoInstructionsService.removeGeoInstructionsFromMap(result.geographicInstructions);
      }
    });
  };

  onSendMessage = () => {

  }

}
