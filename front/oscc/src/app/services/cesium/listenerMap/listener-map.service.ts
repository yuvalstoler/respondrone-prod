import {Injectable} from '@angular/core';
import {ApplicationService} from '../../applicationService/application.service';
import {MapGeneralService} from '../../mapGeneral/map-general.service';
import {EVENT_LISTENER_DATA, ITEM_TYPE} from '../../../../types';
import {CesiumService} from '../cesium.service';
import {MissionRequestService} from '../../missionRequestService/missionRequest.service';
import {ReportService} from '../../reportService/report.service';
import {EventService} from '../../eventService/event.service';
import {TasksService} from '../../tasksService/tasks.service';
import {AirVehicleService} from '../../airVehicleService/airVehicle.service';
import {FRService} from '../../frService/fr.service';
import {ContextMenuService} from '../../contextMenuService/context-menu.service';

@Injectable({
  providedIn: 'root'
})
export class ListenerMapService {

  constructor(public mapGeneralService: MapGeneralService,
              public cesiumService: CesiumService,
              public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public reportService: ReportService,
              public eventService: EventService,
              public taskService: TasksService,
              public airVehicleService: AirVehicleService,
              public frService: FRService,
              public contextMenuService: ContextMenuService) {
    this.setEventCallbacks();
  }

  public setEventCallbacks = () => {
    // show billboard
    this.mapGeneralService.setMouseOverCallback(undefined, 'hoverTextDraw', this.showHoverText);
    this.mapGeneralService.setMouseOverCallback(undefined, 'cursorPosition', this.showCursorPosition);
    this.mapGeneralService.setMouseDownCallback(undefined, 'showItemOnTable', this.showItemOnTable);
    this.mapGeneralService.setRightClickCallback(undefined, 'showContextMenu', this.showContextMenu);
    };

  public showHoverText = (event: EVENT_LISTENER_DATA) => {
    if (event.object && event.object.hoverText && event.type === 'mouseOver') {
      const screenPosition = this.cesiumService.latLonToScreenPosition(event.pointLatLng);
      this.applicationService.hoverTextData = {
        top: (screenPosition.y + 90) + 'px',
        left: `calc(50vw + ${screenPosition.x}px)`,
        text: event.object.hoverText
      };
    }
    else {
      this.applicationService.hoverTextData = undefined;
    }
  };

  public showItemOnTable = (event: EVENT_LISTENER_DATA) => {
    this.contextMenuService.closeContextMenu();

    if (event.object && event.object.data) {
      if (event.object.type === ITEM_TYPE.report) {
        this.reportService.goToReport(event.object.data.id);
      }
      else if (event.object.type === ITEM_TYPE.event) {
        this.eventService.goToEvent(event.object.data.id);
      }
      else if (event.object.type === ITEM_TYPE.task) {
        this.taskService.goToTask(event.object.data.id);
      }
      else if (event.object.type === ITEM_TYPE.missionRequest) {
        this.missionRequestService.goToMissionRequest(event.object.data.id);
      }
      else if (event.object.type === ITEM_TYPE.missionRoute || event.object.type === ITEM_TYPE.mission) {
        this.missionRequestService.goToMissionRequest(event.object.data.requestId);
      }
      else if (event.object.type === ITEM_TYPE.fr) {
        this.frService.goToFR(event.object.data.id);
      }
      else if (event.object.type === ITEM_TYPE.av) {
        this.airVehicleService.goToAV(event.object.data.id);
      }
    }
  };

  public showContextMenu = (event: EVENT_LISTENER_DATA) => {
    this.contextMenuService.closeContextMenu();

    if (event.object && event.object.data) {
      if (event.object.type === ITEM_TYPE.fr) {
        if (event.pointPX) {
          const fr = this.frService.getFRById(event.object.data.id);
          if (fr) {
            this.frService.selectedElement = fr;
            this.contextMenuService.singleTooltip.top = event.pointPX.y  + 70  + 'px';
            this.contextMenuService.singleTooltip.left = `calc(50vw + ${event.pointPX.x}px)`;
            this.contextMenuService.openFRContextMenu();
          }
        }
      }
    }
  };

  // public showBillboard = (event: EVENT_LISTENER_DATA) => {
  //   // if (this.applicationService.stateDraw === STATE_DRAW.drawBillboard) {
  //     const locationPoint: GEOPOINT3D_SHORT = {lon: event.pointLatLng[0], lat: event.pointLatLng[1], alt: 0};
  //     const options: OPTIONS_ENTITY = event.object;
  //     if (event.type === 'mouseOver') {
  //       this.removeBillboard();
  //       this.drawBillboard(locationPoint, options);
  //     }
  //
  //   // }
  // };

  public showCursorPosition = (event: EVENT_LISTENER_DATA) => {
    this.applicationService.cursorPosition = {lon: event.pointLatLng[0], lat: event.pointLatLng[1], alt: 0};
  };

  // removeBillboard = () => {
  //   const billboardId = 'temp';
  //   this.mapGeneralService.removeBillboard(billboardId);
  // };
  //
  // drawBillboard = (locationPoint: GEOPOINT3D_SHORT, options: OPTIONS_ENTITY) => {
  //   const billboardId = 'temp';
  //   this.mapGeneralService.createBillboard(locationPoint, billboardId, options);
  // };

}
