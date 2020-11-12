import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, GEOPOINT3D_SHORT,
  ID_OBJ, MISSION_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL, ICON_DATA} from "../../../types";
import {API_GENERAL, WS_API} from "../../../../../../classes/dataClasses/api/api_enums";


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  missions: {data: MISSION_DATA_UI[]} = {data: []};
  missions$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_missions').subscribe(this.updateMissions);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getMissions();
    }
  };
  // ----------------------
  public getMissions = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllMission, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateMissions(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateMissions = (data: MISSION_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.missions$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: MISSION_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.missions.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: MISSION_DATA_UI) => {
        const index = this.missions.data.findIndex(d => d.id === item.id);
        this.missions.data.splice(index, 1);
        //TODO: delete data from MAP
        this.removeFromMap(item);

      });
    }
  };
  // ----------------------
  private updateData = (reportData: MISSION_DATA_UI[]): void => {
    reportData.forEach((newItem: MISSION_DATA_UI) => {
      const existingEvent: MISSION_DATA_UI = this.getById(newItem.id);
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
        this.missions.data.push(newItem);
        // this.drawMission(newItem);
      }
      this.removeFromMap(newItem);
      this.drawMission(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: MISSION_DATA_UI) => {
    if (item.missionMapOverlay && item.missionMapOverlay.point) {
      this.mapGeneralService.deleteIcon(item.id);
    }

    if (item.missionMapOverlay && item.missionMapOverlay.areas) {
      item.missionMapOverlay.areas.forEach((area, index: number) => {
        const polygonId = item.id + '_' + index
        this.mapGeneralService.deletePolygonManually(polygonId);
      })
    }
  }
  // ----------------------
  private drawMission = (item: MISSION_DATA_UI) => {
    // icons
    if (item.missionMapOverlay && item.missionMapOverlay.point) {
      // TODO change
      const iconData: ICON_DATA = {
        id: item.id,
        description: item.description,
        modeDefine: item.modeDefine,
        location: {
          latitude: item.missionMapOverlay.point.lat,
          longitude: item.missionMapOverlay.point.lon,
          altitude: item.missionMapOverlay.point.alt,
        }
      }

      this.mapGeneralService.createIcon(iconData);
    }

    if (item.missionMapOverlay && item.missionMapOverlay.areas) {

      item.missionMapOverlay.areas.forEach((area: {coordinates: GEOPOINT3D_SHORT[]}, index: number) => {
        // TODO change
        const polygon: POINT3D[] = [];
        area.coordinates.forEach((coord) => {
          polygon.push([coord.lon, coord.lat, coord.alt]);
        });
        const polygonId = item.id + '_' + index
        this.mapGeneralService.drawPolygonFromServer(polygon, polygonId, undefined, undefined);
      })
    }
  };

  // ----------------------
  private updateMission = (item: MISSION_DATA_UI) => {

  };
  // -----------------------
  public getById = (id: string): MISSION_DATA_UI => {
    return this.missions.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };


}
