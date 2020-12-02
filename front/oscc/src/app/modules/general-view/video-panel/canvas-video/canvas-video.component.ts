import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LiveVideoService} from '../../../../services/liveVideoService/live-video.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../../types';
import {ResizeService} from '../../../../services/ResizeService/resize.service';
// import {JSMpeg} from '@cycjimmy/jsmpeg-player';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.scss']
})
export class CanvasVideoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('streaming', {static: true}) streamingcanvas: ElementRef;
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

    // this.resizeSubscription = this.resizeService.onResize$
    //   .subscribe(size => {
    //     this.width = this.videoDiv.nativeElement.offsetWidth;
    //     this.height = this.videoDiv.nativeElement.offsetHeight;
    //     this.liveVideoService.createCanvas(this.canvasDomID, this.canvasContainerDomID, {width: this.width, height: this.height});
    //   });


    const url = 'ws://192.168.1.15:8082/';
    const canvas = <HTMLCanvasElement>document.getElementById('canvasDomIDvideo'); /*this.streamingcanvas.nativeElement;*/
    console.log(canvas.clientWidth, canvas.clientHeight);

    this.liveVideoService.createCanvas(this.canvasDomID, 'canvasDomIDvideo', this.canvasContainerDomID/*,
      {width: canvas.clientWidth, height: canvas.clientHeight}*/);

    const player = new JSMpeg.Player(url,
      { canvas: canvas, autoplay: true, audio: false, loop: true , disableGl: true}
      );

    // const image = {image: {path: 'http://localhost:6100/api/file/1601798987270.jpg', id: '1'}};
    // this.liveVideoService.createImageMain({success: true, data: player});
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
