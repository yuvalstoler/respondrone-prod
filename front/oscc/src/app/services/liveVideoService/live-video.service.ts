import {Injectable} from '@angular/core';
import {VIDEO_DATA} from '../../../../../../classes/typings/all.typings';
import {CanvasClass} from '../tagsService/CanvasClass';
import {MAP} from '../../../types';
import {EventHandler} from '../tagsService/eventHandler';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveVideoService {

  primaryDomID: string = 'canvasDomID';
  canvases: { [key: number]: CanvasClass } = {};
  image: MAP<any> = {};
  allDataForCanvas: any = undefined;
  resizeVideoSize$: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject<{ width: number, height: number }>(undefined);

  videoSource = {video: 'http://localhost:6101/api/file/catVideo1.mov'};
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

  constructor() {
    const primaryEventHandler = new EventHandler(this.primaryDomID, this.mouseEventHandler);
    this.canvases[this.primaryDomID] = new CanvasClass(primaryEventHandler);
  }

  public createCanvas = (domID: string, containerDomID: string, videoSize?) => {
    this.canvases[domID].setDomID(domID, containerDomID, true);
    this.getVideoData(videoSize);
  };

  getVideoData = (videoSize: {width: number, height: number}) => {
    this.createImageMain(this.videoData, videoSize);
  };

  public createImageMain = (data: any, videoSize: {width: number, height: number}, domID: string = this.primaryDomID) => {
    if (data) {
      this.buildAllDataObject();
      this.canvases[domID].createImageMain(videoSize, this.allDataForCanvas);
    }
  };

  private buildAllDataObject = () => {
    this.allDataForCanvas = {
      mark: this.videoData
    };
  };


  mouseEventHandler = {
    // 'selectedDetection': this.onSelectDetection
  };
}
