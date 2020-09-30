
import {POINT, POINT3D} from '../../typings/all.typings';

export class GeoLineString {
    geometry: {
        type: string,
        coordinates: POINT3D[];
    };

    /*constructor(_coordinates: POINT[] | POINT3D[]) {
        if ( Array.isArray(_coordinates) && _coordinates.length > 1 ) {
            const newCoordinates: POINT3D[] = [];
            _coordinates.forEach((point) => {
                newCoordinates.push(<POINT3D>point);
            });
            this.geometry = {
                type: 'LineString',
                coordinates: newCoordinates,
            };
        }
    }*/

// MY copied  from SBatash
    constructor(_coordinates: (POINT | POINT3D)[]) {
        if (Array.isArray(_coordinates) && _coordinates.length > 1) {
            const newCoordinates: POINT3D[] = [];
            _coordinates.forEach((point) => {
                if (point.length === 2) {
                    newCoordinates.push([point[0], point[1], 0]);
                } else if (point.length === 3) {
                    newCoordinates.push([point[0], point[1], point[2]]);
                }
            });
            this.geometry = {
                type: 'LineString',
                coordinates: newCoordinates,
            };
        }
    }

    toJson = () => {
        return this.geometry;
    }
}
