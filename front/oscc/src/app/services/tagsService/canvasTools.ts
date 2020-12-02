import {BLOB_DATA, POINT} from '../../../../../../classes/typings/all.typings';


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

  public findObjectToSelect = (ctx, clickPoint: POINT, marks: BLOB_DATA, resolution: POINT): string => {
    let res: string;
    // todo: not work with new data
    if (marks.hasOwnProperty('bb') && Array.isArray(marks.bb) && marks.bb.length > 0) {
      // for (const key in marks.bb) {
      //   if (marks.bb.hasOwnProperty(key)) {
      //       const isExist: boolean = this.compareIfPointExictOnObject(marks.blobs[key], clickPoint);
      //       if (isExist) {
      //         res = marks.bb[key].id;
      //         console.log(marks.bb[key], res);
      //         break;
      //       }
      //   }
      // }
      marks.bb.forEach(blob => {
        if (blob.hasOwnProperty('trackBB')) {
          const isExist: boolean = this.compareIfPointExictOnObject(blob.trackBB, clickPoint);
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

  private compareIfPointExictOnObject = (minmaxPoints: { xMin: number, xMax: number, yMin: number, yMax: number }, clickPoint: POINT): boolean => {
    let res = false;

    if (clickPoint[0] > minmaxPoints.xMin && clickPoint[0] < minmaxPoints.xMax &&
      clickPoint[1] > minmaxPoints.yMin && clickPoint[1] < minmaxPoints.yMax) {
      res = true;
    }

    return res;
  };


}
