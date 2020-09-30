import {POINT, POINT3D} from '../../typings/all.typings';

export class GeoPoint {
    geometry: {
        type: string,
        coordinates: POINT3D;
    };

    constructor(_coordinates: POINT | POINT3D) {
        if ( Array.isArray(_coordinates) && _coordinates[2] === undefined ) {
            _coordinates[2] = 0;
        }
        this.geometry = {
            type: 'Point',
            coordinates: <POINT3D>_coordinates,
        };
    }
}
