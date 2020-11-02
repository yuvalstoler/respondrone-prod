import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {TasksMissionTableComponent} from './tasks-mission-table/tasks-mission-table.component';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from '../../../../dialogs/task-dialog/task-dialog.component';
import {
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  TASK_DATA_UI, TASK_ACTION, OSCC_TASK_ACTION
} from '../../../../../../../../classes/typings/all.typings';
import {TasksService} from '../../../../services/tasksService/tasks.service';
import {LocationService} from '../../../../services/locationService/location.service';
import {PolygonService} from '../../../../services/polygonService/polygon.service';
import {PolylineService} from '../../../../services/polylineService/polyline.service';
import {ArrowService} from '../../../../services/arrowService/arrow.service';

@Component({
  selector: 'app-tasks-mission-control',
  templateUrl: './tasks-mission-control.component.html',
  styleUrls: ['./tasks-mission-control.component.scss']
})
export class TasksMissionControlComponent implements OnInit {

  @ViewChild(TasksMissionTableComponent) childComponent: TasksMissionTableComponent;
  LEFT_PANEL_ICON = LEFT_PANEL_ICON;
  TASK_ACTION = TASK_ACTION;

  constructor(public applicationService: ApplicationService,
              public tasksService: TasksService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public polylineService: PolylineService,
              public arrowService: ArrowService,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  onCreateNewTask = () => {
    this.applicationService.selectedTasks = [];
    const title = 'Create new task';
    this.openTaskPanel(title);
  };

  onDeleteTask = () => {
    this.openConfirmDialog();
  };

  onEditTask = () => {
    const title = 'Edit task';
    this.openTaskPanel(title);
  };

  private openTaskPanel = (title: string) => {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
    });

    dialogRef.afterClosed().subscribe((result: TASK_DATA_UI) => {
      if (result) {
        this.tasksService.createTask(result, (task: TASK_DATA_UI) => {
          // this.reportService.linkReportsToEvent(task.reportIds, task.id);
        });
        this.applicationService.geoCounter = 0;
        this.removeGeoInstructionsFromMap(result.geographicInstructions);
        console.log(result);
      }
    });
  };

  removeGeoInstructionsFromMap = (geoInstructions: GEOGRAPHIC_INSTRUCTION[]) => {
    geoInstructions.forEach(geoInstruction => {
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.arrow) {
        this.arrowService.deleteArrowPolylineManually(geoInstruction.idTemp);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polyline) {
        this.polylineService.deletePolylineManually(geoInstruction.idTemp);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polygon) {
        this.polygonService.deletePolygonManually(geoInstruction.idTemp);
      }
      if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.point) {
        this.locationService.deleteLocationPointTemp(geoInstruction.idTemp);
      }
    });
  };

  onArchiveTask = () => {
    //  todo: move it to the archive folder
  };

  onTaskAction = (action: TASK_ACTION) => {
    const data: OSCC_TASK_ACTION = {
      taskId: this.applicationService.selectedTasks[0].id,
      action: action
    }
    this.tasksService.sendTaskAction(data);
  };

  openConfirmDialog = (): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '250px',
      disableClose: true,
      data: ' you want to permanently delete the selected task'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedTasks: TASK_DATA_UI[] = this.childComponent.getSelectedTasks();
        selectedTasks.forEach((taskData: TASK_DATA_UI, index: number) => {
          setTimeout(() => {
            // this.reportService.unlinkReportsFromEvent(eventData.reportIds, eventData.id);
            this.tasksService.deleteTask({id: taskData.id});
          }, index * 500);
        });
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
