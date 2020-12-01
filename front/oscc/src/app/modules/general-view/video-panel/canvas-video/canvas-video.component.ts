import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class CanvasVideoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoContainerDomID', { static: false }) videoDiv: ElementRef;
  canvasDomID = 'canvasDomID';
  canvasContainerDomID = 'canvasContainerDomID';
  VIDEO_OR_MAP = VIDEO_OR_MAP;
  // private resizeSubscription: Subscription;
  // width;
  // height;


  constructor(public liveVideoService: LiveVideoService,
              public resizeService: ResizeService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
     // const mediaContainer = <HTMLCanvasElement>document.getElementById(this.mediaDomID);
     // this.width = mediaContainer.clientWidth;
     // this.height = mediaContainer.clientHeight;

    this.liveVideoService.createCanvas(this.canvasDomID, this.canvasContainerDomID,
      /*{width: this.width, height: this.height}*/);

    // this.resizeSubscription = this.resizeService.onResize$
    //   .subscribe(size => {
    //     this.width = this.videoDiv.nativeElement.offsetWidth;
    //     this.height = this.videoDiv.nativeElement.offsetHeight;
    //     this.liveVideoService.createCanvas(this.canvasDomID, this.canvasContainerDomID, {width: this.width, height: this.height});
    //   });
    const image = {image: {path: 'http://localhost:6100/api/file/1601798987270.jpg', id: '1'}};
    this.liveVideoService.createImageMain({success: true, data: image});

  }

  ngAfterViewInit(): void {
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
  };

  ngOnDestroy() {
    // if (this.resizeSubscription) {
    //   this.resizeSubscription.unsubscribe();
    // }
  }


}
