import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {
  NFZ_DATA_UI,
  POINT,
  POINT3D,
} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {ApplicationService} from '../applicationService/application.service';
import {POLYGON_DATA} from '../../../types';
import {GeoCalculate} from '../classes/geoCalculate';


@Injectable({
  providedIn: 'root'
})
export class NFZService {

  nfzs: {data: NFZ_DATA_UI[]} = {data: []};
  nfzs$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_nfzs').subscribe(this.updateNFZs);
  }
  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getNFZs();
    }
  };
  // ----------------------
  public getNFZs = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post('/' + API_GENERAL.general + WS_API.readAllNFZ, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateNFZs(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateNFZs = (data: NFZ_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.nfzs$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: NFZ_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.nfzs.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((item: NFZ_DATA_UI) => {
        const index = this.nfzs.data.findIndex(d => d.id === item.id);
        this.nfzs.data.splice(index, 1);
        //TODO: delete data from MAP
        this.removeFromMap(item);

      });
    }
  };
  // ----------------------
  private updateData = (reportData: NFZ_DATA_UI[]): void => {
    reportData.forEach((newItem: NFZ_DATA_UI) => {
      const existingEvent: NFZ_DATA_UI = this.getById(newItem.id);
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
        // this.updateNFZ(newItem);
      } else {
        this.nfzs.data.push(newItem);
        // this.drawNFZ(newItem);
      }
      this.drawNFZ(newItem);
    });
  };
  // ----------------------
  private removeFromMap = (item: NFZ_DATA_UI) => {
    this.mapGeneralService.deletePolygonManually(item.id);
  };
  // ----------------------
  private drawNFZ = (item: NFZ_DATA_UI) => {

    const polygonData: POLYGON_DATA = {
      id: item.id,
      modeDefine: item.modeDefine,
      isShow: this.applicationService.screen.showNFZ,
      polygon: GeoCalculate.geopoint3d_short_to_point3d_arr(item.polygon.coordinates),
      optionsData: item,
      type: undefined
    };
    this.mapGeneralService.drawPolygonFromServer(polygonData);
  };

  // ----------------------
  // private updateNFZ = (item: NFZ_DATA_UI) => {
  //
  // };
  // -----------------------
  public getById = (id: string): NFZ_DATA_UI => {
    return this.nfzs.data.find(data => data.id === id);
  };

  // -----------------------
  public flyToObject = (coordinates: POINT | POINT3D) => {
    this.mapGeneralService.flyToObject(coordinates);
  };

  // -----------------------
  public hideAll = () => {
    this.nfzs.data.forEach((item: NFZ_DATA_UI) => {
      this.mapGeneralService.hidePolygon(item.id);
    });
  };
  // -----------------------
  public showAll = () => {
    this.nfzs.data.forEach((item: NFZ_DATA_UI) => {
      this.mapGeneralService.showPolygon(item.id);
    });
  };

}
