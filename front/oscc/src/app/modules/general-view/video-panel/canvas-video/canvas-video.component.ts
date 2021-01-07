import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

  @Input() url;
  // @ViewChild('streaming', {static: true}) streamingcanvas: ElementRef;
  canvasBlobsDomID = 'canvasBlobsDomID';
  canvasContainerDomID = 'canvasContainerDomID';
  canvasVideoDomID = 'canvasVideoDomID';
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

    if (this.applicationService.selectedAirVehicle) {
      const videoUrl = this.liveVideoService.getVideoUrl(this.url, this.applicationService.selectedAirVehicle.id);
      if (videoUrl) {
        this.liveVideoService.startDrawingOnCanvas();

        // const url = 'ws://20.71.141.60:9092/';
        const canvas = <HTMLCanvasElement>document.getElementById('canvasVideoDomID'); /*this.streamingcanvas.nativeElement;*/
        // console.log(canvas.clientWidth, canvas.clientHeight);

        const player = new JSMpeg.Player(videoUrl,
          { canvas: canvas, autoplay: true, audio: false, loop: true , disableGl: true}
        );

        this.liveVideoService.createCanvas(this.canvasBlobsDomID, this.canvasVideoDomID, this.canvasContainerDomID);

        const blobsUrl = this.liveVideoService.getBlobUrl(this.url, this.applicationService.selectedAirVehicle.id);
        if (blobsUrl) {
          this.liveVideoService.startGetBlobs(blobsUrl);
          // const image = {image: {path: 'http://localhost:6100/api/file/1601798987270.jpg', id: '1'}};
          // this.liveVideoService.createImageMain({success: true, data: player});
        }
      }
    }
  }

  ngAfterViewInit(): void {
  }

  getStyle = () => {
    let style;
    // if (!this.applicationService.screen.showLeftPanel && this.applicationService.screen.showVideo
    //   && this.applicationService.selectedWindow === VIDEO_OR_MAP.video) {
    //   style = {'width': 'auto', 'height': 500};
    // } else if (!this.applicationService.screen.showLeftPanel && this.applicationService.screen.showVideo
    //   && this.applicationService.selectedWindow === VIDEO_OR_MAP.map) {
    //   style = {'width': this.liveVideoService.videoData.width, 'height': this.liveVideoService.videoData.height};
    // }

    return style;
  };

  ngOnDestroy() {
    // if (this.resizeSubscription) {
    //   this.resizeSubscription.unsubscribe();
    // }
    this.liveVideoService.stopGetBlobs();
    this.liveVideoService.stopDrawingOnCanvas();
  }


}
