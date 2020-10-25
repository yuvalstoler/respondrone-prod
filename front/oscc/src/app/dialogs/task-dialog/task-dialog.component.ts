import {Component, Inject} from '@angular/core';
import {
  COMMENT,
  LOCATION_NAMES,
  LOCATION_TYPE,
  PRIORITY,
  TASK_DATA_UI,
  TASK_STATUS
} from '../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../services/applicationService/application.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {HEADER_BUTTONS, STATE_DRAW} from '../../../types';
import {LocationService} from '../../services/locationService/location.service';
import {PolygonService} from '../../services/polygonService/polygon.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  taskModel: TASK_DATA_UI;
  types = this.applicationService.typesConfig.taskTypes;
  priorities = Object.values(PRIORITY);
  // locations = Object.values([LOCATION_NAMES.noLocation, LOCATION_NAMES.address, LOCATION_NAMES.locationPoint]);
  comment = '';

  defaultTask: TASK_DATA_UI = {
    assigneeIds: [],
    createdBy: undefined,
    time: undefined,
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    location: {longitude: undefined, latitude: undefined},
    address: '',
    comments: [],
    idView: '',
    geographicInstructions: [],
    assignees: [],
    id: '',
    resources: '',
    status: TASK_STATUS.pending,
    title: ''
  };

  LOCATION_TYPE = LOCATION_TYPE;
  LOCATION_NAMES = LOCATION_NAMES;

  constructor(public applicationService: ApplicationService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
    this.initTaskModel();
  }

  onNoClick(): void {
    this.clearPanel();
    this.dialogRef.close(false);
  }

  private initTaskModel = () => {
    if (this.applicationService.selectedTasks.length === 1) {
      this.taskModel = _.cloneDeep(this.applicationService.selectedTasks[0]);
    } else {
      this.taskModel = _.cloneDeep(this.defaultTask);
    }
  };

  clearPanel = () => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    this.taskModel = _.cloneDeep(this.defaultTask);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.locationService.deleteLocationPointTemp();
    this.polygonService.deletePolygonManually();
  //   todo: delete polyline manually
  //  todo: delete arrow manually
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.taskModel.comments = comments;
  };

  onUpdateAssignees = (assigneeIds: string[]) => {
    if (assigneeIds && Array.isArray(assigneeIds)) {
      this.taskModel.assigneeIds = assigneeIds;
      // const linkedEvents = [];
      // this.taskModel.assigneeIds.forEach((eventId: string) => {
      //   const linkedEvent: LINKED_EVENT_DATA = this.eventService.getLinkedEvent(eventId);
      //   linkedEvents.push(linkedEvent);
      // });
      // this.taskModel.assignees = linkedEvents;
    }
  };

}
