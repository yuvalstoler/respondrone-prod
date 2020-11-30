import {Component, OnDestroy, OnInit} from '@angular/core';
import {LiveVideoService} from '../../../../services/liveVideoService/live-video.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../../types';
import {ResizeService} from '../../../../services/ResizeService/resize.service';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.scss']
})
export class CanvasVideoComponent implements OnInit, OnDestroy {
  canvasDomID = 'canvasDomID';
  canvasContainerDomID = 'canvasContainerDomID';
  VIDEO_OR_MAP = VIDEO_OR_MAP;

  constructor(public liveVideoService: LiveVideoService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
    // this.resizeVideoSize$.subscribe((size) => {
    //   this.liveVideoService.createCanvas(this.canvasDomID, this.canvasContainerDomID);
    // });
    this.liveVideoService.createCanvas(this.canvasDomID, this.canvasContainerDomID);
  }

  resizeVideoWindow = ($event) => {
    this.liveVideoService.resizeVideoSize$.next({width: $event.target.clientWidth, height: $event.target.clientHeight});
  };

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
  };

  ngOnDestroy() {

  }

}
