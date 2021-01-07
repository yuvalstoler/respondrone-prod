import {BLOB_DATA, POINT, SIZE} from '../../../../../../classes/typings/all.typings';


export class CanvasTools {

  constructor() {
  }

  public drawImage = (ctx, img) => {
    if (ctx && img) {
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  public getPointFromEvent(ctx, e): POINT {
    const x = e.x || e.clientX;
    const y = e.y || e.clientY;
    const bbox = ctx.canvas.getBoundingClientRect();
    const relativXY = {x: (x - bbox.left), y: (y - bbox.top)};
    const point: POINT = [relativXY.x, relativXY.y];
    // this.convertToRelativeCoordinates(ctx, point);
    return point;
  }

  public findObjectToSelect = (ctx, clickPoint: POINT, marks: BLOB_DATA, resolution: SIZE): string => {
    let res: string;
    // todo: not work with new data
    if (marks.blubMetaData && Array.isArray(marks.blubMetaData) && marks.blubMetaData.length > 0) {
      marks.blubMetaData.forEach(blob => {
        if (blob.rectangleData) {
          const isExist: boolean = this.compareIfPointExictOnObject(blob.rectangleData, clickPoint, resolution);
          if (isExist) {
            res = blob.id;
            console.log(blob, res);
            // break;
          }
        }
      });
    }
    return res;
  };

  private compareIfPointExictOnObject = (minmaxPoints: { minX: number, maxX: number, minY: number, maxY: number }, clickPoint: POINT, resolution: SIZE): boolean => {
    let res = false;
    // console.log('clickPoint: ', clickPoint);
    // console.log('clickBlob: ', ' xMin: ', minmaxPoints.xMin * resolution.width,
    //   ', xMax: ', minmaxPoints.xMax * resolution.width,
    //   ', yMin: ', minmaxPoints.yMin * resolution.height, ',' +
    //   ' yMax: ', minmaxPoints.yMax * resolution.height);
    if (clickPoint[0] > minmaxPoints.minX * resolution.width && clickPoint[0] < minmaxPoints.maxX * resolution.width &&
      clickPoint[1] > minmaxPoints.minY * resolution.height && clickPoint[1] < minmaxPoints.maxY * resolution.height) {
      res = true;
    }

    return res;
  };


}
