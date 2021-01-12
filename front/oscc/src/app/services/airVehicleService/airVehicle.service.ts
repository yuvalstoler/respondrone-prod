import {Injectable} from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {AV_DATA_UI, ID_TYPE, POINT3D} from '../../../../../../classes/typings/all.typings';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {BehaviorSubject} from 'rxjs';
import {MapGeneralService} from '../mapGeneral/map-general.service';
import {ICON_DATA, ITEM_TYPE} from '../../../types';
import {ApplicationService} from '../applicationService/application.service';
import {GeoCalculate} from '../classes/geoCalculate';

@Injectable({
  providedIn: 'root'
})
export class AirVehicleService {

  airVehicles: { data: AV_DATA_UI[] } = {data: []};
  airVehicles$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedElement: AV_DATA_UI;

  constructor(private connectionService: ConnectionService,
              private socketService: SocketService,
              private toasterService: CustomToasterService,
              private mapGeneralService: MapGeneralService,
              private applicationService: ApplicationService) {

    this.socketService.connectToRoom('webServer_airVehiclesData').subscribe(this.updateAVs);

  }

  // ----------------------
  private updateAVs = (data: AV_DATA_UI[]): void => {
    if (Array.isArray(data)) {
      this.removeIfNotExist(data);
      this.updateData(data);
      this.airVehicles$.next(true);
    }
  };
  // ----------------------
  private removeIfNotExist = (data: AV_DATA_UI[]): void => {
    const notExist = _.differenceWith(this.airVehicles.data, data, (o1, o2) => {
      return o1['id'] === o2['id'];
    });
    if (notExist.length > 0) {
      notExist.forEach((av: AV_DATA_UI) => {
        const index = this.airVehicles.data.findIndex(d => d.id === av.id);
        this.airVehicles.data.splice(index, 1);
        //TODO: delete data from MAP
        this.mapGeneralService.deleteIcon(this.getId(av.id));
      });
    }
  };
  // ----------------------
  private updateData = (newItemArr: AV_DATA_UI[]): void => {
    newItemArr.forEach((newItem: AV_DATA_UI) => {
      const existingEvent: AV_DATA_UI = this.getAirVehicleById(newItem.id);
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
        this.updateAirVehicle(newItem);
      } else {
        this.airVehicles.data.push(newItem);
        this.drawAirVehicle(newItem);
      }

    });
  };
  // ----------------------
  private drawAirVehicle = (av: AV_DATA_UI) => {
    const iconData: ICON_DATA = {
      id: this.getId(av.id),
      modeDefine: av.modeDefine,
      isShow: this.applicationService.screen.showUAV,
      location: GeoCalculate.geopoint3d_short_to_point3d(av.location),
      heading: av.heading,
      optionsData: av,
      type: ITEM_TYPE.av

    };
    this.mapGeneralService.createIcon(iconData);

    if (this.selectedElement && this.selectedElement.id === av.id) {
      this.selectIcon(av);
    }
  };
  // ----------------------
  private updateAirVehicle = (av: AV_DATA_UI) => {
    this.drawAirVehicle(av);
  };
  // -----------------------
  public getAirVehicleById = (id: string): AV_DATA_UI => {
    return this.airVehicles.data.find(data => data.id === id);
  };
  // ------------------------
  public selectIcon = (item: AV_DATA_UI) => {
    if (item && item.modeDefine.styles.iconSize) {
      const size = {width: item.modeDefine.styles.iconSize.width + 10, height: item.modeDefine.styles.iconSize.height + 10};
      this.mapGeneralService.editIcon(this.getId(item.id), item.modeDefine.styles.mapIconSelected, size);
    }
  };
  // ------------------------
  public unselectIcon = (item: AV_DATA_UI) => {
    if (item) {
      this.mapGeneralService.editIcon(this.getId(item.id), item.modeDefine.styles.mapIcon, item.modeDefine.styles.iconSize);
    }
  };
  // -----------------------
  public flyToObject = (object: AV_DATA_UI) => {
    if (object && object.location) {
      const coordinates: POINT3D = GeoCalculate.geopoint3d_short_to_point3d(object.location);
      this.mapGeneralService.flyToObject(coordinates);
    }
  };
  // -------------------------
  public goToAV = (id: ID_TYPE) => {
    const item = this.getAirVehicleById(id);
    if (item) {
      this.unselectIcon(this.selectedElement);
      this.selectedElement = (this.selectedElement && this.selectedElement.id === id) ? undefined : item;
      this.selectIcon(item);
    }
  }

  // -----------------------
  private getId = (id: string) => { // to make sure the ID is unique
    return 'av' + id;
  };
  // -----------------------
  public hideAll = () => {
    this.airVehicles.data.forEach((av: AV_DATA_UI) => {
      this.mapGeneralService.hideIcon(this.getId(av.id));
    });
  };
  // -----------------------
  public showAll = () => {
    this.airVehicles.data.forEach((av: AV_DATA_UI) => {
      this.mapGeneralService.showIcon(this.getId(av.id));
    });
  };

}
