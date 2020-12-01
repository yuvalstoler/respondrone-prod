import {EventHandler} from './eventHandler';
import {POINT} from '../../../../../../classes/typings/all.typings';
import {CanvasTools} from './canvasTools';


export class CanvasClass {

  domID: string;
  domVideoID: string;
  containerDomID: string;
  eventHandlerEmitter: EventHandler;
  mouseDownEventHandler: EventHandler;
  isReviewOnly: boolean = false;
  canvas: any;
  canvasVideo: any;
  canvasContainer: any;
  ctx: any;
  ctx2;
  img: any;
  src: string;
  resolution: POINT;
  allDataDetections: {mark: any};
  canvasTools: CanvasTools = new CanvasTools();

  constructor(_eventHandlerEmitter?: EventHandler) {
    this.img = new Image;
    if ( _eventHandlerEmitter ) {
      this.eventHandlerEmitter = _eventHandlerEmitter;
    }
    else {
      this.isReviewOnly = true;
    }
  }

  public setDomID = (_domID: string, _domVideoID, containerDomID: string, sizeVideoContainer?: {width: number, height: number},  isEventListen?: boolean) => {
    this.domID = _domID;
    this.canvas = <HTMLCanvasElement>document.getElementById(this.domID);

    this.domVideoID = _domVideoID;
    this.canvasVideo = <HTMLCanvasElement>document.getElementById(this.domVideoID);

    this.containerDomID = containerDomID;
    this.canvasContainer = <HTMLCanvasElement>document.getElementById(this.containerDomID);
    this.canvas.options = {domID: this.domID};

    console.log(this.canvas.clientWidth, this.canvas.clientHeight);
    // console.log(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
    this.ctx2 = this.canvasVideo.getContext('2d');
    this.ctx = this.canvas.getContext('2d');
    this.fillHandler();
    this.canvasContainer.onmousedown = function (e) {
      if ( e.button === 1 ) {
        return false;
      }
    };

    if ( isEventListen ) {
      this.canvas.addEventListener('mousedown', this.mouseDownHandler);
      // this.canvas.addEventListener('mousewheel', this.onWheel);
      // this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
      // this.canvas.addEventListener('mouseup', this.mouseUpHandler);
    }
  };

  public createImageMain = (imageURL, allData: {mark: any}, /*sizeVideoContainer: {width: number, height: number}*/) => {
    const factor = 1;
    // if (this.containerDomID) {
    //
    //   this.setCanvasMeasurements(sizeVideoContainer.height, sizeVideoContainer.width);
    //   // this.canvas.width = sizeVideoContainer.width;
    //   // this.canvas.height = sizeVideoContainer.height;
    //
    //   // this.resolution = [this.canvas.width, this.canvas.height];
    //
    //   console.log( this.canvasContainer.clientHeight, this.ctx.canvas.height);
    //   console.log(this.canvasContainer.clientWidth,  this.ctx.canvas.width);
    //   const f0 = (this.canvasContainer.clientHeight) / this.ctx.canvas.height;
    //   const f1 = (this.canvasContainer.clientWidth) / this.ctx.canvas.width;
    //
    //
    //   factor = Math.min(f0, f1);
    //
    //   // if ( ((this.canvas.width > this.canvasContainer.clientWidth || this.canvas.height > this.canvasContainer.clientHeight) || factor > 1) &&
    //   //   (this.canvas.width < (6000) || factor < 1) || factor === -1 ) {
    //   //   this.setCanvasMeasurements(this.canvas.height * factor, this.canvas.width * factor);
    //   // }
    //
    //   this.drawAllDataOnCanvas(allData, factor);
    //   console.log(factor);
    //   // };
    // }
    if (this.containerDomID) {
      // this.img.src = imageURL.image.path;
      // this.src = imageURL;
      // this.img.onload = () => {

      // console.log(this.canvas.clientWidth, this.canvas.clientHeight);
        this.setCanvasMeasurements(this.canvasVideo.clientWidth, this.canvasVideo.clientHeight);
        // For Absolute Coordinates !!!
        // this.resolution = /*[1, 1];*/ [this.img.width, this.img.height];
        // this.zoomInForMainImage(-1);
        this.drawAllDataOnCanvas(allData, factor);
      // };
    }
  };

  private setCanvasMeasurements = ( width, height) => {
    console.log(width, height, this.canvas.clientWidth, this.canvas.clientHeight);
    if (this.containerDomID) {

      this.canvas.width = width;
      this.canvas.height = height;

       this.canvasVideo.width = width;
      this.canvasVideo.height = height;

     this.canvasVideo.style.width = this.canvas.style.width = width + 'px';
     this.canvasVideo.style.height = this.canvas.style.height = height + 'px';

      // this.canvas.width = width;
      // this.canvas.height = height;

      // this.canvas.style.height = height + 'px';
      // this.canvas.style.width = width + 'px';

      // this.canvasContainer.width = width;
      // this.canvasContainer.height = height;

      this.ctx.width = width;
      this.ctx.height = height;

      this.ctx2.width = width;
      this.ctx2.height = height;
      // if (this.stage) {
      //   this.stage.setWidth(width);
      //   this.stage.setHeight(height);
      // }
    }
  };

  // public zoomIn = (_factor?: number) => {
  //   if (this.containerDomID) {
  //     let factor = (_factor || 1);
  //     if (!_factor || _factor === 0) {
  //       _factor = 1;
  //     }
  //     if (_factor === -1) {
  //       const f0 = (this.canvasContainer.clientHeight - 10) / this.ctx.canvas.height;
  //       const f1 = (this.canvasContainer.clientWidth - 10) / this.ctx.canvas.width;
  //       factor = Math.min(f0, f1);
  //     }
  //
  //     if (((this.canvas.width > this.canvasContainer.clientWidth || this.canvas.height > this.canvasContainer.clientHeight) || factor > 1) &&
  //       (this.canvas.width < (6000) || factor < 1) || _factor === -1) {
  //       this.setCanvasMeasurements(this.canvas.height * factor, this.canvas.width * factor);
  //       // this.callDrawFunction(true);
  //     }
  //   }
  // };

  private drawAllDataOnCanvas = (allData: {mark: any}, factor: number) => {
    // this.canvasTools.drawImage(this.ctx, this.img);
    this.drawBlobsData(allData, factor);
  };

  private drawBlobsData = (allData: {mark: any}, factor: number) => {
    if (allData !== undefined /*&&
      Array.isArray(this.resolution) && this.resolution.length > 1 &&
      Number.isFinite(this.resolution[0]) && Number.isFinite(this.resolution[1])*/) {
      this.allDataDetections = allData;

      //  - draw blobs
      if (allData.hasOwnProperty('mark')) {
        allData.mark.blobs.forEach(blob => {
          this.drawBlob(this.ctx, blob, factor);
        });
      }
    }
  };

  public drawBlob = (ctx, blob: { id, xMin: number, yMin: number, xMax: number, yMax: number }, factor: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.strokeOpacity = 1;
    ctx.lineWidth = 3;

    const xMin = blob.xMin * factor;
    const xMax = blob.xMax * factor;
    const yMin = blob.yMin * factor;
    const yMax = blob.yMax * factor;

    ctx.moveTo(xMin, yMin);
    ctx.lineTo(xMax, yMin);
    ctx.lineTo(xMax, yMax);
    ctx.lineTo(xMin, yMax);
    ctx.lineTo(xMin, yMin);
    ctx.stroke();

    ctx.restore();

  };

  private fillHandler = () => {
    // this.changeDrawingEventHandler = new EventHandler(this.domID, this.changeDrawingStateEventHandlerConfig);
    if ( !this.isReviewOnly ) {
      this.mouseDownEventHandler = new EventHandler(this.domID, this.mouseDownEventHandlerConfig);
    }
  };

  private mouseDownHandler = (e) => {
    if ( e.button !== 1 ) {
      const point = this.canvasTools.getPointFromEvent(this.ctx, e);
      if ( !point ) {
        return;
      }
       if ( this.allDataDetections &&
        Object.keys(this.allDataDetections.mark).length > 0 &&
        this.allDataDetections.mark.constructor === Object ) {
        const selectedId = this.canvasTools.findObjectToSelect(this.ctx, point, this.allDataDetections.mark, this.resolution);
        this.callEventHandler(this.eventHandlerEmitter, 'selectedBlob', selectedId);
      }
    }
  };

  private callEventHandler = (handler: EventHandler, _value: string | number, params?: any) => {
    if ( !handler ) {
      return;
    }
    const value = _value;
    if ( handler.handlers.hasOwnProperty(value) ) {
      try {
        handler.handlers[value](params);
      }
      catch (e) {
      }
    }
  };

  // private mouseDblclickHandler = (e) => {
  //   if ( this._drawingState === 'polygon' || this._drawingState === 'rectangle' || this._drawingState === 'point' ) {
  //     this.callEventHandler(this.changeDrawingEventHandler, this._drawingState);
  //
  //     this.callDrawFunction(true);
  //   }
  // };
  //
  // private mouseClick = (e) => {
  //
  //   if ( this._drawingState === 'edit' && !this.currentEntityID ) {
  //     //
  //     const point = this.canvasTools.getPointFromEvent(this.ctx, e);
  //     if ( this.selectedForEdit.entityID ) {
  //       this.currentEntityID = this.selectedForEdit.entityID;
  //     }
  //     else {
  //       this.selectedForEdit = {entityID: undefined, serviceRectangle: undefined};
  //     }
  //     this.callDrawFunction(true);
  //   }
  //   else {
  //     console.log(e);
  //   }
  // };
  //
  mouseDownEventHandlerConfig = {
    // 'point': this.editPoint,
  };

  // mouseEventHandler = {
  //   'click': this.mouseClick,
  //   'dblclick': this.mouseDblclickHandler,
  // };
}
