import { IRest } from "../dataClasses/interfaces/IRest";


export type MAP<T> = { [key: string]: T };

export type LOGIN_UI = {
    name: string;
    password: string;
    token?: string;
};

export type TOASTER_OPTIONS = Partial<{ timeOut: number, extendedTimeOut: number, positionClass: string, preventDuplicates: boolean }>;

export type ID_TYPE = string;
export type ID_OBJ = { id: ID_TYPE };


export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T };
export type REST_ROUTER_CONFIG = { class: IRest, path: string };


export enum NOTIFICATION_TYPE {success = 'success', error = 'error', info = 'info', warning = 'warning'}

export type NOTIFICATION = { type?: NOTIFICATION_TYPE, message: string, title: string };
export type NOTIFICATION_UI = NOTIFICATION & { options?: TOASTER_OPTIONS };

export type VERSION = {
    name: string,
    lastUpdate: string,
    lastUpdateNumber: number,
};

export type CARTESIAN1 = { x: number };
export type CARTESIAN2 = { x: number, y: number };
export type CARTESIAN3 = { x: number, y: number, z: number };

export type CARTESIAN2_VECTOR = [CARTESIAN2, CARTESIAN2];
export type CARTESIAN3_VECTOR = [CARTESIAN2, CARTESIAN2, CARTESIAN2];

export type GEOMETRY = { coordinates: POINT | POINT3D, type?: string };


// region Location
export type YXZ = { y: number, x: number, z: number };
export type YXZW = YXZ & { w: number };
export type POINT = [number, number];
export type POINT3D = [number, number, number?];
export type VECTOR = [POINT3D, POINT3D];
export type RECTANGLE = [POINT3D, POINT3D, POINT3D, POINT3D];

export enum BOOLEAN_NUMBER {
    true = 1,
    false = 0,
}

export type GEOPOINT = { latitude: number, longitude: number };
export type GEOPOINT_UI = { lat: number, lng: number };
export type GEOPOINT3D = GEOPOINT & { altitude?: number };
export type ADDRESS_GEOPOINT = GEOPOINT & { address: string };


export enum REPORT_TYPE {
    unclassified = 'Unclassified',
    fireAlarm = 'Fire Alarm',
    flood = 'Flood',
    roadAccident = 'road Accident',
    roadBlock = 'road Block',
    attackReport = 'Attack Report',
    explosionReport = 'Explosion Report',

}

export enum EVENT_TYPE { // TODO - change data fields
    unclassified = 'unclassified',
    fireAlarm = 'fireAlarm',
    flood = 'flood',
    roadAccident = 'roadAccident',
    roadBlock = 'roadAccident',

}

export enum SOURCE_TYPE { // TODO - change data fields
    MRF = 'MFR',
    OSCC = 'OSCC',

}

export enum PRIORITY {
    low = 'Low',
    middle = 'Medium',
    high = 'High'
}


export type REPORT_DATA = {
    id?: ID_TYPE,
    source: SOURCE_TYPE;
    time: number;
    createdBy: string

    type: REPORT_TYPE,
    priority: PRIORITY,
    description: string,
    location: GEOPOINT3D | ADDRESS_GEOPOINT,
    mediaIds?: string[],
    eventIds?: string[],
    commentIds?: Comment[]
};

export type EVENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    type: EVENT_TYPE,
    priority: PRIORITY,
    description: string,
    location: GEOPOINT3D | ADDRESS_GEOPOINT,
    media: string[],
    events: string[],

};

export type COMMENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    source: string,
    time: number,
    createdBy: string,
    text: string,

};


export type MEDIA_DATA = {
    url: string,
    id: string,
    type: 'image' | 'video'
};


