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
    console.log(this.canvas);
  };

  public createImageMain = (imageSize, allData: any) => {
    if (this.containerDomID) {
      this.resolution = [this.canvas.width, this.canvas.height];
      const f0 = (this.canvasContainer.clientHeight) / this.ctx.canvas.height;
      const f1 = (this.canvasContainer.clientWidth) / this.ctx.canvas.width;
      // this.canvas.width = imageSize.width;
      // this.canvas.height = imageSize.height;
      this.drawAllDataOnCanvas(allData);
    }
  };

  private drawAllDataOnCanvas = (allData: any) => {
    this.drawBlobsData(allData);
  };

  private drawBlobsData = (allData: any) => {
    if (allData !== undefined &&
      Array.isArray(this.resolution) && this.resolution.length > 1 &&
      Number.isFinite(this.resolution[0]) && Number.isFinite(this.resolution[1])) {
      this.allDataDetections = allData;

      //  - draw blobs
      if (allData.hasOwnProperty('mark')) {
        allData.mark.blobs.forEach(blob => {
          this.drawBlob(this.ctx, blob, this.resolution);
        });
      }
    }
  };

  public drawBlob = (ctx, blob: { id, xMin: 100, yMin: 100, xMax: 300, yMax: 400 }, resolution: POINT) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.strokeOpacity = 1;
    ctx.lineWidth = 3;

    ctx.moveTo(blob.xMin, blob.yMin);
    ctx.lineTo(blob.xMax, blob.yMin);
    ctx.lineTo(blob.xMax, blob.yMax);
    ctx.lineTo(blob.xMin, blob.yMax);
    ctx.lineTo(blob.xMin, blob.yMin);
    ctx.stroke();

    ctx.restore();

  };

  public convertXYToAbsoluteCoordinates = (ctx, point: POINT, resolution: POINT): POINT => {
    const x = Math.round((point[0] / resolution[0]) * ctx.canvas.width);
    const y = Math.round((point[1] / resolution[1]) * ctx.canvas.height);
    return [x, y];
  };

}
