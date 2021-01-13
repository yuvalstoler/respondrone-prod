import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  COMMENT,
  FR_DATA_UI,
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
import {DataUtility} from '../../../../../../classes/applicationClasses/utility/dataUtility';
import {TasksService} from '../../services/tasksService/tasks.service';
import {GeoInstructionsComponent} from '../../modules/general-view/geo-instructions/geo-instructions.component';
import {LoginService} from '../../services/login/login.service';
import {GeoCalculate} from '../../services/classes/geoCalculate';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  // @ViewChild('title', {static: true}) firstItem: ElementRef;
  @ViewChild(GeoInstructionsComponent) childComponent: GeoInstructionsComponent ;
  isNotSaveGeoInstructions: boolean = false;

  taskModel: TASK_DATA_UI;
  types = this.applicationService.typesConfig.taskTypes;
  priorities = Object.values(PRIORITY);
  // locations = Object.values([LOCATION_NAMES.noLocation, LOCATION_NAMES.address, LOCATION_NAMES.locationPoint]);
  comment = '';

  defaultTask: TASK_DATA_UI = {
    assigneeIds: [],
    createdBy: this.loginService.getUserName(),
    time: undefined,
    type: this.types[0],
    priority: this.priorities[1],
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
              public tasksService: TasksService,
              public frService: FRService,
              private loginService: LoginService,
              @Inject(MAT_DIALOG_DATA) public data: { title: string, fr?: FR_DATA_UI }) {
    this.initTaskModel();
  }

  ngOnInit() {
    // this.firstItem.nativeElement.focus();
  }

  onNoClick(): void {
    this.tasksService.showAll();
    this.clearPanel();
    this.dialogRef.close(false);
  }

  private initTaskModel = () => {
    if (this.applicationService.selectedTasks.length === 1) {
      this.taskModel = _.cloneDeep(this.applicationService.selectedTasks[0]);
    } else {
      if (this.data.hasOwnProperty('fr')) {
        this.defaultTask.assignees = [this.data.fr];
        this.defaultTask.assigneeIds = [this.data.fr.id];
        this.taskModel = _.cloneDeep(this.defaultTask);
      } else {
        this.taskModel = _.cloneDeep(this.defaultTask);
      }
    }
  };

  clearPanel = () => {
    this.removeGeoInstructionsFromMap(this.taskModel.geographicInstructions);
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    this.applicationService.geoCounter = 0;
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.taskModel = _.cloneDeep(this.defaultTask);
    this.applicationService.isDialogOpen = false;
  };

  onCreateClick = () => {
    // console.log(this.taskModel.geographicInstructions);
    const taskModel = _.cloneDeep(this.taskModel);
    taskModel.geographicInstructions.forEach((geoInstruction?: GEOGRAPHIC_INSTRUCTION) => {
      if (geoInstruction.id.substring(0, 3) === 'tmp') {
        geoInstruction.id = DataUtility.generateID();
      }

      switch (geoInstruction.type) {
        case GEOGRAPHIC_INSTRUCTION_TYPE.point:
          delete geoInstruction.polyline;
          delete geoInstruction.polygon;
          delete geoInstruction.address;
          delete geoInstruction.arrow;
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.address:
          delete geoInstruction.polyline;
          delete geoInstruction.polygon;
          delete geoInstruction.arrow;
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
          delete geoInstruction.polyline;
          delete geoInstruction.polygon;
          delete geoInstruction.address;
          geoInstruction.location = geoInstruction.arrow.length > 0 ? GeoCalculate.point3d_to_geoPoint3d_short(geoInstruction.arrow[0]) : undefined;
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
          delete geoInstruction.arrow;
          delete geoInstruction.polygon;
          delete geoInstruction.address;
          geoInstruction.location = geoInstruction.polyline.length > 0 ? GeoCalculate.point3d_to_geoPoint3d_short(geoInstruction.polyline[0]) : undefined;
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
          delete geoInstruction.arrow;
          delete geoInstruction.polyline;
          delete geoInstruction.address;
          geoInstruction.location = geoInstruction.polygon.length > 0 ? GeoCalculate.point3d_to_geoPoint3d_short(geoInstruction.polygon[0]) : undefined;
          break;
      }
    });
    this.dialogRef.close(taskModel);
    this.clearPanel();
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
    if (Array.isArray(geoInstructions) && geoInstructions.length > 0) {
      geoInstructions.forEach(geoInstruction => {
        if (geoInstruction.id.substring(0, 3) === 'tmp') {
          if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.arrow) {
            this.arrowService.deleteArrowPolylineManually(geoInstruction.id);
          }
          if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polyline) {
            this.polylineService.deletePolylineManually(geoInstruction.id);
          }
          if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.polygon) {
            this.polygonService.deletePolygonManually(geoInstruction.id);
          }
          if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.address) {
            this.locationService.deleteLocationPointTemp(geoInstruction.id);
          }
          if (geoInstruction.type === GEOGRAPHIC_INSTRUCTION_TYPE.point) {
            this.locationService.deleteLocationPointTemp(geoInstruction.id);
          }
        }
      });
    }
      const id = this.applicationService.getGeoCounter();
      this.arrowService.deleteArrowPolylineManually(id);
      this.polylineService.deletePolylineManually(id);
      this.polygonService.deletePolygonManually(id);
      this.locationService.deleteLocationPointTemp(id);

  };

}
