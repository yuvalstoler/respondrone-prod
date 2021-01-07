import {GEOPOINT3D_SHORT, POINT, POINT3D} from '../../../../../../classes/typings/all.typings';
import * as turf from '@turf/turf';

export class GeoCalculate {


  public static calcDistanceFromPointToPolyline = (startPoint: POINT | POINT3D, polyline: POINT3D[]): number => {
    // distance - meters;
    let distance: number;
    if (GeoCalculate.isCartographicPOINT(startPoint)) {
      const from = turf.point([startPoint[0], startPoint[1]]);
      if (GeoCalculate.isPOINTsArray(polyline)) {
        const line = turf.lineString(polyline);
        if (from && line) {
          distance = turf.pointToLineDistance(from, line) * 1000;
        }
      }
    }
    return distance;
  };

  public static calcDistanceBetweenToPoints = (startPoint: POINT | POINT3D, endPoint: POINT | POINT3D): number => {
    // distance - meters;
    let distance: number;
    if (GeoCalculate.isCartographicPOINT(startPoint) && GeoCalculate.isCartographicPOINT(endPoint)) {
      const from = turf.point([startPoint[0], startPoint[1]]);
      const to = turf.point([endPoint[0], endPoint[1]]);
      if (from && to) {
        distance = turf.distance(from, to) * 1000;
      }
    }
    return distance;
  };

  public static isPointExistInPolygon = (pointClick: POINT, arrPolygon: POINT[]): boolean => {
    let result = false;
    if (GeoCalculate.isPOINT(pointClick)) {
      const point = turf.point(pointClick);
      if (GeoCalculate.isPOINTsArray(arrPolygon)) {
        const polygon = turf.polygon([arrPolygon]);
        if (polygon && point) {
          result = turf.booleanPointInPolygon(point, polygon);
        }
      }
    }
    return result;
  };

  private static isCartographicPOINT = (point: POINT | POINT3D): boolean => {
    let result = false;
    if (Array.isArray(point) && point.length > 1 && Number.isFinite(point[0]) && Number.isFinite(point[1])) {
      if ((point[0] !== undefined && point[0] <= 180 && point[0] >= -180) &&
        (point[1] !== undefined && point[1] <= 90 && point[1] >= -90)) {
        result = true;
      }
    }
    return result;
  };

  public static isPOINT = (point: POINT | POINT3D): boolean => {
    let result = false;
    if (Array.isArray(point) && point.length > 1 && Number.isFinite(point[0]) && Number.isFinite(point[1])) {
      result = true;
    }
    return result;
  };

  public static isPOINTsArray = (points: POINT[] | POINT3D[]): boolean => {
    const res: Boolean[] = [];
    if (Array.isArray(points) && points.length > 0) {
      for (let i = 0; i < points.length && res; i++) {
        res.push(GeoCalculate.isPOINT(points[i]));
      }
    } else {
      res.push(false);
    }
    return !res.includes(false);
  };

  public static point3d_to_geoPoint3d_short_arr = (points: POINT3D[]): GEOPOINT3D_SHORT[] => {
    const geopoints = points.map(point => GeoCalculate.point3d_to_geoPoint3d_short(point));
    return geopoints;
  };

  public static point3d_to_geoPoint3d_short = (point: POINT3D): GEOPOINT3D_SHORT => {
    return {lon: point[0], lat: point[1], alt: point[2] || 0};
  };

  public static geopoint3d_short_to_point3d_arr = (geopoints: GEOPOINT3D_SHORT[]): POINT3D[] => {
    const points = geopoints.map(point => GeoCalculate.geopoint3d_short_to_point3d(point));
    return points;
  };

  public static geopoint3d_short_to_point3d = (geopoint: GEOPOINT3D_SHORT): POINT3D => {
    return [geopoint.lon, geopoint.lat, geopoint.alt || 0];
  };

}
