import {EventHandler} from './eventHandler';
import {POINT} from '../../../../../../classes/typings/all.typings';


export class CanvasClass {

  domID: string;
  containerDomID: string;
  canvas: any;
  canvasContainer: any;
  ctx: any;
  img: any;
  src: string;
  resolution: POINT;
  allDataDetections;

  constructor(_eventHandlerEmitter?: EventHandler) {
    this.img = new Image;
  }

  public setDomID = (_domID: string, containerDomID: string, editingCanvasDomID?: string, isEventListen?: boolean) => {
    this.domID = _domID;
    this.canvas = <HTMLCanvasElement>document.getElementById(this.domID);
    this.containerDomID = containerDomID;
    this.canvasContainer = <HTMLCanvasElement>document.getElementById(this.containerDomID);
    this.canvas.options = {domID: this.domID};
    this.ctx = this.canvas.getContext('2d');
  };

  public createImageMain = (sizeVideoContainer, allData: any) => {
    let factor = 1;
    if (this.containerDomID) {

      this.setCanvasMeasurements(sizeVideoContainer.height, sizeVideoContainer.width);

      this.resolution = [this.canvas.width, this.canvas.height];

      const f0 = (this.canvasContainer.clientHeight) / this.ctx.canvas.height;
      const f1 = (this.canvasContainer.clientWidth) / this.ctx.canvas.width;
      factor = Math.min(f0, f1);

      this.drawAllDataOnCanvas(allData, factor);
      console.log(factor);
      // };
    }
  };

  private setCanvasMeasurements = (height, width) => {
    if (this.containerDomID) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.height = this.canvas.height + 'px';
      this.canvas.style.width = this.canvas.width + 'px';
      this.ctx.width = this.canvas.width;
      this.ctx.height = this.canvas.height;

      // console.log('canvasHeight ='  + this.canvasContainer.clientHeight, 'canvasWidth ='  + this.canvasContainer.clientWidth );
      // console.log('ctxHeight ='  + this.ctx.canvas.height, 'ctxWidth ='  + this.ctx.canvas.width);
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

  private drawAllDataOnCanvas = (allData: any, factor: number) => {
    this.drawBlobsData(allData, factor);
  };

  private drawBlobsData = (allData: any, factor: number) => {
    if (allData !== undefined &&
      Array.isArray(this.resolution) && this.resolution.length > 1 &&
      Number.isFinite(this.resolution[0]) && Number.isFinite(this.resolution[1])) {
      this.allDataDetections = allData;

      //  - draw blobs
      if (allData.hasOwnProperty('mark')) {
        allData.mark.blobs.forEach(blob => {
          this.drawBlob(this.ctx, blob, factor);
        });
      }
    }
  };

  public drawBlob = (ctx, blob: { id, xMin: 100, yMin: 100, xMax: 300, yMax: 400 }, factor: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.strokeOpacity = 1;
    ctx.lineWidth = 3;

    ctx.moveTo(blob.xMin * factor, blob.yMin * factor);
    ctx.lineTo(blob.xMax * factor, blob.yMin * factor);
    ctx.lineTo(blob.xMax * factor, blob.yMax * factor);
    ctx.lineTo(blob.xMin * factor, blob.yMax * factor);
    ctx.lineTo(blob.xMin * factor, blob.yMin * factor);
    ctx.stroke();

    ctx.restore();

  };

  public convertXYToAbsoluteCoordinates = (ctx, point: POINT, resolution: POINT): POINT => {
    const x = Math.round((point[0] / resolution[0]) * ctx.canvas.width);
    const y = Math.round((point[1] / resolution[1]) * ctx.canvas.height);
    return [x, y];
  };

}
