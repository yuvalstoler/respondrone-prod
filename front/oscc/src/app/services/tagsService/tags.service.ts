import {Injectable} from '@angular/core';
import {CanvasClass} from './CanvasClass';
import {EventHandler} from './eventHandler';
import {MAP} from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  primaryDomID = 'primaryCanvasDomID';
  canvases: { [key: number]: CanvasClass } = {};
  image: MAP<any> = {};

  constructor() {
    const primaryEventHandler = new EventHandler(this.primaryDomID, this.mouseEventHandler);
    this.canvases[this.primaryDomID] = new CanvasClass(primaryEventHandler);
  }

  // public createCanvas = (domID: string, containerDomID: string, editingCanvasDomID?: string) => {
  //   this.canvases[domID].setDomID(domID, containerDomID, editingCanvasDomID, true);
  // };


  mouseEventHandler = {
    // 'tagRequest': this.noTagSelected,
    // 'dblclick': this.onStopDrawingFunction,
    // 'click': this.onStopDrawingFunction,
    // 'selectEntity': this.onSelectEntity,
    // 'removePointOnLeaflet': this.removePointOnLeaflet
  };
}
