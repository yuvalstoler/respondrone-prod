import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../types';
import {GimbalService} from '../../../services/gimbalService/gimbal.service';
import {
  COLOR_PALETTE_INFRARED_CAMERA,
  GIMBAL_ACTION
} from '../../../../../../../classes/typings/all.typings';

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

  constructor(public applicationService: ApplicationService,
              public gimbalService: GimbalService) { }

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

  changeSlide = ($event) => {
    this.isNight = !!$event.checked;
  };

  checkColorPalette = ($event) => {
    if (this.applicationService.selectedAirVehicle) {
      const gimbal = this.gimbalService.gimbalsByDroneId[this.applicationService.selectedAirVehicle.id];

      const gimbalAction: GIMBAL_ACTION = {
        droneId: gimbal.droneId,
        requestorID: 'test',
        parameters: {
          zoomInfraredCamera: gimbal.infraredCameraParameters.zoomInfraredCamera,
          colorPaletteInfraredCamera: $event
        }
      };

      this.gimbalService.sendGimbalAction(gimbalAction);
    }
  };

  onChangeZoom = (zoom) => {
    if (this.applicationService.selectedAirVehicle) {
      const gimbal = this.gimbalService.gimbalsByDroneId[this.applicationService.selectedAirVehicle.id];

      const gimbalAction: GIMBAL_ACTION = {
        droneId: gimbal.droneId,
        requestorID: 'test',
        parameters: undefined
      };

      if (this.isNight) {
        gimbalAction.parameters =  {
          zoomInfraredCamera: zoom,
          colorPaletteInfraredCamera: gimbal.infraredCameraParameters.colorPaletteInfraredCamera
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

  onChangeSpeed = (speed) => {
    console.log(speed);
  };

  onClickDirection = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (this.applicationService.selectedAirVehicle) {
      const gimbal = this.gimbalService.gimbalsByDroneId[this.applicationService.selectedAirVehicle.id];

      const gimbalAction: GIMBAL_ACTION = {
        droneId: gimbal.droneId,
        requestorID: 'test',
        parameters: undefined
      };

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



}
