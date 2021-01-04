import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
 GEOPOINT3D_SHORT,
   ID_TYPE, MISSION_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ICON_DATA, ITEM_TYPE, MAP, POLYGON_DATA} from '../../../types';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {ApplicationService} from '../applicationService/application.service';
import {GeoCalculate} from '../classes/geoCalculate';


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  missions: {data: MISSION_DATA_UI[]} = {data: []};
  missions$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  polygonIdsByMission: MAP<string[]> = {};

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {
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
        this.updateMission(newItem);
      } else {
        this.missions.data.push(newItem);
        this.drawMission(newItem);
      }
    });
  };
  // ----------------------
  private removeFromMap = (item: MISSION_DATA_UI) => {
    if (item.missionMapOverlay && item.missionMapOverlay.point) {
      this.mapGeneralService.deleteIcon(item.id);
    }

    if (item.missionMapOverlay && item.missionMapOverlay.areas) {
      item.missionMapOverlay.areas.forEach((area, index: number) => {
        this.mapGeneralService.deletePolygonManually(this.getIdPolygon(item.id, index));
        delete this.polygonIdsByMission[item.id];
      });
    }
  };
  // ----------------------
  private drawMission = (item: MISSION_DATA_UI) => {
    // icons
    this.polygonIdsByMission[item.id] = [];
    if (item.missionMapOverlay && item.missionMapOverlay.point) {
      const iconData: ICON_DATA = {
        id: item.id,
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showMissions,
        location: GeoCalculate.geopoint3d_short_to_point3d(item.missionMapOverlay.point),
        optionsData: item,
        type: ITEM_TYPE.mission
      };
      this.mapGeneralService.createIcon(iconData);
    }

    if (item.missionMapOverlay && item.missionMapOverlay.areas) {
      item.missionMapOverlay.areas.forEach((area: {coordinates: GEOPOINT3D_SHORT[]}, index: number) => {
        const polygonData: POLYGON_DATA = {
          id: this.getIdPolygon(item.id, index),
          modeDefine: item.modeDefine,
          isShow: this.applicationService.screen.showMissions,
          polygon: GeoCalculate.geopoint3d_short_to_point3d_arr(area.coordinates),
          optionsData: item,
          type: ITEM_TYPE.mission
        };
        this.polygonIdsByMission[item.id].push(polygonData.id);
        this.mapGeneralService.drawPolygonFromServer(polygonData);
      });
    }
  };

  // ----------------------
  private updateMission = (item: MISSION_DATA_UI) => {
    this.drawMission(item);
  };
  // -----------------------
  public getById = (id: string): MISSION_DATA_UI => {
    return this.missions.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };
  // -----------------------
  private getIdPolygon = (missionId: ID_TYPE, index: number) => {
    return missionId + '_' + index;
  };
  // -----------------------
  public hideAll = () => {
    this.missions.data.forEach((item: MISSION_DATA_UI) => {
      if (item.missionMapOverlay && item.missionMapOverlay.point) {
        this.mapGeneralService.hideIcon(item.id);
      }

      if (item.missionMapOverlay && item.missionMapOverlay.areas) {
        item.missionMapOverlay.areas.forEach((area: {coordinates: GEOPOINT3D_SHORT[]}, index: number) => {
          const id = this.getIdPolygon(item.id, index);
          this.mapGeneralService.hidePolygon(id);
        });
      }
    });
  };
  // -----------------------
  public showAll = () => {
    this.missions.data.forEach((item: MISSION_DATA_UI) => {
      if (item.missionMapOverlay && item.missionMapOverlay.point) {
        this.mapGeneralService.showIcon(item.id);
      }

      if (item.missionMapOverlay && item.missionMapOverlay.areas) {
        item.missionMapOverlay.areas.forEach((area: {coordinates: GEOPOINT3D_SHORT[]}, index: number) => {
          const id = this.getIdPolygon(item.id, index);
          this.mapGeneralService.showPolygon(id);
        });
      }
    });
  };

}
