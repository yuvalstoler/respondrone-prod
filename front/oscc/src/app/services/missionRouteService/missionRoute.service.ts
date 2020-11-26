import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, GEOPOINT3D_SHORT,
  ID_OBJ, ID_TYPE, MISSION_DATA_UI, MISSION_REQUEST_DATA_UI, MISSION_ROUTE_DATA, MISSION_ROUTE_DATA_UI, MISSION_STATUS,
  POINT,
  POINT3D, PointOfRoute, SOURCE_TYPE,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL, HEADER_BUTTONS, ICON_DATA} from "../../../types";
import {API_GENERAL, WS_API} from "../../../../../../classes/dataClasses/api/api_enums";
import {MissionRequestService} from "../missionRequestService/missionRequest.service";
import {ApplicationService} from "../applicationService/application.service";


@Injectable({
  providedIn: 'root'
})
export class MissionRouteService {

  missionRoutes: {data: MISSION_ROUTE_DATA_UI[]} = {data: []};
  missionRoutes$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private missionRequestService: MissionRequestService,
              private applicationService: ApplicationService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_missionRoutes').subscribe(this.updateMissionRoutes);
  };
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getMissionRoutes();
    }
  };
  // ----------------------
  public getMissionRoutes = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllMissionRoute, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateMissionRoutes(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateMissionRoutes = (data: MISSION_ROUTE_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.missionRoutes$.next(true);
    }
  };
  // ----------------------
  private updateRoutes = (data: MISSION_ROUTE_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.missionRoutes$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: MISSION_ROUTE_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.missionRoutes.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: MISSION_ROUTE_DATA_UI) => {
        const index = this.missionRoutes.data.findIndex(d => d.id === item.id);
        this.missionRoutes.data.splice(index, 1);
        //TODO: delete data from MAP
        this.removeFromMap(item);
      });
    }
  };
  // ----------------------
  private updateData = (reportData: MISSION_ROUTE_DATA_UI[]): void => {
    reportData.forEach((newItem: MISSION_ROUTE_DATA_UI) => {
      const existingEvent: MISSION_ROUTE_DATA_UI = this.getById(newItem.id);
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
        this.missionRoutes.data.push(newItem);
        // this.drawMission(newItem);

        if ((Date.now() - newItem.time) < 1000 * 60 * 5) {
          this.toasterService.missionToaster({message: `New mission Request <span class="underline">${_.get(newItem, 'modeDefine.data.missionName')}</span> is waiting for approval`, title: ''} , () => {
            this.missionRequestService.goToMissionRequest(newItem.requestId);
            this.flyToObject(newItem);
          });
        }
      }
      this.removeFromMap(newItem);
      this.drawMission(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: MISSION_ROUTE_DATA_UI) => {
    if (item.route) {
      this.mapGeneralService.deletePolylineFromMap(item.id);
    }
  }
  // ----------------------
  private drawMission = (item: MISSION_ROUTE_DATA_UI) => {
    const polyline: POINT3D[] = [];
    item.route.forEach((pointOfRoute: PointOfRoute) => {
      polyline.push([pointOfRoute.point.lon, pointOfRoute.point.lat, pointOfRoute.point.alt]);
    });
    this.mapGeneralService.createPolyline(polyline, item.id, undefined, item.modeDefine);
  };
  // -----------------------
  public getById = (id: string): MISSION_ROUTE_DATA_UI => {
    return this.missionRoutes.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (missionRouteData: MISSION_ROUTE_DATA_UI) => {
    if (missionRouteData.route[0] && missionRouteData.route[0].point) {
      this.mapGeneralService.flyToObject(this.applicationService.geopoint3d_short_to_point3d( missionRouteData.route[0].point));
    }
  };

}
