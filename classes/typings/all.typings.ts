import {IRest} from "../dataClasses/interfaces/IRest";


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
// @ts-ignore
export type POINT3D = [number, number, number? ];
export type VECTOR = [POINT3D, POINT3D];
export type RECTANGLE = [POINT3D, POINT3D, POINT3D, POINT3D];

export enum BOOLEAN_NUMBER {
    true = 1,
    false = 0,
}

export type GEOPOINT = { latitude: number, longitude: number };
export type GEOPOINT3D_SHORT = { lat: number, lon: number, alt: number };
export type GEOPOINT3D = GEOPOINT & { altitude?: number };
export type ADDRESS = string;
export type POLYGON_GEOPOINT = GEOPOINT3D[];


export enum REPORT_TYPE {
//     unclassified = 'Unclassified',
//     fireAlarm = 'Fire Alarm',
//     flood = 'Flood',
//     roadAccident = 'road Accident',
//     roadBlock = 'road Block',
//     attackReport = 'Attack Report',
//     explosionReport = 'Explosion Report',
//
}
//
export enum EVENT_TYPE { // TODO - change data fields
//     general = 'general',
//     emergency = 'emergency',
//     criminal = 'criminal',
//     terror = 'terror',
//     accident = 'accident',
//     info = 'info',
}

export enum SOURCE_TYPE { // TODO - change data fields
    MRF = 'MFR',
    OSCC = 'OSCC',
}

export enum LOCATION_NAMES {
    noLocation = 'No location',
    address = 'Add an address',
    locationPoint = 'Add a location point',
    polygon = 'Create a polygon'
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
    type: string, // REPORT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE;
    location?: GEOPOINT3D,
    address?: ADDRESS,
    media: FILE_FS_DATA[],
    mediaFileIds: MAP<boolean>,
    eventIds: string[],
    comments: COMMENT[],
    idView: string
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
    type: string, // REPORT_TYPE,
    description: string,
    idView: string,
    modeDefine: REPORT_DATA_MD,
}
export type REPORT_DATA_MD = {
    styles: {
        icon: string,
        mapIcon: string,
        selectedIcon: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        time: TABLE_DATA_MD,
        message: TABLE_DATA_MD,
        priority: TABLE_DATA_MD,
        link: TABLE_DATA_MD,
        map: TABLE_DATA_MD,
        attachment: TABLE_DATA_MD,
    }
}

export type TABLE_DATA_MD = {
    type: 'image' | 'matIcon' | 'text' | 'date',
    data: any,
    color?: string
}

export type EVENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    time: number,
    createdBy: string,
    title: string,
    type: string; // EVENT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE,
    location: GEOPOINT3D,
    address: ADDRESS,
    polygon: POINT3D[],
    reportIds: string[],
    comments: COMMENT[],
    idView: string
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
    type: string; // EVENT_TYPE,
    description: string,
    idView: string,
    modeDefine: EVENT_DATA_MD,
}
export type EVENT_DATA_MD = {
    styles: {
        icon: string,
        mapIcon: string,
        selectedIcon: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        time: TABLE_DATA_MD,
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

export type TIMESTAMP = {
    timestamp: number
}


export type FR_DATA_TELEMETRY_REP = {
    timestamp: TIMESTAMP,
    FRs: FR_DATA_REP[],
}
export type FR_DATA_REP = {
    id: ID_TYPE;
    callSign: string;
    type: FR_TYPE;
    location: GEOPOINT3D_SHORT;
    lastUpdated: TIMESTAMP;
    online: boolean;
    status: FR_STATUS;
}
export type FR_DATA_TELEMETRY = {
    timestamp: TIMESTAMP,
    FRs: FR_DATA[]
}
export type FR_DATA = {
    id: ID_TYPE;
    callSign: string;
    type: FR_TYPE;
    location: GEOPOINT3D;
    lastUpdated: TIMESTAMP;
    online: boolean;
    status: FR_STATUS;
}
export type FR_DATA_UI = FR_DATA & {
    modeDefine: FR_DATA_MD,
}
export type FR_DATA_MD = {
    styles: {
        mapIcon: string,
        color: string,
        dotColor: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        status: TABLE_DATA_MD,
    }
}



export type AV_DATA_TELEMETRY_REP = {
    timestamp: TIMESTAMP,
    drones: AV_DATA_REP[]
}
export type AV_DATA_REP = {
    id: ID_TYPE;
    type: AIR_VEHICLE_TYPE;
    location: GEOPOINT3D_SHORT;
    gpsQuality: number;
    energyLevel: number;
    remainingTimeFlight: number;
    heading: number;
    altitudeAGL: number;
    altitudeAsl: number;
    velocity: number;
    lastUpdateTimeFromDrone: TIMESTAMP;
    commStatus: COMM_STATUS;
    operationalStatus: OPERATIONAL_STATUS;
    capability: CAPABILITY[];
    routeId: string;
    name: string;
}
export type AV_DATA_TELEMETRY = {
    timestamp: TIMESTAMP,
    drones: AV_DATA[]
}
export type AV_DATA = {
    id: ID_TYPE;
    type: AIR_VEHICLE_TYPE;
    location: GEOPOINT3D;
    gpsQuality: number;
    energyLevel: number;
    remainingTimeFlight: number;
    heading: number;
    altitudeAGL: number;
    altitudeAsl: number;
    velocity: number;
    lastUpdateTimeFromDrone: TIMESTAMP;
    commStatus: COMM_STATUS;
    operationalStatus: OPERATIONAL_STATUS;
    capability: CAPABILITY[];
    routeId: string;
    linkedMissionId: ID_TYPE;
    name: string;
}
export type AV_DATA_UI = AV_DATA & {
    modeDefine: AV_DATA_MD,
    missionName: string;
    missionOptions: AV_OPTIONS;
}
export type AV_DATA_MD = {
    styles: {
        mapIcon: string,
        statusColor: string,
        iconSize: number,
    }
}


export enum MISSION_TYPE {
    commRelayMission = 'commRelayMission',
    followPathMission = 'followPathMission',
    observationMission = 'observationMission',
    scanMission = 'scanMission',
    servoingMission = 'servoingMission',
    deliveryMission = 'deliveryMission',
}
export type AV_OPTIONS = {
    [MISSION_TYPE.commRelayMission]?: boolean,
    [MISSION_TYPE.followPathMission]?: boolean,
    [MISSION_TYPE.observationMission]?: boolean,
    [MISSION_TYPE.scanMission]?: boolean,
    [MISSION_TYPE.servoingMission]?: boolean,
    [MISSION_TYPE.deliveryMission]?: boolean
}
export enum MISSION_TYPE_TEXT {
    commRelayMission = 'Comm mission',
    followPathMission = 'Patrol mission',
    observationMission = 'Observation mission',
    scanMission = 'Scan mission',
    servoingMission = 'Follow an entity',
    deliveryMission = 'Cargo drop mission',
}


export type COMM_RELAY_MISSION_REQUEST = {
    droneId: ID_TYPE,
    commRelayType: COMM_RELAY_TYPE,
    missionData:
        { point: GEOPOINT3D_SHORT } |
        { area: {coordinates: GEOPOINT3D_SHORT[]}} |
        { FRs: string[]},
    status: MISSION_STATUS
}
export type FOLLOW_PATH_REQUEST = {
    droneId: ID_TYPE,
    polyline: { coordinates: GEOPOINT3D_SHORT[] },
    yawOrientation: YAW_ORIENTATION,
    gimbalAzimuth: number,
    status: MISSION_STATUS
}
export type OBSERVATION_MISSION_REQUEST = {
    droneId: ID_TYPE,
    observationPoint: GEOPOINT3D_SHORT,
    altitudeOffset: number,
    observationAzimuth: number,
    status: MISSION_STATUS
}
export type SCAN_MISSION_REQUEST = {
    droneId: ID_TYPE,
    polygon: { coordinates: GEOPOINT3D_SHORT[] },
    scanAngle: number,
    scanSpeed: SCAN_SPEED,
    overlapPrecent: number,
    cameraFOV: number,
    status: MISSION_STATUS
}
export type SERVOING_MISSION_REQUEST = {
    droneId: ID_TYPE,
    targetId: number
}
export type Delivery_MISSION_REQUEST = {
    droneId: ID_TYPE,
}


export type MISSION_DATA_UI = {
    id: ID_TYPE;
}



export enum COMM_RELAY_TYPE {
    Fixed = 'Fixed',
    Area = 'Area',
    Follow = 'Follow',
}

export enum YAW_ORIENTATION {
    Body = 'Body',
    North = 'North'
}


export enum MISSION_STATUS {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum MISSION_STATUS_UI {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',

    New = 'new',
    WaitingForApproval = 'WaitingForApproval',
    Approve = 'Approve',
    Rejected = 'Rejected'

}

export enum SCAN_SPEED {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}


export enum FR_TYPE {
    police = 'Police',
    fireFighter = 'FireFighter',
    paramedic = 'Med'
}

export enum AIR_VEHICLE_TYPE {
    Alpha = 'Alpha',
    Dji = 'Dji',
    Pixhawk = 'Pixhawk',
}

export enum COMM_STATUS {
    OK = 'OK',
    NoComm = 'NoComm',
}

export enum OPERATIONAL_STATUS {
    Ready = 'Ready',
    OnMission = 'OnMission',
    NotActive = 'NotActive',
    Fail = 'Fail',
    RH = 'RH',
    Land = 'Land',
    Emergency = 'Emergency',
}

export enum CAPABILITY {
    Surveillance = 'Surveillance',
    Patrol = 'Patrol',
    Scan = 'Scan',
    Delivery = 'Delivery',
    CommRely = 'CommRely',
}




export enum FR_STATUS {
    busy = 'Busy',
    available = 'Available',
}

export enum TASK_ACTION {
    accept = 'accept',
    reject = 'reject',
    complete = 'complete',
    cancel = 'cancel'
}
export type USER_TASK_ACTION = {
    userId: ID_TYPE,
    taskId: ID_TYPE,
    action: TASK_ACTION
}

export type OSCC_TASK_ACTION = {
    taskId: ID_TYPE,
    action: TASK_ACTION
}

export type TASK_DATA = {
    id: ID_TYPE;
    time: number;
    createdBy: string;
    title: string;
    type: string; // TASK_TYPE;
    priority: PRIORITY;
    description: string;
    resources: string;
    status: TASK_STATUS;
    geographicInstructions: GEOGRAPHIC_INSTRUCTION[];
    assigneeIds: ID_TYPE[];
    comments: COMMENT[]
    idView: string;
    isSendToMobile: boolean;
    taskActionByUser: MAP<TASK_ACTION> // key - userId
}

export type TASK_DATA_UI = TASK_DATA & {
    assignees: FR_DATA_UI[],
    modeDefine: TASK_DATA_MD,
}
export type TASK_DATA_MD = {
    styles: {
        dotColor: string,
        textColor: string,
    },
    tableData: {
        priority: TABLE_DATA_MD,
        assignees: TABLE_DATA_MD,
    }
}

export type GEOGRAPHIC_INSTRUCTION_MD = {
    styles: {
        mapIcon: string,
        iconSize: number
    }
}

export enum GEOGRAPHIC_INSTRUCTION_TYPE {
    arrow = 'Arrow',
    address = 'Address',
    point = 'Point',
    polygon = 'Polygon',
    polyline = 'Polyline'
}

export type GEOGRAPHIC_INSTRUCTION = {
    id: string,
    type: GEOGRAPHIC_INSTRUCTION_TYPE,
    location: GEOPOINT3D,
    description: string,
    address: ADDRESS,
    arrow: POINT[] | POINT3D[],
    polygon: POINT3D[],
    polyline: POINT3D[],
    modeDefine: GEOGRAPHIC_INSTRUCTION_MD
}

export enum TASK_STATUS {
    pending = 'Pending',
    inProgress = 'In Progress',
    rejected = 'Rejected',
    completed = 'Completed',
    cancelled = 'Cancelled'
}


// export enum TASK_TYPE { // TODO - change data fields
//     general = 'general',
//     rescue = 'rescue',
//     fire = 'fire'
// }

export enum MEDIA_TYPE {
    unknown = 'unknown',
    image = 'image',
    video = 'video',
}

export type FILE_FS_DATA = {
    thumbnail: string,
    url: string,
    id: ID_TYPE,
    type: MEDIA_TYPE,

    fullUrl?: string,
    fullThumbnail?: string
};

export enum FILE_STATUS {
    unknown = 'unknown',
    inProcess = 'inProcess',
    downloaded = 'downloaded',
    error = 'error',
    notFund = 'notFund',
    needToDownload = 'needToDownload',
}

export type FILE_DB_DATA = {
    id: ID_TYPE,
    type: MEDIA_TYPE,
    fileName: string,
    fsName: string,
    fsPath: string,
    fileStatus: FILE_STATUS,
};

export type FILE_DB_FS_DATA = {
    fileDbData: FILE_DB_DATA,
    fileFsData: FILE_FS_DATA
} ;

export type UPDATE_FILE_STATUS = {
    id: ID_TYPE,
    fileStatus: FILE_STATUS,

};
export type FILE_GW_DATA = FILE_DB_DATA & {
    byteArray: string,

};

export enum TASK_TYPE {
    fireInTheCity = 'fireInTheCity',
    carAccident = 'carAccident',
    forestFire = 'forestFire',
};


export enum SOCKET_IO_CLIENT_TYPES {
    MG = 'MG',
    CCG = 'CCG',
    FRS = 'FRS',
    MS = 'MS',
}

export enum SOCKET_CLIENT_TYPES {
    DroneTelemetrySenderRep = 'DroneTelemetrySenderRep',
    FRTelemetryReceiverRep = 'FRTelemetryReceiverRep',
}
