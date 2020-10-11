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
export type IDs_OBJ = { ids: ID_TYPE[] };


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
export type POLYGON_GEOPOINT = GEOPOINT3D[];


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

export enum LOCATION_TYPE {
    none = 'none',
    address = 'address',
    locationPoint = 'locationPoint',
    polygon = 'polygon'
}
export type COMMENT = {
    source: string,
    time: number,
    text: string
}

export type REPORT_DATA = {
    id?: ID_TYPE,
    source: SOURCE_TYPE;
    time: number;
    createdBy: string,
    type: REPORT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE;
    location: GEOPOINT3D | ADDRESS_GEOPOINT,
    media: MEDIA_DATA[],
    eventIds: string[],
    commentIds: string[]
};
export type REPORT_DATA_UI = REPORT_DATA & {
    events: LINKED_EVENT_DATA[],
    comments: COMMENT[],
    modeDefine: REPORT_DATA_MD,
};
export type LINKED_REPORT_DATA = {
    id: ID_TYPE,
    time: number,
    createdBy: string,
    type: REPORT_TYPE,
    description: string
}
export type REPORT_DATA_MD = {
    styles: {},
    tableData: {
        message: TABLE_DATA_MD,
        priority: TABLE_DATA_MD,
        link: TABLE_DATA_MD,
        map: TABLE_DATA_MD,
        attachment: TABLE_DATA_MD,
    }
}

export type TABLE_DATA_MD = {
    type: 'matIcon' | 'text',
    data: string,
    color?: string
}

export type EVENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    time: number,
    createdBy: string,
    title: string,
    type: EVENT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE,
    location: GEOPOINT3D | ADDRESS_GEOPOINT | POLYGON_GEOPOINT,
    reportIds: string[],
    commentIds: string[],
};
export type EVENT_DATA_UI = EVENT_DATA & {
    reports: LINKED_REPORT_DATA[],
    comments: COMMENT[],
    modeDefine: EVENT_DATA_MD,
};
export type LINKED_EVENT_DATA = {
    id: ID_TYPE,
    time: number,
    createdBy: string,
    type: EVENT_TYPE,
    description: string,
}
export type EVENT_DATA_MD = {
    styles: {},
    tableData: {
        message: TABLE_DATA_MD,
        priority: TABLE_DATA_MD,
        link: TABLE_DATA_MD,
        map: TABLE_DATA_MD,
    }
}

export type COMMENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    source: string,
    time: number,
    createdBy: string,
    text: string,

};

export enum MEDIA_TYPE {
    image = 'image',
    video = 'video',
}

export type MEDIA_DATA = {
    thumbnail: string,
    url: string,
    id: ID_TYPE,
    type: MEDIA_TYPE
};

export enum FILE_STATUS {
    unknown = 'unknown',
    inProcess = 'inProcess',
    downloaded = 'downloaded',
    error = 'error',
    notFund = 'notFund',
}
export type FILE_DB_DATA = {
    _id?: ID_TYPE,
    type: MEDIA_TYPE,
    originFileName: string,
    fsName: string,
    fsPath: string,
    fileStatus: FILE_STATUS,

};
