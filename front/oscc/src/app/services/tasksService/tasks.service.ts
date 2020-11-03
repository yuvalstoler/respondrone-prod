import { Injectable } from '@angular/core';
import {
  ASYNC_RESPONSE, GEOGRAPHIC_INSTRUCTION, GEOGRAPHIC_INSTRUCTION_TYPE, ID_OBJ, OSCC_TASK_ACTION,
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

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasks: {data: TASK_DATA_UI[]} = {data: []};
  tasks$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {
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
        this.tasks.data.splice(index, 1);
        //TODO: delete data from MAP

        // this.mapGeneralService.deleteIcon(data.id);
        // this.mapGeneralService.deletePolygonManually(data.id);
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
    // : GEOGRAPHIC_INSTRUCTION[]
      task.geographicInstructions.forEach((geoInstruction) => {
        switch (geoInstruction.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
            this.mapGeneralService.deleteArrowPolylineFromMap(geoInstruction.id);
            this.mapGeneralService.createArrowPolyline(geoInstruction.arrow, geoInstruction.id, geoInstruction.description);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.point:
            this.mapGeneralService.deleteIcon(geoInstruction.id);
            this.mapGeneralService.createIcon(geoInstruction);
            //   TODO this.mapGeneralService.updateIcon(geoInstruction);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
            this.mapGeneralService.deletePolygonManually(geoInstruction.id);
            this.mapGeneralService.drawPolygonFromServer(geoInstruction.polygon, geoInstruction.id, undefined, geoInstruction.description);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
            this.mapGeneralService.deletePolylineFromMap(geoInstruction.id);
            this.mapGeneralService.createPolyline(geoInstruction.polyline, geoInstruction.id, geoInstruction.description);
            break;
        }
      });
    }
  };
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

  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

}
