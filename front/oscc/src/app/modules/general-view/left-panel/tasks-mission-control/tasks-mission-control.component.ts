import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {TasksMissionTableComponent} from './tasks-mission-table/tasks-mission-table.component';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from '../../../../dialogs/task-dialog/task-dialog.component';
import {TASK_DATA_UI} from '../../../../../../../../classes/typings/all.typings';
import {TasksService} from '../../../../services/tasksService/tasks.service';

@Component({
  selector: 'app-tasks-mission-control',
  templateUrl: './tasks-mission-control.component.html',
  styleUrls: ['./tasks-mission-control.component.scss']
})
export class TasksMissionControlComponent implements OnInit {

  @ViewChild(TasksMissionTableComponent) childComponent: TasksMissionTableComponent;
  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public tasksService: TasksService,
              public dialog: MatDialog) { }

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
        console.log(result);
      }
    });
  };

  onArchiveTask = () => {
    //  todo: move it to the archive folder
  };

  openConfirmDialog = (): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '250px',
      disableClose: true,
      data: ' you want to permanently delete the selected task'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // const selectedEvents: EVENT_DATA_UI[] = this.childComponent.getSelectedEvents();
        // selectedEvents.forEach((eventData: EVENT_DATA_UI, index: number) => {
        //   setTimeout(() => {
        //     this.reportService.unlinkReportsFromEvent(eventData.reportIds, eventData.id);
        //     this.eventService.deleteEvent({id: eventData.id});
        //   }, index * 500);
        // });
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
