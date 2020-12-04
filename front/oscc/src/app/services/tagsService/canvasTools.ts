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
    if (marks.hasOwnProperty('bb') && Array.isArray(marks.bb) && marks.bb.length > 0) {
      marks.bb.forEach(blob => {
        if (blob.hasOwnProperty('trackBB')) {
          const isExist: boolean = this.compareIfPointExictOnObject(blob.trackBB, clickPoint, resolution);
          if (isExist) {
            res = blob.trackId;
            console.log(blob, res);
            // break;
          }
        }
      });
    }
    return res;
  };

  private compareIfPointExictOnObject = (minmaxPoints: { xMin: number, xMax: number, yMin: number, yMax: number }, clickPoint: POINT, resolution: SIZE): boolean => {
    let res = false;
    // console.log('clickPoint: ', clickPoint);
    // console.log('clickBlob: ', ' xMin: ', minmaxPoints.xMin * resolution.width,
    //   ', xMax: ', minmaxPoints.xMax * resolution.width,
    //   ', yMin: ', minmaxPoints.yMin * resolution.height, ',' +
    //   ' yMax: ', minmaxPoints.yMax * resolution.height);
    if (clickPoint[0] > minmaxPoints.xMin * resolution.width && clickPoint[0] < minmaxPoints.xMax * resolution.width &&
      clickPoint[1] > minmaxPoints.yMin * resolution.height && clickPoint[1] < minmaxPoints.yMax * resolution.height) {
      res = true;
    }

    return res;
  };


}
