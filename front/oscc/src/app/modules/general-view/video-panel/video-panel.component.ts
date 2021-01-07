import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../types';
import {GimbalService} from '../../../services/gimbalService/gimbal.service';
import {
  AV_DATA_UI,
  COLOR_PALETTE_INFRARED_CAMERA,
  GIMBAL_ACTION_OSCC, GIMBAL_CONTROL_ACTION, GIMBAL_CONTROL_REQUEST_OSCC, GIMBAL_CONTROL_USER,
  GIMBAL_DATA_UI, GIMBAL_REQUEST_STATUS,
  VIDEO_URL_KEY
} from '../../../../../../../classes/typings/all.typings';
import {LoginService} from "../../../services/login/login.service";

@Component({
  selector: 'app-video-panel',
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.scss']
})
export class VideoPanelComponent implements OnInit {

  VIDEO_OR_MAP = VIDEO_OR_MAP;
  colorPalette =  Object.values(COLOR_PALETTE_INFRARED_CAMERA);
  isNight = false;

  //zoom
  zoomModel = 0;
  tickIntervalZoom: number = 1;
  stepZoom: number = 0.1;
  minZoom: number = 0;
  maxZoom: number = 10;

  //speed
  speedModel = 10;
  tickIntervalSpeed: number = 1;
  minSpeed: number = 0;
  maxSpeed: number = 20;

  videoUrlKey: VIDEO_URL_KEY;

  GIMBAL_CONTROL_USER = GIMBAL_CONTROL_USER;
  GIMBAL_CONTROL_ACTION = GIMBAL_CONTROL_ACTION;
  GIMBAL_REQUEST_STATUS = GIMBAL_REQUEST_STATUS;

  constructor(public applicationService: ApplicationService,
              public gimbalService: GimbalService,
              private loginService: LoginService) {
    this.videoUrlKey = this.isNight ? VIDEO_URL_KEY.infraredVideoURL : VIDEO_URL_KEY.opticalVideoURL;
  }

  ngOnInit(): void {
  }

  formatLabel = (value: number) => {
    if (value > 0) {
      return value + 'x';
    }
    return value;
  };

  onExpendVideo = () => {
    if ( this.applicationService.selectedWindow === VIDEO_OR_MAP.map) {
      this.applicationService.selectedWindow = VIDEO_OR_MAP.video;

    } else {
      this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
    }
  };

  getDefaultGimbalAction = (): GIMBAL_ACTION_OSCC => {
    return {
      droneId: this.gimbal ? this.gimbal.droneId : undefined,
      videoUrlKey: this.videoUrlKey,
      userId: GIMBAL_CONTROL_USER.OSCC,
      parameters: undefined
    };
  }

  changeSlide = ($event) => {
    this.isNight = !!$event.checked;
    this.videoUrlKey = this.isNight ? VIDEO_URL_KEY.infraredVideoURL : VIDEO_URL_KEY.opticalVideoURL;
  };

  checkColorPalette = ($event) => {
    if (this.gimbal) {

      const gimbalAction: GIMBAL_ACTION_OSCC = this.getDefaultGimbalAction();
      gimbalAction.parameters = {
        zoomInfraredCamera: this.gimbal.infraredCameraParameters.zoomInfraredCamera,
        colorPaletteInfraredCamera: $event
      };

      this.gimbalService.sendGimbalAction(gimbalAction);
    }
  };

  onChangeZoom = (zoom) => {
    if (this.gimbal) {
      const gimbalAction: GIMBAL_ACTION_OSCC = this.getDefaultGimbalAction();

      if (this.isNight) {
        gimbalAction.parameters =  {
          zoomInfraredCamera: zoom,
          colorPaletteInfraredCamera: this.gimbal.infraredCameraParameters.colorPaletteInfraredCamera
        };
      }
      else {
        gimbalAction.parameters =  {
          zoomVisibleCamera: zoom,
        };
      }
      this.gimbalService.sendGimbalAction(gimbalAction);
    }
  };

  // onChangeSpeed = (speed) => {
  //   console.log(speed);
  // };

  onClickDirection = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (this.gimbal) {
      const gimbalAction: GIMBAL_ACTION_OSCC = this.getDefaultGimbalAction();

      switch (direction) {
        case 'left':
          gimbalAction.parameters = {
            pitch: 0,
            yaw: -this.speedModel
          };
          break;
        case 'right':
          gimbalAction.parameters = {
            pitch: 0,
            yaw: this.speedModel
          };
          break;
        case 'up':
          gimbalAction.parameters = {
            pitch: -this.speedModel,
            yaw: 0
          };
          break;
        case 'down':
          gimbalAction.parameters = {
            pitch: this.speedModel,
            yaw: 0
          };
          break;
      }

      this.gimbalService.sendGimbalAction(gimbalAction);
    }
  };

  onControlAction(controlAction: GIMBAL_CONTROL_ACTION) {
    if (this.applicationService.selectedAirVehicle) {
      const gimbalControlRequest: GIMBAL_CONTROL_REQUEST_OSCC = {
        userId: this.loginService.getUserId(),
        userName: this.loginService.getUserName(),
        action: controlAction,
        airVehicleId: this.applicationService.selectedAirVehicle.id,
        videoUrlKey: this.videoUrlKey
      };
      this.gimbalService.sendGimbalControlRequest(gimbalControlRequest);
    }
  }

  get gimbal () {
    return this.applicationService.selectedAirVehicle ?
      this.gimbalService.getGimbalByDroneId(this.applicationService.selectedAirVehicle.id) : undefined;
  }

}
