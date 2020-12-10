import {Injectable} from '@angular/core';
import {
  ASYNC_RESPONSE,
  AV_DATA_UI, BLOB_DATA,
  MISSION_TYPE, POINT
} from '../../../../../../classes/typings/all.typings';
import {CanvasClass} from '../tagsService/CanvasClass';
import {MAP} from '../../../types';
import {EventHandler} from '../tagsService/eventHandler';
import {BehaviorSubject} from 'rxjs';
import {ApplicationService} from '../applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {MissionRequestService} from '../missionRequestService/missionRequest.service';
import {SocketService} from '../socketService/socket.service';
import {ContextMenuService} from '../contextMenuService/context-menu.service';

@Injectable({
  providedIn: 'root'
})
export class LiveVideoService {

  primaryDomID: string = 'canvasBlobsDomID';
  canvases: { [key: number]: CanvasClass } = {};
  image: MAP<any> = {};
  allDataForCanvas: { mark: BLOB_DATA } = undefined;
  resizeVideoSize$: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject<{ width: number, height: number }>(undefined);

  videoData: BLOB_DATA = {
    // id: 1,
    width: 1598,
    height: 899,
    droneGPS: { lat: 32, lon: 34, alt: 100 },
    unixtimestamp: '111',
    time: '111',
    bb: [
      {
        trackId: '1',
        trackBB: {
          xMin: 0,
          xMax: 0.2,
          yMin: 0,
          yMax: 0.2
        }
      },
      {
        trackId: '2',
        trackBB: {
          xMin: 0.3,
          xMax: 0.5,
          yMin: 0.3,
          yMax: 0.5
        }
      },
      {
        trackId: '3',
        trackBB: {
          xMin: 0.9,
          xMax: 1,
          yMin: 0.9,
          yMax: 1
        }
      }
    ]
  };

  constructor(public applicationService: ApplicationService,
              public dialog: MatDialog,
              private socketService: SocketService,
              public contextMenuService: ContextMenuService,
              public missionRequestService: MissionRequestService) {
    const primaryEventHandler = new EventHandler(this.primaryDomID, this.mouseEventHandler);
    this.canvases[this.primaryDomID] = new CanvasClass(primaryEventHandler);
    setInterval(() => {
      this.createImageMain({success: true, data: this.videoData});
    }, 1000);


    // this.startGetBlobs();
  }

  startGetBlobs = () => {
    const url = 'ws://20.71.141.60:4000/';
    let ws = new WebSocket(url);
    ws.onopen = () => {
      console.log('Connection opened!');
    };
    ws.onmessage = ({ data }) => this.showMessage(data);
    ws.onclose = () => {
      ws = null;
      setTimeout(() => {
        this.startGetBlobs();
      }, 1000);
    };
  };

  private showMessage(message) {
    this.videoData = (JSON.parse(message));
  }


  public createCanvas = (domID: string, domVideoID: string, containerDomID: string) => {
    this.canvases[domID].setDomID(domID, domVideoID, containerDomID, true);
  };

  public createImageMain = (data: ASYNC_RESPONSE<any>, domID: string = this.primaryDomID) => {
    if (data.success) {
      this.image = data.data;
      this.buildAllDataObject();
      this.canvases[domID].createImageMain(this.image, this.allDataForCanvas);
    }
    // }
  };

  private buildAllDataObject = () => {
    this.allDataForCanvas = {
      mark: this.videoData
    };
  };

  public onSelectBlob = (options: {selectedId: number, point: POINT}) => {
    console.log('selected blob id = ', options.selectedId);
    if (options.selectedId) {
      const airVehicle = this.applicationService.selectedAirVehicle;
      if (airVehicle.modeDefine.data.missionOptions.hasOwnProperty(MISSION_TYPE.Servoing) &&
        airVehicle.modeDefine.data.missionOptions[MISSION_TYPE.Servoing] === true) {
        this.onMissionOptions(MISSION_TYPE.Servoing, airVehicle, options);
        // this.tracksListService.fillDetectionsDataForCanvas();
        // this.applicationService.newDataForMainImage$.next(true);
      }
    }
  };

  onMissionOptions = (missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, options: {selectedId: number, point: POINT}) => {
    // Todo: add context menu and click on menu open =>
    this.contextMenuService.isOpenBlob = true;
    this.contextMenuService.singleTooltip.top = options.point[1] + 40 + 'px';
    this.contextMenuService.singleTooltip.left = options.point[0] + 85 + 'px';
    this.contextMenuService.selectedBlob = {missionType, airVehicle, options};
  };

  mouseEventHandler = {
    'selectedBlob': this.onSelectBlob
  };
}