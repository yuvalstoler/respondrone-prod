import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, MISSION_REQUEST_DATA, MISSION_REQUEST_DATA_UI,
   MISSION_ROUTE_DATA,
  POINT3D, MISSION_REQUEST_ACTION_OBJ,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';


@Injectable({
  providedIn: 'root'
})
export class MissionRequestService {

  missionRequests: {data: MISSION_REQUEST_DATA_UI[]} = {data: []};
  missionRequests$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_missionRequests').subscribe(this.updateMissionRequests);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getMissionRequests();
    }
  };
  // ----------------------
  public getMissionRequests = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllMissionRequest, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateMissionRequests(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  public sendMissionRequestAction = (data: MISSION_REQUEST_ACTION_OBJ) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.missionRequestAction, data)
      .then((res: ASYNC_RESPONSE) => {
        if (!res.success) {
          this.toasterService.error({message: 'error changing task status', title: ''});
        }
      })
      .catch(e => {
        this.toasterService.error({message: 'error changing task status', title: ''});
      });
  };
  // ----------------------
  private updateMissionRequests = (data: MISSION_REQUEST_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.missionRequests$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: MISSION_REQUEST_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.missionRequests.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: MISSION_ROUTE_DATA) => {
        const index = this.missionRequests.data.findIndex(d => d.id === item.id);
        this.missionRequests.data.splice(index, 1);
        //TODO: delete data from MAP
        // this.mapGeneralService.deleteIcon(item.id);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: MISSION_REQUEST_DATA_UI[]): void => {
    reportData.forEach((newItem: MISSION_REQUEST_DATA_UI) => {
      const existingEvent: MISSION_REQUEST_DATA_UI = this.getById(newItem.id);
      if (existingEvent) {
        // existingEvent.setValues(newEvent);
        for (const fieldName in existingEvent) {
          if (existingEvent.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newItem[fieldName];
          }
        }
        for (const fieldName in newItem) {
          if (newItem.hasOwnProperty(fieldName)) {
            existingEvent[fieldName] = newItem[fieldName];
          }
        }
        // this.updateMission(newItem);
      } else {
        this.missionRequests.data.push(newItem);
        // this.drawMission(newItem);
      }
      this.removeAllDataFromMap();
      this.drawMission(newItem);
    });
  };
  // ----------------------
  public createMissionRequest = (missionRequest: MISSION_REQUEST_DATA) => {
    this.connectionService.post('/' + API_GENERAL.general + WS_API.createMissionRequest, missionRequest)
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  };
  // ----------------------
  private removeAllDataFromMap = () => {
    // TODO edit instead of delete+draw
    this.missionRequests.data.forEach((item: MISSION_REQUEST_DATA_UI) => {

      this.mapGeneralService.deleteIcon(item.id);
      this.mapGeneralService.deletePolygonManually(item.id);

    });
  };
  // ----------------------
  private drawMission = (item: MISSION_REQUEST_DATA_UI) => {
    // switch(item.missionType) {
    //
    // }
  };
  // -----------------------
  public getById = (id: string): MISSION_REQUEST_DATA_UI => {
    return this.missionRequests.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (obj: MISSION_REQUEST_DATA_UI) => {
    let coordinates: POINT3D;

    // this.mapGeneralService.flyToObject(coordinates);
  };


}
