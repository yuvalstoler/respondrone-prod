import {POINT} from '../../../../../../classes/typings/all.typings';


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

  public findObjectToSelect = (ctx, clickPoint: POINT, marks: { blobs: any[] }, resolution: POINT): string => {
    let res: string;
    if (marks.hasOwnProperty('blobs') && Array.isArray(marks.blobs) && marks.blobs.length > 0) {
      for (const key in marks.blobs) {
        if (marks.blobs.hasOwnProperty(key)) {
          //   const rect: any = this.convertToMinMaxWithBorder(ctx, detections[key].mark.x, detections[key].mark.y,
          //     detections[key].mark.width, detections[key].mark.height, false);
          //   const from = rect[0];
          //   const to = rect[1];
          //
          //   const minMaxPoints: POINT[] = [from, to];
          //
          //   // // prepare clickPoint to absolute !!!
          //   // const newClickPoint: POINT = this.convertPointToAbsoluteCoordinates(ctx, clickPoint, resolution); /*clickPoint;*/
          //   // minMaxPoints compare with clickPoint
            const isExist: boolean = this.compareIfPointExictOnObject(marks.blobs[key], clickPoint);
            if (isExist) {
              res = marks.blobs[key].id;
              console.log(marks.blobs[key], res);
              break;
            }
        }
      }
    }
    return res;
  };

  private compareIfPointExictOnObject = (minmaxPoints: any, clickPoint: POINT): boolean => {
    let res = false;

    if (clickPoint[0] > minmaxPoints.xMin && clickPoint[0] < minmaxPoints.xMax &&
      clickPoint[1] > minmaxPoints.yMin && clickPoint[1] < minmaxPoints.yMax) {
      res = true;
    }

    return res;
  };


}
