import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../types';
import {GimbalService} from '../../../services/gimbalService/gimbal.service';
import {COLOR_PALETTE_INFRARED_CAMERA} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-video-panel',
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.scss']
})
export class VideoPanelComponent implements OnInit {

  VIDEO_OR_MAP = VIDEO_OR_MAP;
  colorPalette =  Object.values(COLOR_PALETTE_INFRARED_CAMERA);

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
    if ($event.checked) {
    //   night
    //   todo : open select color
    } else {
    // day
    }
  };

  onClickLeft() {

  }
  onClickRight() {

  }
  onClickDown() {

  }
  onClickUp() {

  }


}
