import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  GEOPOINT3D_SHORT,
  GRAPHIC_OVERLAY_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {ApplicationService} from '../applicationService/application.service';
import {ICON_DATA, POLYGON_DATA} from '../../../types';
import {GeoCalculate} from '../classes/geoCalculate';


@Injectable({
  providedIn: 'root'
})
export class GraphicOverlayService {

  graphicOverlays: { data: GRAPHIC_OVERLAY_DATA_UI[] } = {data: []};
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
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.readAllGraphicOverlay}`, {})
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
        const previousShapeType = this.getShapeType(existingEvent);
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
        if (previousShapeType !== this.getShapeType(existingEvent)) {
          this.removeFromMap(newItem);
        }
        // this.updateGraphicOverlay(newItem);
      } else {
        this.graphicOverlays.data.push(newItem);
        // this.drawGraphicOverlay(newItem);
      }
      this.drawGraphicOverlay(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: GRAPHIC_OVERLAY_DATA_UI) => {
    if (this.getShapeType(item) === 'icon') {
      this.mapGeneralService.deleteIcon(item.id);
    }

    if (this.getShapeType(item) === 'polygon') {
      this.mapGeneralService.deletePolygonManually(item.id);
    }
  };
  // ----------------------
  private drawGraphicOverlay = (item: GRAPHIC_OVERLAY_DATA_UI) => {
    // icons
    const shapeType = this.getShapeType(item);
    if (shapeType === 'icon') {
      // TODO change
      const iconData: ICON_DATA = {
        id: item.id,
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showGraphicOverlays,
        location: GeoCalculate.geopoint3d_short_to_point3d(item.shape as GEOPOINT3D_SHORT),
        optionsData: item,
        type: undefined
      };
      this.mapGeneralService.createIcon(iconData);
    } else if (shapeType === 'polygon') {
      const polygonData: POLYGON_DATA = {
        id: item.id,
        modeDefine: item.modeDefine,
        isShow: this.applicationService.screen.showGraphicOverlays,
        polygon: GeoCalculate.geopoint3d_short_to_point3d_arr(item.shape.coordinates),
        optionsData: item,
        type: undefined
      };
      this.mapGeneralService.drawPolygonFromServer(polygonData);
    }
  };

  // ----------------------
  // private updateGraphicOverlay = (item: GRAPHIC_OVERLAY_DATA_UI) => {
  //
  // };
  // -----------------------
  public getById = (id: string): GRAPHIC_OVERLAY_DATA_UI => {
    return this.graphicOverlays.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };
  // -----------------------
  private getShapeType = (item: GRAPHIC_OVERLAY_DATA_UI): 'icon' | 'polygon' => {
    let res: 'icon' | 'polygon';
    if (item.shape) {
      if (item.shape.coordinates) {
        res = 'polygon';
      } else if (item.shape.lat && item.shape.lon) {
        res = 'icon';
      }
    }
    return res;
  };

  // -----------------------
  public hideAll = () => {
    this.graphicOverlays.data.forEach((item: GRAPHIC_OVERLAY_DATA_UI) => {
      const shapeType = this.getShapeType(item);
      if (shapeType === 'icon') {
        this.mapGeneralService.hideIcon(item.id);
      } else if (shapeType === 'polygon') {
        this.mapGeneralService.hidePolygon(item.id);
      }
    });
  };
  // -----------------------
  public showAll = () => {
    this.graphicOverlays.data.forEach((item: GRAPHIC_OVERLAY_DATA_UI) => {
      const shapeType = this.getShapeType(item);
      if (shapeType === 'icon') {
        this.mapGeneralService.showIcon(item.id);
      } else if (shapeType === 'polygon') {
        this.mapGeneralService.showPolygon(item.id);
      }
    });
  }

}
