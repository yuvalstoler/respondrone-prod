import { Component, OnInit } from '@angular/core';
import {LiveVideoService} from '../../../../services/liveVideoService/live-video.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../../types';

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.scss']
})
export class CanvasVideoComponent implements OnInit {
  primaryCanvasDomID = 'primaryCanvasDomID';
  primaryCanvasContainerDomID = 'primaryCanvasContainerDomID';
  VIDEO_OR_MAP = VIDEO_OR_MAP;

  constructor(public liveVideoService: LiveVideoService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.liveVideoService.createCanvas(this.primaryCanvasDomID, this.primaryCanvasContainerDomID);
  }

  getStyle = () => {
    let style;
    if (!this.applicationService.screen.showLeftPanel && this.applicationService.screen.showVideo
      && this.applicationService.selectedWindow === VIDEO_OR_MAP.video) {
      style = {'width': 'auto', 'height': 100 + '%'};
    } else if (!this.applicationService.screen.showLeftPanel && this.applicationService.screen.showVideo
      && this.applicationService.selectedWindow === VIDEO_OR_MAP.map) {
      style = {'width': this.liveVideoService.videoData.width, 'height': this.liveVideoService.videoData.height};
    }

    return style;
  }

}
