import {Injectable} from '@angular/core';
import {ASYNC_RESPONSE, VIDEO_DATA} from '../../../../../../classes/typings/all.typings';
import {CanvasClass} from '../tagsService/CanvasClass';
import {MAP} from '../../../types';
import {EventHandler} from '../tagsService/eventHandler';

@Injectable({
  providedIn: 'root'
})
export class LiveVideoService {

  primaryDomID: string = 'primaryCanvasDomID';
  canvases: { [key: number]: CanvasClass } = {};
  image: MAP<any> = {};
  allDataForCanvas: any = undefined;

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

  public createCanvas = (domID: string, containerDomID: string, editingCanvasDomID?: string) => {
    this.canvases[domID].setDomID(domID, containerDomID, editingCanvasDomID, true);

    this.createImageMain(this.videoData, domID);
  };

  public createImageMain = (data: any, domID: string = this.primaryDomID) => {
    if (data) {
      this.buildAllDataObject();
      const imageSize = {width: this.videoData.width, height: this.videoData.height};
      this.canvases[domID].createImageMain(imageSize, this.allDataForCanvas);
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
