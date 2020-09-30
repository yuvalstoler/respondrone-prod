import {POINT, POINT3D} from '../../typings/all.typings';

export class GeoPolygon {
    geometry: {
        type: string,
        coordinates: (POINT3D | POINT)[][];
    };

    constructor(_polygons: (POINT3D | POINT)[][]) {
        this.geometry = {
            type: 'Polygon',
            coordinates: _polygons,
        };
    }

    public update = (polygon: (POINT3D | POINT)[][]) => {
        this.geometry.coordinates = polygon;
    };
    public addPolygon = (polygon: (POINT3D | POINT)[]) => {
        this.geometry.coordinates.push(polygon);
    }

}
