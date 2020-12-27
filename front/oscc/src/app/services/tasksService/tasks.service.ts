import { Injectable } from '@angular/core';
import {
  ASYNC_RESPONSE, FR_DATA_UI, GEOGRAPHIC_INSTRUCTION_TYPE, ID_OBJ, OSCC_TASK_ACTION,
  POINT,
  POINT3D, TASK_DATA,
  TASK_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {BehaviorSubject} from 'rxjs';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import * as _ from 'lodash';
import {ICON_DATA, ITEM_TYPE, POLYGON_DATA, POLYLINE_DATA} from "../../../types";
import {ApplicationService} from "../applicationService/application.service";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasks: {data: TASK_DATA_UI[]} = {data: []};
  tasks$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_tasksData').subscribe(this.updateTasks);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getTasks();
    }
  };
  // ----------------------
  public getTasks = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/api/readAllTask', {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateTasks(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateTasks = (taskData: TASK_DATA_UI[]): void => {
    if (Array.isArray(taskData)) {
      this.removeIfNotExist(taskData);
      this.updateData(taskData);
      this.tasks$.next(true);
    }
  };
// ----------------------
  private removeIfNotExist = (taskData: TASK_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.tasks.data, taskData, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((data: TASK_DATA_UI) => {
        const index = this.tasks.data.findIndex(d => d.id === data.id);
        this.removeGeographicInstructionsFromMap(data);
        this.tasks.data.splice(index, 1);
      });
    }
  };
  // ----------------------
  private updateData = (taskData: TASK_DATA_UI[]): void => {
    taskData.forEach((newTask: TASK_DATA_UI) => {
      const existingTask: TASK_DATA_UI = this.getTaskById(newTask.id);
      if (existingTask) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingTask) {
          if (existingTask.hasOwnProperty(fieldName)) {
            existingTask[fieldName] = newTask[fieldName];
          }
        }
      } else {
        this.tasks.data.push(newTask);
      }
      this.drawTask(newTask);
    });
  };
  // ----------------------
  private drawTask = (task: TASK_DATA_UI) => {
    // if (event.locationType === LOCATION_TYPE.locationPoint && event.location && event.location.latitude && event.location.longitude) {
    //   this.mapGeneralService.createIcon(event.location, event.id, event.modeDefine.styles.icon);
    // } else if (event.locationType === LOCATION_TYPE.polygon && event.polygon && event.polygon.length > 0) {
    //   this.mapGeneralService.drawPolygonFromServer(event.polygon, event.id, event.title);
    // }
    // else {
    //   this.mapGeneralService.deleteIcon(event.id);
    //   this.mapGeneralService.deletePolygonManually(event.id);
    // }
    if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((geoInstruction, i) => {
        switch (geoInstruction.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
            const arrowData: POLYLINE_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              polyline: geoInstruction.arrow,
              optionsData: geoInstruction,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createArrowPolyline(arrowData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.point:
            const iconData: ICON_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              location: this.applicationService.geopoint3d_to_point3d(geoInstruction.location),
              optionsData: geoInstruction,
              type: ITEM_TYPE.task
            }
            this.mapGeneralService.createIcon(iconData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
            const polygonData: POLYGON_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              polygon: geoInstruction.polygon,
              optionsData: geoInstruction,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.drawPolygonFromServer(polygonData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
            const polylineData: POLYLINE_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              polyline: geoInstruction.polyline,
              optionsData: geoInstruction,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createPolyline(polylineData);
            break;
        }
      });
    }
  };
  public removeGeographicInstructionsFromMap = (task: TASK_DATA_UI) => {
    if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((geoInstruction, i) => {
        switch (geoInstruction.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
            this.mapGeneralService.deleteArrowPolylineFromMap(geoInstruction.id);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.point:
            this.mapGeneralService.deleteIcon(geoInstruction.id);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
            this.mapGeneralService.deletePolygonManually(geoInstruction.id);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
            this.mapGeneralService.deletePolylineFromMap(geoInstruction.id);
            break;
        }
      });
    }
  }
  // ----------------------
  public createTask = (taskData: TASK_DATA, cb?: Function) => {
    this.connectionService.post('/api/createTask', taskData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating task', title: ''});
        }
        else {
          if (cb) {
            try {
              cb(data.data);
            } catch (e) {}
          }
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating task', title: ''});
      });
  };
  // ----------------------
  public deleteTask = (idObj: ID_OBJ) => {
    this.connectionService.post('/api/deleteTask', idObj)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating task', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating task', title: ''});
      });
  };
  // ----------------------
  public sendTaskAction = (data: OSCC_TASK_ACTION) => {
    this.connectionService.post('/api/osccTaskAction', data)
      .then((res: ASYNC_RESPONSE) => {
        if (!res.success) {
          this.toasterService.error({message: 'error changing task status', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error changing task status', title: ''});
      });
  };
  // -----------------------
  public getTaskById = (taskId: string): TASK_DATA_UI => {
    return this.tasks.data.find(data => data.id === taskId);
  };
  // ------------------------
  public selectIcon = (task: TASK_DATA_UI) => {
    // this.mapGeneralService.editIcon(task.id, task.modeDefine.styles.selectedIcon, 40);
  };
  // ------------------------
  public unselectIcon = (task: TASK_DATA_UI) => {
    // this.mapGeneralService.editIcon(task.id, task.modeDefine.styles.icon, 30);
  };
  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

  // -----------------------
  public hideAll = () => {
    this.tasks.data.forEach((task: TASK_DATA_UI) => {
      if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
        task.geographicInstructions.forEach((geoInstruction, i) => {
          switch (geoInstruction.type) {
            case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
              this.mapGeneralService.hideArrowPolyline(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.address:
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.point:
              this.mapGeneralService.hideIcon(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
              this.mapGeneralService.hidePolygon(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
              this.mapGeneralService.hidePolyline(geoInstruction.id);
              break;
          }
        });
      }
    });
  }
  // -----------------------
  public showAll = () => {
    this.tasks.data.forEach((task: TASK_DATA_UI) => {
      if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
        task.geographicInstructions.forEach((geoInstruction, i) => {
          switch (geoInstruction.type) {
            case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
              this.mapGeneralService.showArriwPolyline(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.address:
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.point:
              this.mapGeneralService.showIcon(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
              this.mapGeneralService.showPolygon(geoInstruction.id);
              break;
            case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
              this.mapGeneralService.showPolyline(geoInstruction.id);
              break;
          }
        });
      }
    });
  }
}
