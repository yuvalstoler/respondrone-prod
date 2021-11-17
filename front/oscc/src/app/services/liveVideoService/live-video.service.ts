import {Injectable} from '@angular/core';
import {
  ASYNC_RESPONSE,
  AV_DATA_UI, BLOB_DATA,
  MISSION_TYPE, POINT, VIDEO_URLS_DATA
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

  videoData: BLOB_DATA/* = {
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
  }*/;
  interval;

  websocket = null;
  videoUrls: VIDEO_URLS_DATA = {
    '1': {
      'ws://iai-video-restream.simplex-c2.com:18082': {
        videoJSMPEG: 'ws://iai-video-restream.simplex-c2.com:18082',
        blobsSocket: 'ws://localhost:4002/'
      },
      'ws://iai-video-restream.simplex-c2.com:18084': {
        videoJSMPEG: 'ws://iai-video-restream.simplex-c2.com:18084',
        blobsSocket: 'ws://localhost:4002/'
      }
    },
    '2': {
      'ws://iai-video-restream.simplex-c2.com:18082': {
        videoJSMPEG: 'ws://iai-video-restream.simplex-c2.com:18082',
        blobsSocket: 'ws://localhost:4002/'
      },
      'ws://iai-video-restream.simplex-c2.com:18084': {
        videoJSMPEG: 'ws://iai-video-restream.simplex-c2.com:18084',
        blobsSocket: 'ws://localhost:4002/'
      }
    }
  };
  player;
  canvas;

  constructor(public applicationService: ApplicationService,
              public dialog: MatDialog,
              private socketService: SocketService,
              public contextMenuService: ContextMenuService,
              public missionRequestService: MissionRequestService) {
    const primaryEventHandler = new EventHandler(this.primaryDomID, this.mouseEventHandler);
    this.canvases[this.primaryDomID] = new CanvasClass(primaryEventHandler);

    this.socketService.connectToRoom('webServer_getVideoUrls').subscribe(this.onGetVideoUrls);
  }

  showVideoWithBlobs = (canvas, url) => {
      if (this.applicationService.selectedAirVehicle) {
        const videoUrl = this.getVideoUrl(url, this.applicationService.selectedAirVehicle.id);
        if (videoUrl) {
          this.startDrawingOnCanvas();
          this.canvas = canvas;
          this.player = new JSMpeg.Player(videoUrl,
            { canvas: canvas, autoplay: true, audio: false, loop: true , disableGl: true}
          );

          const blobsUrl = this.getBlobUrl(url, this.applicationService.selectedAirVehicle.id);
          if (blobsUrl) {
            this.startGetBlobs(blobsUrl);
          }
        }
      }
  };

  restartPlayer = (url) => {
    this.stopPlayer();
    const videoUrl = this.getVideoUrl(url, this.applicationService.selectedAirVehicle.id);
    if (videoUrl) {
      this.player = new JSMpeg.Player(videoUrl,
        { canvas: this.canvas, autoplay: true, audio: false, loop: true , disableGl: true}
      );

      const blobsUrl = this.getBlobUrl(url, this.applicationService.selectedAirVehicle.id);
      if (blobsUrl) {
        this.startGetBlobs(blobsUrl);
      }
    }
  }

  stopPlayer = () => {
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
  }

  startDrawingOnCanvas = () => {
    this.interval = setInterval(() => {
      this.createImageMain({success: true, data: this.videoData});
    }, 1000);
  };

  stopDrawingOnCanvas = () => {
    clearInterval(this.interval);
    this.interval = undefined;
  };

  startGetBlobs = (wsUrl: string) => {
    this.connectToWS(wsUrl);
  };

  stopGetBlobs = () => {
    if (this.websocket) {
      this.websocket.close();
    }
  };

  connectToWS = (wsUrl: string) => {
    if (this.websocket !== null) {
      this.websocket.close();
    }

    this.websocket = new WebSocket(wsUrl);
    this.websocket.onopen = () => {
      console.log('Connection opened!');
    };
    this.websocket.onmessage = ({ data }) => this.showMessage(data);
    this.websocket.onclose = () => {
      this.websocket = null;

      // setTimeout(() => {
      //   this.connectToWS(wsUrl);
      // }, 1000);
    };
  };


  private onGetVideoUrls = (data: VIDEO_URLS_DATA) => {
    if (data) {
      this.videoUrls = data;
    }
  };

  public getVideoUrl = (url: string, airVehicleId) => {
    if (this.videoUrls[airVehicleId] && this.videoUrls[airVehicleId][url]) {
      return this.videoUrls[airVehicleId][url].videoJSMPEG;
    }
    return undefined;
  };

  public getBlobUrl = (url: string, airVehicleId) => {
    if (this.videoUrls[airVehicleId] && this.videoUrls[airVehicleId][url]) {
      return this.videoUrls[airVehicleId][url].blobsSocket;
    }
    return undefined;
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
    if (options.selectedId !== undefined) {
      const airVehicle = this.applicationService.selectedAirVehicle;
      if (airVehicle.modeDefine.data.missionOptions.hasOwnProperty(MISSION_TYPE.Servoing) &&
        airVehicle.modeDefine.data.missionOptions[MISSION_TYPE.Servoing] === true) {
        this.onMissionOptions(MISSION_TYPE.Servoing, airVehicle, options);
        // this.tracksListService.fillDetectionsDataForCanvas();
        // this.applicationService.newDataForMainImage$.next(true);
      }
    }
    else {
      this.onUnselectBlob({});
    }
  };

  public onUnselectBlob = (data) => {
    this.contextMenuService.isOpenBlob = false;
    this.contextMenuService.selectedBlob = undefined;
  };

  onMissionOptions = (missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, options: {selectedId: number, point: POINT}) => {
    // Todo: add context menu and click on menu open =>
    this.contextMenuService.isOpenBlob = true;
    this.contextMenuService.singleTooltip.top = options.point[1] + 10 + 'px';
    this.contextMenuService.singleTooltip.left = options.point[0] + 15 + 'px';
    this.contextMenuService.selectedBlob = {missionType, airVehicle, options};
  };

  mouseEventHandler = {
    'selectedBlob': this.onSelectBlob,
    'unselectBlob': this.onUnselectBlob
  };
}
