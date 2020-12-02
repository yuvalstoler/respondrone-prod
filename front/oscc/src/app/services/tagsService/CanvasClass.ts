import {EventHandler} from './eventHandler';
import {BLOB, BLOB_DATA, POINT} from '../../../../../../classes/typings/all.typings';
import {CanvasTools} from './canvasTools';


export class CanvasClass {

  domBlobID: string;
  domVideoID: string;
  containerDomID: string;
  eventHandlerEmitter: EventHandler;
  mouseDownEventHandler: EventHandler;
  isReviewOnly: boolean = false;
  canvasBlob: any;
  canvasVideo: any;
  canvasContainer: any;
  ctx: any;
  ctx2;
  img: any;
  src: string;
  resolution: POINT;
  allDataBlobs: { mark: BLOB_DATA };
  canvasTools: CanvasTools = new CanvasTools();

  constructor(_eventHandlerEmitter?: EventHandler) {
    this.img = new Image;
    if (_eventHandlerEmitter) {
      this.eventHandlerEmitter = _eventHandlerEmitter;
    } else {
      this.isReviewOnly = true;
    }
  }

  public setDomID = (_domID: string, _domVideoID, containerDomID: string, sizeVideoContainer?: { width: number, height: number }, isEventListen?: boolean) => {
    this.domBlobID = _domID;
    this.canvasBlob = <HTMLCanvasElement>document.getElementById(this.domBlobID);
    this.canvasBlob.options = {domID: this.domBlobID};

    this.domVideoID = _domVideoID;
    this.canvasVideo = <HTMLCanvasElement>document.getElementById(this.domVideoID);

    this.containerDomID = containerDomID;
    this.canvasContainer = <HTMLCanvasElement>document.getElementById(this.containerDomID);


    this.ctx = this.canvasBlob.getContext('2d');
    this.ctx2 = this.canvasVideo.getContext('2d');


    // const x = 0;
    // const y = 0;
    // // context2.drawImage( canvas1, x,y );
    // this.ctx2.drawImage( this.canvasBlob, x, y );
    
    this.fillHandler();
    this.canvasContainer.onmousedown = function (e) {
      if (e.button === 1) {
        return false;
      }
    };
    this.canvasContainer.contextmenu = function (e) {
      if (e.button === 1) {
        return false;
      }
    };

    if (isEventListen) {
      this.canvasBlob.addEventListener('contextmenu', this.contextClickHandler);
      // this.canvas.addEventListener('mousewheel', this.onWheel);
      // this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
      // this.canvas.addEventListener('mouseup', this.mouseUpHandler);
    }
  };

  public createImageMain = (imageURL, allData: { mark: BLOB_DATA }, /*sizeVideoContainer: {width: number, height: number}*/) => {
    const factor = 1000;
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

  private setCanvasMeasurements = (width, height) => {
    console.log('canvasVideo: ', width, height, ' canvasBlob: ', this.canvasBlob.clientWidth, this.canvasBlob.clientHeight);
    console.log('canvasContainer: ', this.canvasContainer.width, this.canvasContainer.height);
    console.log('ctx: ', this.ctx.width, this.ctx.height, ' ctx2: ', this.ctx2.width, this.ctx2.height);
    if (this.containerDomID) {

      this.canvasBlob.width = width;
      this.canvasBlob.height = height;
      this.canvasBlob.style.width = width + 'px';
      this.canvasBlob.style.height = height + 'px';

      // this.canvasVideo.width = width;
      // this.canvasVideo.height = height;
      // this.canvasVideo.style.width = width + 'px';
      // this.canvasVideo.style.height = height + 'px';

      // // this.canvasContainer.width = width;
      // // this.canvasContainer.height = height;
      // // this.canvasContainer.style.height = height + 'px';
      // // this.canvasContainer.style.width = width + 'px';
      //
      //
      // this.ctx.width = width;
      // this.ctx.height = height;
      // // this.ctx.style.height = height + 'px';
      // // this.ctx.style.width = width + 'px';
      //
      // this.ctx2.width = width;
      // this.ctx2.height = height;
      // // this.ctx2.style.height = height + 'px';
      // // this.ctx2.style.width = width + 'px';

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

  private drawAllDataOnCanvas = (allData: { mark: BLOB_DATA }, factor: number) => {
    // this.canvasTools.drawImage(this.ctx, this.img);
    this.drawBlobsData(allData, factor);
  };

  private drawBlobsData = (allData: { mark: BLOB_DATA }, factor: number) => {
    if (allData !== undefined /*&&
      Array.isArray(this.resolution) && this.resolution.length > 1 &&
      Number.isFinite(this.resolution[0]) && Number.isFinite(this.resolution[1])*/) {
      this.allDataBlobs = allData;

      //  - draw blobs
      if (allData.hasOwnProperty('mark')) {
        allData.mark.bb.forEach(blob => {
          this.drawBlob(this.ctx, blob, factor);
        });
      }
    }
  };


  public drawBlob = (ctx, blob: BLOB, factor: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.strokeOpacity = 1;
    ctx.lineWidth = 3;

    if (blob.trackBB) {

      const xMin = blob.trackBB.xMin * factor;
      const xMax = blob.trackBB.xMax * factor;
      const yMin = blob.trackBB.yMin * factor;
      const yMax = blob.trackBB.yMax * factor;

      ctx.moveTo(xMin, yMin);
      ctx.lineTo(xMax, yMin);
      ctx.lineTo(xMax, yMax);
      ctx.lineTo(xMin, yMax);
      ctx.lineTo(xMin, yMin);
      ctx.stroke();

      ctx.restore();
    }


  };

  private fillHandler = () => {
    // this.changeDrawingEventHandler = new EventHandler(this.domID, this.changeDrawingStateEventHandlerConfig);
    if (!this.isReviewOnly) {
      this.mouseDownEventHandler = new EventHandler(this.domBlobID, this.mouseDownEventHandlerConfig);
    }
  };

  private contextClickHandler = (e) => {
    if (e.button !== 1) {
      const point = this.canvasTools.getPointFromEvent(this.ctx, e);
      if (!point) {
        return;
      }
      if (this.allDataBlobs &&
        Object.keys(this.allDataBlobs.mark).length > 0 &&
        this.allDataBlobs.mark.constructor === Object) {
        const selectedId = this.canvasTools.findObjectToSelect(this.ctx, point, this.allDataBlobs.mark, this.resolution);
        this.callEventHandler(this.eventHandlerEmitter, 'selectedBlob', selectedId);
      }
    }
  };

  private callEventHandler = (handler: EventHandler, _value: string | number, params?: any) => {
    if (!handler) {
      return;
    }
    const value = _value;
    if (handler.handlers.hasOwnProperty(value)) {
      try {
        handler.handlers[value](params);
      } catch (e) {
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
