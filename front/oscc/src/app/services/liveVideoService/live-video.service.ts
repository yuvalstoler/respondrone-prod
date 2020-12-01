import {Injectable} from '@angular/core';
import {
  ASYNC_RESPONSE,
  AV_DATA_UI,
  MISSION_MODEL_UI,
  MISSION_TYPE,
  VIDEO_DATA
} from '../../../../../../classes/typings/all.typings';
import {CanvasClass} from '../tagsService/CanvasClass';
import {HEADER_BUTTONS, MAP} from '../../../types';
import {EventHandler} from '../tagsService/eventHandler';
import {BehaviorSubject} from 'rxjs';
import {MissionDialogComponent} from '../../dialogs/mission-dialog/mission-dialog.component';
import {ApplicationService} from '../applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {MissionRequestService} from '../missionRequestService/missionRequest.service';

@Injectable({
  providedIn: 'root'
})
export class LiveVideoService {

  primaryDomID: string = 'canvasDomID';
  canvases: { [key: number]: CanvasClass } = {};
  image: MAP<any> = {};
  allDataForCanvas: { mark: any } = undefined;
  resizeVideoSize$: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject<{ width: number, height: number }>(undefined);

  videoData: VIDEO_DATA = {
    // id: 1,
    width: 1598,
    height: 899,
    blobs: [
      {
        id: 1,
        xMin: 0,
        yMin: 0,
        xMax: 300,
        yMax: 300,
      },
      {
        id: 2,
        xMin: 500,
        yMin: 500,
        xMax: 600,
        yMax: 600,
      },
      {
        id: 3,
        xMin: 200,
        yMin: 200,
        xMax: 700,
        yMax: 800,
      }
    ]
  };

  constructor(public applicationService: ApplicationService,
              public dialog: MatDialog,
              public missionRequestService: MissionRequestService) {
    const primaryEventHandler = new EventHandler(this.primaryDomID, this.mouseEventHandler);
    this.canvases[this.primaryDomID] = new CanvasClass(primaryEventHandler);
    setInterval(() => {
      this.createImageMain({success: true, data: {}});
    }, 1000);
  }

  public createCanvas = (domID: string, domVideoID: string, containerDomID: string, videoSize?: { width: number, height: number }) => {
    this.canvases[domID].setDomID(domID, domVideoID, containerDomID, videoSize, true);
  };

  public createImageMain = (data: ASYNC_RESPONSE<any>, domID: string = this.primaryDomID) => {
    if (data.success) {
      // const key = this.applicationService.selectedTrackId.sensorId;
      // if (key) {
      //   this.image[key] = this.image[key] || {};
      //   this.image[key] = data.data;
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

  public onSelectBlob = (id: string) => {
    console.log('selected blob id = ', id);
    if (id) {
      const airVehicle = this.applicationService.selectedAirVehicle;
      this.onMissionOptions(MISSION_TYPE.Servoing, airVehicle, id);
      // this.tracksListService.fillDetectionsDataForCanvas();
      // this.applicationService.newDataForMainImage$.next(true);
    }
  };

  onMissionOptions = (missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, idBlob) => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
    // open panel
    this.applicationService.screen.showLeftPanel = true;
    this.applicationService.screen.showMissionControl = true;
    // choose missionTab on MissionControl
    this.applicationService.currentTabIndex = 1; /*(0 = TaskTab, 1 = MissionTab)*/
    //close others
    this.applicationService.screen.showSituationPicture = false;
    this.applicationService.screen.showVideo = false;

    this.openPanel('Create new mission request', MISSION_TYPE.Servoing, airVehicle, idBlob);
  };

  private openPanel = (title: string, missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, idBlob) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title, missionType: missionType, airVehicle: airVehicle, idBlob: idBlob}
    });
    this.applicationService.isDialogOpen = true;

    dialogRef.afterClosed().subscribe((missionModel: MISSION_MODEL_UI) => {
      if (missionModel) {
        this.missionRequestService.createServoingMission(missionModel);
      }
    });
  };


  mouseEventHandler = {
    'selectedBlob': this.onSelectBlob
  };
}
