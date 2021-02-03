import { Injectable } from '@angular/core';
import {
  ASYNC_RESPONSE, CHAT_GROUP, FR_DATA_UI, GEOGRAPHIC_INSTRUCTION_TYPE, ID_OBJ, ID_TYPE, OSCC_TASK_ACTION,
  POINT,
  POINT3D, TASK_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {BehaviorSubject} from 'rxjs';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import * as _ from 'lodash';
import {HEADER_BUTTONS, ICON_DATA, ITEM_TYPE, POLYGON_DATA, POLYLINE_DATA} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {GeoCalculate} from '../classes/geoCalculate';
import {ChatService} from '../chatService/chat.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasks: {data: TASK_DATA_UI[]} = {data: []};
  tasks$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedElement: TASK_DATA_UI;
  changeSelected$: BehaviorSubject<ID_TYPE> = new BehaviorSubject(undefined);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService,
              private chatService: ChatService) {
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
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.readAllTask}`, {})
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

      // if (!newTask.chatGroup) {
      //   const chatGroup: CHAT_GROUP = this.chatService.createTaskGroup(newTask.title, newTask.idView);
      //   if (chatGroup) {
      //     newTask.chatGroup = chatGroup;
      //     this.sendTaskToServer(newTask);
      //   }
      // }
    });
  };
  // ----------------------
  private drawTask = (task: TASK_DATA_UI) => {
    let iconData: ICON_DATA;
    if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((geoInstruction, i) => {
        switch (geoInstruction.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
            const arrowData: POLYLINE_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              polyline: geoInstruction.arrow,
              optionsData: task,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createArrowPolyline(arrowData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
            iconData = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              location: GeoCalculate.geopoint3d_short_to_point3d(geoInstruction.location),
              optionsData: task,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createIcon(iconData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.point:
            iconData = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              location: GeoCalculate.geopoint3d_short_to_point3d(geoInstruction.location),
              optionsData: task,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createIcon(iconData);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
            const polygonData: POLYGON_DATA = {
              id: geoInstruction.id,
              modeDefine: geoInstruction.modeDefine,
              isShow: this.applicationService.screen.showTasks,
              polygon: geoInstruction.polygon,
              optionsData: task,
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
              optionsData: task,
              type: ITEM_TYPE.task
            };
            this.mapGeneralService.createPolyline(polylineData);
            break;
        }
      });
    }

    if (this.selectedElement && this.selectedElement.id === task.id) {
      this.selectIcon(task);
    }
  };
  // ----------------------
  public removeGeographicInstructionsFromMap = (task: TASK_DATA_UI) => {
    if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((geoInstruction, i) => {
        switch (geoInstruction.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
            this.mapGeneralService.deleteArrowPolylineFromMap(geoInstruction.id);
            break;
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
            this.mapGeneralService.deleteIcon(geoInstruction.id);
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
  };
  // ----------------------
  public createTask = (taskData: TASK_DATA_UI) => {
    if (taskData.chatGroup === undefined) {
      const chatGroup: CHAT_GROUP = this.chatService.createTaskGroup(taskData.title, taskData.idView);
      if (chatGroup) {
        taskData.chatGroup = chatGroup;
      }
      this.sendTaskToServer(taskData);
    }
    else {
      this.sendTaskToServer(taskData);
    }
  };
  // ----------------------
  private sendTaskToServer = (taskData: TASK_DATA_UI) => {
    this.connectionService.post(`/${API_GENERAL.general}${WS_API.createTask}`, taskData)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error creating task', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error creating task', title: ''});
      });
  }
  // ----------------------
  public deleteTask = (idObj: ID_OBJ) => {
    this.connectionService.post(`/${API_GENERAL.general}${WS_API.deleteTask}`, idObj)
      .then((data: ASYNC_RESPONSE) => {
        if (!data.success) {
          this.toasterService.error({message: 'error deleting task', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error deleting task', title: ''});
      });
  };
  // ----------------------
  public sendTaskAction = (data: OSCC_TASK_ACTION) => {
    this.connectionService.post(`/${API_GENERAL.general}${WS_API.osccTaskAction}`, data)
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
    if (task && Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((item, i) => {
        switch (item.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow: {
            const options = {outlineColor: this.mapGeneralService.selectedPolylineColor};
            this.mapGeneralService.editArrowPolyline(item.id, options);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
          case GEOGRAPHIC_INSTRUCTION_TYPE.point: {
            const size = {width: item.modeDefine.styles.iconSize.width + 10, height: item.modeDefine.styles.iconSize.height + 10};
            this.mapGeneralService.editIcon(item.id, item.modeDefine.styles.mapIconSelected, size);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.polyline: {
            const options = {outlineColor: this.mapGeneralService.selectedPolylineColor};
            this.mapGeneralService.editPolyline(item.id, options);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon: {
            const options = {outlineColor: this.mapGeneralService.selectedPolylineColor, fillColor: item.modeDefine.styles.fillColor};
            this.mapGeneralService.editPolygonFromServer(item.id, options);
            break;
          }
        }
      });
    }
  };
  // ------------------------
  public unselectIcon = (task: TASK_DATA_UI) => {
    if (task && Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
      task.geographicInstructions.forEach((item, i) => {
        switch (item.type) {
          case GEOGRAPHIC_INSTRUCTION_TYPE.arrow: {
            const options = {outlineColor: item.modeDefine.styles.color};
            this.mapGeneralService.editArrowPolyline(item.id, options);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.address:
          case GEOGRAPHIC_INSTRUCTION_TYPE.point: {
            this.mapGeneralService.editIcon(item.id, item.modeDefine.styles.mapIcon, item.modeDefine.styles.iconSize);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.polyline: {
            const options = {outlineColor: item.modeDefine.styles.color};
            this.mapGeneralService.editPolyline(item.id, options);
            break;
          }
          case GEOGRAPHIC_INSTRUCTION_TYPE.polygon: {
            const options = {outlineColor: item.modeDefine.styles.color, fillColor: item.modeDefine.styles.fillColor};
            this.mapGeneralService.editPolygonFromServer(item.id, options);
            break;
          }
        }
      });
    }
  };
  // -----------------------
  public flyToObject = (task: TASK_DATA_UI) => {
    if (task.geographicInstructions && task.geographicInstructions.length > 0) {
      const geoInstruction = task.geographicInstructions[0];
      let coordinates: POINT3D;

      switch (geoInstruction.type) {
        case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
          coordinates = geoInstruction.arrow[0];
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.address:
          coordinates = GeoCalculate.geopoint3d_short_to_point3d(geoInstruction.location);
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.point:
          coordinates = GeoCalculate.geopoint3d_short_to_point3d(geoInstruction.location);
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
          coordinates = geoInstruction.polygon[0];
          break;
        case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
          coordinates = geoInstruction.polyline[0];
          break;
      }

       if (coordinates) {
         this.mapGeneralService.flyToObject(coordinates);
       }
    }

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
              this.mapGeneralService.hideIcon(geoInstruction.id);
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
  };
  // -----------------------
  public showAll = () => {
    if (this.applicationService.screen.showTasks) {
      this.tasks.data.forEach((task: TASK_DATA_UI) => {
        if (Array.isArray(task.geographicInstructions) && task.geographicInstructions.length > 0) {
          task.geographicInstructions.forEach((geoInstruction, i) => {
            switch (geoInstruction.type) {
              case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
                this.mapGeneralService.showArriwPolyline(geoInstruction.id);
                break;
              case GEOGRAPHIC_INSTRUCTION_TYPE.address:
                this.mapGeneralService.showIcon(geoInstruction.id);
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
  };
  // -----------------------
  public goToTask = (id: ID_TYPE) => {
    if (id !== undefined) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.setLeftPanelTrue();      console.log('screen.showLeftPanel = true');
      this.applicationService.screen.showMissionControl = true;
      // choose missionTab on MissionControl
      this.applicationService.currentTabIndexMissionControl = 0; /*(0 = TaskTab, 1 = MissionTab)*/
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;


      setTimeout(() => {
        const item = this.getTaskById(id);
        if (item) {
          this.changeSelected$.next(id);
        }
      }, 500);

    }
  }
}
