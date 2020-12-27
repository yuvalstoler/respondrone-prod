import {POINT3D} from '../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {GeoCalculate} from './geoCalculate';
import {EVENT_LISTENER_DATA} from '../../../types';

export class DrawPolylineClass {

  arrayPoints: POINT3D[] = [];

  constructor() {
  }

  // Polygon ===========================================================================================================

  // function click, mouseMove, doubleClick
  public mouseEvents = (event: EVENT_LISTENER_DATA): POINT3D[] => {
    let res: POINT3D[];
    switch (event.type) {
      case 'leftClick' : {
        // res = this.savePointToArray(event.pointLatLng);
        break;
      }
      case 'mouseDown' : {
        res = this.savePointToArray(event.pointLatLng);
        break;
      }
      case 'mouseOver' : {
        res = this.saveTempPointToArray(event.pointLatLng);
        break;
      }
      case 'doubleClick' : {
        res = this.closeDrawing(event.pointLatLng);
        break;
      }
    }
    return res;
  };

  private closeDrawing = (point: POINT3D): POINT3D[] => {
    const tempArrayPoints = this.arrayPoints;
    this.arrayPoints = [];
    return tempArrayPoints;
  };

  //  function save array POINT3D[]
  private savePointToArray = (point: POINT3D): POINT3D[] => {
    if (this.arrayPoints.length === 0) {
      this.arrayPoints.push(point);
    }
    // compare if last point !== point
    if (this.arrayPoints[this.arrayPoints.length - 1][0] !== point[0] && this.arrayPoints[this.arrayPoints.length - 1][1] !== point[1]) {
      this.arrayPoints.push(point);
    }
    return this.addLastPointForPolyline();
  };

  //  function save temporary point to array POINT3D[]
  private saveTempPointToArray = (point: POINT3D): POINT3D[] => {
    const polygonTempArray: POINT3D[] = [];
    if (Array.isArray(this.arrayPoints) && this.arrayPoints.length > 0) {
      if (this.arrayPoints.length === 1) {
        polygonTempArray[0] = this.arrayPoints[0];
        polygonTempArray[1] = point;
      } else {
        polygonTempArray.push(...this.arrayPoints);
        polygonTempArray[polygonTempArray.length] = point;
      }
    }
    return polygonTempArray;
  };

  // function adds the last point as the first
  private addLastPointForPolyline = (): POINT3D[] => {
    const polygonArray: POINT3D[] = [];
    if (Array.isArray(this.arrayPoints) && this.arrayPoints.length > 0) {
      if (this.arrayPoints.length === 1) {
        polygonArray.push(this.arrayPoints[0]);
        polygonArray.push(this.arrayPoints[0]);
      } else {
        polygonArray.push(...this.arrayPoints);
      }
    }
    return polygonArray;
  };

  public checkIfCircleExist = (event: EVENT_LISTENER_DATA, route: POINT3D[], distanceMeter: number) => {
    let res = -1;
    route.forEach((circle, index) => {
      const distance = GeoCalculate.calcDistanceBetweenToPoints(event.pointLatLng, circle);
      console.log(distance, ' ', distanceMeter * 9);
      if (distance && distance <= (distanceMeter * 9)) { // 1px
        res = index;
      }
    });
    return res;
  };

  public checkIfPolylineExist = (event: EVENT_LISTENER_DATA, route: POINT3D[], distanceMeter: number) => {
    let res = false;
      const distance = GeoCalculate.calcDistanceFromPointToPolyline(event.pointLatLng, route);
      if (distance && distance <= (distanceMeter * 4)) { // 1px
        res = true;
      }
    return res;
  };

}
