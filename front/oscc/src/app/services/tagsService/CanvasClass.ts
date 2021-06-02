import {EventHandler} from './eventHandler';
import {BLOB, BLOB_DATA, SIZE} from '../../../../../../classes/typings/all.typings';
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
  ctxBlob: any;
  ctxVideo;
  img: any;
  src: string;
  resolution: SIZE;
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

  public setDomID = (_domBlobID: string, _domVideoID, containerDomID: string, isEventListen?: boolean) => {
    this.containerDomID = containerDomID;
    this.canvasContainer = <HTMLCanvasElement>document.getElementById(this.containerDomID);

    this.domBlobID = _domBlobID;
    this.canvasBlob = <HTMLCanvasElement>document.getElementById(this.domBlobID);
    this.canvasBlob.options = {domID: this.domBlobID};

    this.domVideoID = _domVideoID;
    this.canvasVideo = <HTMLCanvasElement>document.getElementById(this.domVideoID);

    this.ctxBlob = this.canvasBlob.getContext('2d');
    this.ctxVideo = this.canvasVideo.getContext('2d');

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
      this.canvasBlob.addEventListener('mouseup', this.mouseUpHandler);
      // this.canvas.addEventListener('mousewheel', this.onWheel);
      // this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
      // this.canvas.addEventListener('mouseup', this.mouseUpHandler);
    }
  };

  public createImageMain = (imageData, allData: { mark: BLOB_DATA }) => {
    if (this.containerDomID) {
      // const ratio = imageData.width / imageData.height;
      const ratio = this.canvasContainer.offsetWidth / this.canvasContainer.offsetHeight;
      this.setCanvasMeasurements(this.canvasContainer.offsetWidth, this.canvasContainer.offsetHeight, ratio);
      this.drawAllDataOnCanvas(allData, this.resolution);
    }
  };

  private setCanvasMeasurements = (width, height, ratio: number) => {
    // console.log('-------------------------------------------');
    // console.log('canvasContainerOffset: ', width, height);
    // console.log('canvasVideoClient: ', this.canvasVideo.clientWidth, this.canvasVideo.clientHeight, ' canvasBlob: ', this.canvasBlob.clientWidth, this.canvasBlob.clientHeight);
    // console.log('canvasVideoWidthHeight: ', this.canvasVideo.width, this.canvasVideo.height, ' canvasBlob: ', this.canvasBlob.width, this.canvasBlob.height);
    // console.log('canvasVideoOffset: ', this.canvasVideo.offsetWidth, this.canvasVideo.offsetHeight, ' canvasBlobOffset: ', this.canvasBlob.offsetWidth, this.canvasBlob.offsetHeight);
    // console.log('resolution ', this.resolution);
    // console.log( 'ctxVideo: ', this.ctxVideo.canvas.width, this.ctxVideo.canvas.height, ' ctxBlob: ', this.ctxBlob.canvas.width, this.ctxBlob.canvas.height);
    // console.log('-------------------------------------------');
    if (this.containerDomID) {

      this.canvasBlob.setAttribute('width', width /** 0.8*/);
      this.canvasBlob.setAttribute('height', height /** 0.8*/);

      this.ctxBlob.canvas.width = this.canvasVideo.clientWidth;
      this.ctxBlob.canvas.height = this.canvasVideo.clientHeight;
      this.ctxBlob.canvas.style.width = this.canvasVideo.clientWidth + 'px';
      this.ctxBlob.canvas.style.height = this.canvasVideo.clientHeight + 'px';

      this.resolution = {width: this.canvasVideo.clientWidth, height: this.canvasVideo.clientHeight};

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

  private drawAllDataOnCanvas = (allData: { mark: BLOB_DATA }, resolution: SIZE) => {
    this.drawBlobsData(allData, resolution);
  };

  private drawBlobsData = (allData: { mark: BLOB_DATA }, resolution: SIZE) => {
    if (allData !== undefined && resolution && resolution.height && resolution.width) {
      this.allDataBlobs = allData;

      //  - draw blobs
      if (allData.mark && allData.mark.blubMetaData) {
        allData.mark.blubMetaData.forEach(blob => {
          this.drawBlob(this.ctxBlob, blob, resolution);
          this.drawBlobLabel(this.ctxBlob, blob, resolution);
        });
      }
    }
  };

  public drawBlob = (ctx, blob: BLOB, resolution: SIZE) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.strokeOpacity = 1;
    ctx.lineWidth = 3;

    if (blob.rectangleData) {

      const xMin = blob.rectangleData.minX * resolution.width;
      const xMax = blob.rectangleData.maxX * resolution.width;
      const yMin = blob.rectangleData.minY * resolution.height;
      const yMax = blob.rectangleData.maxY * resolution.height;

      // console.log('xMin: ', xMin, ', xMax: ', xMax, ', yMin: ', yMin, ', yMax: ', yMax);

      ctx.moveTo(xMin, yMin);
      ctx.lineTo(xMax, yMin);
      ctx.lineTo(xMax, yMax);
      ctx.lineTo(xMin, yMax);
      ctx.lineTo(xMin, yMin);
      ctx.stroke();

      ctx.restore();
    }


  };

  public drawBlobLabel = (ctx, blob: BLOB, resolution: SIZE) => {
    ctx.beginPath();
    ctx.fillStyle = '#ff00ff';
    ctx.textAlign = 'center';
    ctx.font = '15px Heebo';

    if (blob.rectangleData) {

      const xMin = blob.rectangleData.minX * resolution.width;
      const xMax = blob.rectangleData.maxX * resolution.width;
      const yMin = blob.rectangleData.minY * resolution.height;
      const yMax = blob.rectangleData.maxY * resolution.height;

      ctx.textAlign = 'center';
      const text = blob.name || blob.id;
      ctx.fillText(text, (xMin + xMax) / 2, yMax + 15);

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
      const point = this.canvasTools.getPointFromEvent(this.ctxBlob, e);
      if (!point) {
        return;
      }
      if (this.allDataBlobs &&
        Object.keys(this.allDataBlobs.mark).length > 0 &&
        this.allDataBlobs.mark.constructor === Object) {
        const selectedId = this.canvasTools.findObjectToSelect(this.ctxBlob, point, this.allDataBlobs.mark, this.resolution);
        this.callEventHandler(this.eventHandlerEmitter, 'selectedBlob', {selectedId, point: [e.clientX, e.clientY]});
      }
    }
  };

  private mouseUpHandler = (e) => {
    if (e.button !== 2) {
      this.callEventHandler(this.eventHandlerEmitter, 'unselectBlob', {});
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

  mouseDownEventHandlerConfig = {
    // 'point': this.editPoint,
  };
}
