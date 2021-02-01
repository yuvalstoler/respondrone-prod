import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LiveVideoService} from '../../../../services/liveVideoService/live-video.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {VIDEO_OR_MAP} from '../../../../../types';
import {ResizeService} from '../../../../services/ResizeService/resize.service';

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.scss']
})
export class CanvasVideoComponent implements OnInit, OnDestroy {

  @Input() url;
  canvasBlobsDomID = 'canvasBlobsDomID';
  canvasContainerDomID = 'canvasContainerDomID';
  canvasVideoDomID = 'canvasVideoDomID';
  VIDEO_OR_MAP = VIDEO_OR_MAP;


  constructor(public liveVideoService: LiveVideoService,
              public resizeService: ResizeService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
     // const mediaContainer = <HTMLCanvasElement>document.getElementById(this.mediaDomID);
     // this.width = mediaContainer.clientWidth;
     // this.height = mediaContainer.clientHeight;

    // const url = 'ws://20.71.141.60:9092/';
    // const canvas = <HTMLCanvasElement>document.getElementById('canvasVideoDomID');
    // console.log(canvas.clientWidth, canvas.clientHeight);


    const canvas = <HTMLCanvasElement>document.getElementById('canvasVideoDomID');
    this.liveVideoService.createCanvas(this.canvasBlobsDomID, this.canvasVideoDomID, this.canvasContainerDomID);
    this.liveVideoService.showVideoWithBlobs(canvas, this.url);
  }

  // showVideoWithBlobs = (canvas) => {
  //   if (this.applicationService.selectedAirVehicle) {
  //     const videoUrl = this.liveVideoService.getVideoUrl(this.url, this.applicationService.selectedAirVehicle.id);
  //     if (videoUrl) {
  //       this.liveVideoService.startDrawingOnCanvas();
  //       const player = new JSMpeg.Player(videoUrl,
  //         { canvas: canvas, autoplay: true, audio: false, loop: true , disableGl: true}
  //       );
  //
  //       const blobsUrl = this.liveVideoService.getBlobUrl(this.url, this.applicationService.selectedAirVehicle.id);
  //       if (blobsUrl) {
  //         this.liveVideoService.startGetBlobs(blobsUrl);
  //       }
  //     }
  //   }
  // };

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
