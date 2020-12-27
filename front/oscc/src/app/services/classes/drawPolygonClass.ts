import {POINT, POINT3D, VECTOR} from '../../../../../../classes/typings/all.typings';
import {EVENT_LISTENER_DATA} from '../../../types';


export class DrawPolygonClass {

  arrayPoints: POINT3D[] = [];
  circleIndex = -1;

  constructor() {

  }

  //  function click, mouseMove, doubleClick
  public mouseEvents = (event: EVENT_LISTENER_DATA): POINT3D[] => {
    let res: POINT3D[];
    switch (event.type) {
      case 'mouseDown' : {
        res = this.savePointToArray(event.pointLatLng);
        break;
      }
      case 'mouseOver' : {
        res = this.saveTempPointToArray(event.pointLatLng);
        break;
      }
      case 'doubleClick' : {
        // if (!this.checkCrossPolygon(this.arrayPoints)) {
          res = this.closeDrawing();
        // }
        // res = [];
        break;
      }
    }
    return res;
  };

  //  function save array POINT[]
  private savePointToArray = (point: POINT3D): POINT3D[] => {
    if (this.arrayPoints.length === 0) {
      this.arrayPoints.push(point);
    }
    // compare if last point !== point
    if (this.arrayPoints[this.arrayPoints.length - 1][0] !== point[0] && this.arrayPoints[this.arrayPoints.length - 1][1] !== point[1]) {
      this.arrayPoints.push(point);
    }
    return this.addLastPointForPolygon();
  };

  // function adds the last point as the first
  private addLastPointForPolygon = (): POINT3D[] => {
    const polygonArray: POINT3D[] = [];
    if (Array.isArray(this.arrayPoints) && this.arrayPoints.length > 0) {
      if (this.arrayPoints.length === 1) {
        polygonArray.push(this.arrayPoints[0]);
        polygonArray.push(this.arrayPoints[0]);
        polygonArray.push(this.arrayPoints[0]);
      } else {
        polygonArray.push(...this.arrayPoints);
        polygonArray.push(this.arrayPoints[0]);
      }
    }
    return polygonArray;
  };

  //  function save temporary point to array POINT[]
  private saveTempPointToArray = (point: POINT3D): POINT3D[] => {
    const polygonTempArray: POINT3D[] = [];
    if (Array.isArray(this.arrayPoints) && this.arrayPoints.length > 0) {
      if (this.arrayPoints.length === 1) {
        polygonTempArray[0] = this.arrayPoints[0];
        polygonTempArray[1] = point;
        polygonTempArray[2] = this.arrayPoints[0];
      } else {
        polygonTempArray.push(...this.arrayPoints);
        polygonTempArray[polygonTempArray.length] = point;
        polygonTempArray.push(this.arrayPoints[0]);
      }
    }
    return polygonTempArray;
  };

  private closeDrawing = (): POINT3D[] => {
    this.arrayPoints.push((this.arrayPoints[0]));
    return this.close();
  };

  private close = (): POINT3D[] => {
    const tempArrayPoints = this.arrayPoints;
    this.arrayPoints = [];
    this.circleIndex = -1;
    return tempArrayPoints;
  };

  public checkCrossPolygon = (polygon: POINT3D[]): boolean => {
    let res: boolean = false;
    if (polygon.length > 2) {
      for (let i = 0; i < polygon.length - 2; i++) {
        for (let k = i + 1; k < polygon.length - 1; k++) {
          if (!res) {
            res = this.checkCrossLines([[polygon[i][0], polygon[i][1], 0], [polygon[i + 1][0], polygon[i + 1][1], 0]],
              [[polygon[k][0], polygon[k][1], 0], [polygon[k + 1][0], polygon[k + 1][1], 0]]);
          }
        }
        if (!res) {
          res = this.checkCrossLines([[polygon[i][0], polygon[i][1], 0], [polygon[i + 1][0], polygon[i + 1][1], 0]],
            [[polygon[polygon.length - 1][0], polygon[polygon.length - 1][1], 0], [polygon[0][0], polygon[0][1], 0]]);
        }
      }
    }
    return res;
  };

  private checkCrossLines = (l1: VECTOR, l2: VECTOR | POINT3D[]): boolean => {
    let res = false;
    const v1 = (l2[1][0] - l2[0][0]) * (l1[0][1] - l2[0][1]) - (l2[1][1] - l2[0][1]) * (l1[0][0] - l2[0][0]);
    const v2 = (l2[1][0] - l2[0][0]) * (l1[1][1] - l2[0][1]) - (l2[1][1] - l2[0][1]) * (l1[1][0] - l2[0][0]);
    const v3 = (l1[1][0] - l1[0][0]) * (l2[0][1] - l1[0][1]) - (l1[1][1] - l1[0][1]) * (l2[0][0] - l1[0][0]);
    const v4 = (l1[1][0] - l1[0][0]) * (l2[1][1] - l1[0][1]) - (l1[1][1] - l1[0][1]) * (l2[1][0] - l1[0][0]);
    if ((v1 * v2 < 0) && (v3 * v4 < 0)) {
      res = true;
    }
    return res;
  };

}
