import {EVENT_LISTENER_DATA} from '../../../types';
import {POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
import {GeoCalculate} from './geoCalculate';


export class DrawMarkerClass {

  constructor() {}

  public mouseEvents = (event: EVENT_LISTENER_DATA): POINT[] => {
    let res: POINT[];
    switch (event.type) {
      case 'leftClick' : {
        // res = this.savePointToArray(event.pointLatLng);
        break;
      }
      case 'mouseDown' : {
        // res = this.savePointToArray(event.pointLatLng);
        break;
      }
      case 'mouseOver' : {
        // res = this.saveTempPointToArray(event.pointLatLng);
        break;
      }
      case 'doubleClick' : {
        // res = this.closeDrawing(event.pointLatLng);
        break;
      }
    }
    return res;
  };


  public checkIfMarkerExist = (event: EVENT_LISTENER_DATA, marker: POINT3D, distanceMeter: number): boolean => {
    let res = false;
      const distance = GeoCalculate.calcDistanceBetweenToPoints(event.pointLatLng, marker);
      console.log(distance, ' ', distanceMeter * 15);
      if (distance && distance <= (distanceMeter * 15)) { // 1px
        res = true;
      }
      console.log(res);
    return res;
  };

}
