import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {
  COMMENT, FR_DATA_UI,
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
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
import {FRService} from '../../services/frService/fr.service';
import {PolylineService} from '../../services/polylineService/polyline.service';
import {ArrowService} from '../../services/arrowService/arrow.service';
import {MapGeneralService} from '../../services/mapGeneral/map-general.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  @ViewChild('title', {static: true}) firstItem: ElementRef;

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
    comments: [],
    idView: '',
    geographicInstructions: [],
    assignees: [],
    id: '',
    resources: '',
    status: TASK_STATUS.pending,
    title: '',
    modeDefine: undefined,
    isSendToMobile: false,
    taskActionByUser: {}
  };

  LOCATION_TYPE = LOCATION_TYPE;
  LOCATION_NAMES = LOCATION_NAMES;

  constructor(public applicationService: ApplicationService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public polylineService: PolylineService,
              public arrowService: ArrowService,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              public mapGeneralService: MapGeneralService,
              public frService: FRService,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
    this.initTaskModel();
  }

  ngOnInit() {
    this.firstItem.nativeElement.focus();
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
    this.removeGeoInstructionsFromMap(this.taskModel.geographicInstructions);

    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    this.applicationService.geoCounter = 0;
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.taskModel = _.cloneDeep(this.defaultTask);
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.taskModel.comments = comments;
  };

  onUpdateAssignees = (assigneeIds: string[]) => {
    if (assigneeIds && Array.isArray(assigneeIds)) {
      this.taskModel.assigneeIds = assigneeIds;
      const assignees = [];
      this.taskModel.assigneeIds.forEach((id: string) => {
        const assignee: FR_DATA_UI = this.frService.getFRById(id);
        assignees.push(assignee);
      });
      this.taskModel.assignees = assignees;
    }
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

}
