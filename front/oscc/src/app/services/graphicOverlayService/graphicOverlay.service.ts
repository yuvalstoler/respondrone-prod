import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  ASYNC_RESPONSE, GEOPOINT3D_SHORT, GRAPHIC_OVERLAY_DATA_UI,
  ID_OBJ,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {DRAW_LABEL, ICON_DATA} from "../../../types";
import {API_GENERAL, WS_API} from "../../../../../../classes/dataClasses/api/api_enums";
import {ApplicationService} from "../applicationService/application.service";


@Injectable({
  providedIn: 'root'
})
export class GraphicOverlayService {

  graphicOverlays: {data: GRAPHIC_OVERLAY_DATA_UI[]} = {data: []};
  graphicOverlays$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_graphicOverlays').subscribe(this.updateGraphicOverlays);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getGraphicOverlays();
    }
  };
  // ----------------------
  public getGraphicOverlays = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllGraphicOverlay, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateGraphicOverlays(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateGraphicOverlays = (data: GRAPHIC_OVERLAY_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.graphicOverlays$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: GRAPHIC_OVERLAY_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.graphicOverlays.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: GRAPHIC_OVERLAY_DATA_UI) => {
        const index = this.graphicOverlays.data.findIndex(d => d.id === item.id);
        this.graphicOverlays.data.splice(index, 1);
        //TODO: delete data from MAP
        this.removeFromMap(item);

      });
    }
  };
  // ----------------------
  private updateData = (reportData: GRAPHIC_OVERLAY_DATA_UI[]): void => {
    reportData.forEach((newItem: GRAPHIC_OVERLAY_DATA_UI) => {
      const existingEvent: GRAPHIC_OVERLAY_DATA_UI = this.getById(newItem.id);
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
        // this.updateGraphicOverlay(newItem);
      } else {
        this.graphicOverlays.data.push(newItem);
        // this.drawGraphicOverlay(newItem);
      }
      this.removeFromMap(newItem);
      this.drawGraphicOverlay(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: GRAPHIC_OVERLAY_DATA_UI) => {
    if (item.shape && item.shape.lat && item.shape.lon) {
      this.mapGeneralService.deleteIcon(item.id);
    }

    if (item.shape && item.shape.coordinates) {
      this.mapGeneralService.deletePolygonManually(item.id);
    }
  }
  // ----------------------
  private drawGraphicOverlay = (item: GRAPHIC_OVERLAY_DATA_UI) => {
    // icons
    if (item.shape && item.shape.lat && item.shape.lon) {
      // TODO change
      const iconData: ICON_DATA = {
        id: item.id,
        description: undefined,
        modeDefine: item.modeDefine,
        location: {
          latitude: item.shape.lat,
          longitude: item.shape.lon,
          altitude: item.shape.alt,
        }
      }
      this.mapGeneralService.createIcon(iconData);
    }

    if (item.shape && item.shape.coordinates) {
      const polygon: POINT3D[] = this.applicationService.geopoint3d_short_to_point3d_arr(item.shape.coordinates);
      this.mapGeneralService.drawPolygonFromServer(polygon, item.id, item.Type, undefined);
    }
  };

  // ----------------------
  private updateGraphicOverlay = (item: GRAPHIC_OVERLAY_DATA_UI) => {

  };
  // -----------------------
  public getById = (id: string): GRAPHIC_OVERLAY_DATA_UI => {
    return this.graphicOverlays.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };


}
